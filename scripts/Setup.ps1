#Requires -Modules Az

param (
    [Parameter(Mandatory)]$TenantId 
)


function ClearUp {
    # Check for the deployment with the ids we need to remove
    $deployment = Get-AzDeployment -Name "SantaDemo" -ErrorAction Ignore
    if ($null -ne $deployment) {

        $santaWebApplicationId = $deployment.Outputs['santaWebApplicationId'].Value
        Remove-AzADApplication -ApplicationId $santaWebApplicationId
        Write-Host "Removed SantaWeb application $santaWebApplicationId"

        $santaLiteApplicationId = $deployment.Outputs['santaLiteApplicationId'].Value
        Remove-AzADApplication -ApplicationId $santaLiteApplicationId
        Write-Host "Removed SantaLite application $santaLiteApplicationId"
        
        $deployment | Remove-AzDeployment

    }
    else {
        Write-Host "No existing deployment found"
    }
}

function Setup {

    $api = @{
        Oauth2PermissionScope = @(
            @{
                Id                      = [Guid]::NewGuid()
                AdminConsentDisplayName = 'Change the Naughty / Nice list'
                AdminConsentDescription = 'Change the Naughty / Nice list'
                UserConsentDisplayName  = 'Change the Naughty / Nice list'
                UserConsentDescription  = 'Change the Naughty / Nice list'
                Type                    = 'User'
                Value                   = 'NaughtyNiceList.Write'
            }
        )
    }

    $appRoles = @(
        @{
            AllowedMemberType = @( 'User' )
            Id                = [Guid]::NewGuid()
            IsEnabled         = $true
            Value             = 'SeniorContributor'
            DisplayName       = 'SantaWorld Senior Employee'
            Description       = 'Allowed to update important present delivery information'
        }
        @{
            AllowedMemberType = @( 'User' )
            Id                = [Guid]::NewGuid()
            IsEnabled         = $true
            DisplayName       = 'SantaWorld Employee'
            Value             = 'Reader'
            Description       = 'Allowed to look at present delivery information'
        }
    )

    $santaWeb = New-AzADApplication -DisplayName 'SantaWeb' -IdentifierUri 'api://santaweb' -Api $api -AppRole $appRoles

    $santaLite = New-AzADApplication -DisplayName 'SantaLite'  -SPARedirectUri 'https://santalite.localtest.me/signin-oidc'
    $santaLiteServicePrincipal = New-AzADServicePrincipal -ApplicationId $santaLite.AppId

    $params = @{
        santaWebApplicationId       = $santaWeb.AppId
        santaLiteApplicationId      = $santaLite.AppId
        santaLiteServicePrincipalId = $santaLiteServicePrincipal.Id
    }

    $bicepFile = "$PSScriptRoot\store-ids.bicep"
    Write-Host $bicepFile
    New-AzSubscriptionDeployment -Name "SantaDemo" -Location "Australia East" -TemplateFile  $bicepFile -TemplateParameterObject $params

    $spaConfig = (Get-Content -Path "$PSScriptRoot\msalConfig.template.js")
    $spaConfig = $spaConfig.Replace('<clientid>', $santaLite.AppId).Replace('<tenantid>', $TenantId)
    $spaConfig | Set-Content -Path "$PSScriptRoot\..\Spa\new-breakpoint-spa\src\msalConfig.js"

    $apiConfig = (Get-Content -Path "$PSScriptRoot\appsettings.template.json")
    $apiConfig = $apiConfig.Replace('<clientid>', $santaWeb.AppId).Replace('<tenantid>', $TenantId)
    $apiConfig | Set-Content -Path "$PSScriptRoot\..\Api\SantaWeb\appsettings.json"

}

Set-AzContext -Tenant $TenantId 
ClearUp
Setup
Write-Host "Setup Demo"

