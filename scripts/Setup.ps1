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
            @{
                Id                      = [Guid]::NewGuid()
                AdminConsentDisplayName = 'Read the Naughty / Nice list'
                AdminConsentDescription = 'Read the Naughty / Nice list'
                UserConsentDisplayName  = 'Read the Naughty / Nice list'
                UserConsentDescription  = 'Read the Naughty / Nice list'
                Type                    = 'User'
                Value                   = 'NaughtyNiceList.Read'
            }
            @{
                Id                      = [Guid]::NewGuid()
                AdminConsentDisplayName = 'Organise present delivery'
                AdminConsentDescription = 'Organise present delivery'
                UserConsentDisplayName  = 'Organise present delivery'
                UserConsentDescription  = 'Organise present delivery'
                Type                    = 'User'
                Value                   = 'PresentDeliveryRoute.Write'
            }
        )
    }

    $appRoles = @(
        @{
            AllowedMemberType = @( 'User' )
            Id                = [Guid]::NewGuid()
            IsEnabled         = $true
            Value             = 'SeniorEmployee'
            DisplayName       = 'SantaWorld Senior Employee'
            Description       = 'Allowed to update important present delivery information'
        }
        @{
            AllowedMemberType = @( 'User' )
            Id                = [Guid]::NewGuid()
            IsEnabled         = $true
            DisplayName       = 'SantaWorld Employee'
            Value             = 'Employee'
            Description       = 'Allowed to look at present delivery information'
        }
    )

    $santaWeb = New-AzADApplication -DisplayName 'SantaWeb' -IdentifierUri 'api://santaweb' -Api $api -AppRole $appRoles
    $santaLite = New-AzADApplication -DisplayName 'SantaLite' -SPARedirectUri 'https://santalite.localtest.me/signin-oidc'

    $santaLiteServicePrincipal = New-AzADServicePrincipal -ApplicationId $santaLite.AppId
    $santaWebServicePrincipal = New-AzADServicePrincipal -ApplicationId $santaWeb.AppId

    $params = @{
        santaWebApplicationId       = $santaWeb.AppId
        santaWebServicePrincipalId = $santaWebServicePrincipal.Id
        santaLiteApplicationId      = $santaLite.AppId
        santaLiteServicePrincipalId = $santaLiteServicePrincipal.Id
    }

    $bicepFile = "$PSScriptRoot\store-ids.bicep"
    Write-Host $bicepFile
    New-AzSubscriptionDeployment -Name "SantaDemo" -Location "Australia East" -TemplateFile  $bicepFile -TemplateParameterObject $params

    $spaConfig = (Get-Content -Path "$PSScriptRoot\msalConfig.template.js")
    $spaConfig = $spaConfig.Replace('<clientid>', $santaLite.AppId).Replace('<tenantid>', $TenantId)
    $spaConfig | Set-Content -Path "$PSScriptRoot\..\Spa\SantaLite\src\msalConfig.ts"

    $apiConfig = (Get-Content -Path "$PSScriptRoot\appsettings.template.json")
    $apiConfig = $apiConfig.Replace('<clientid>', $santaWeb.AppId).Replace('<tenantid>', $TenantId)
    $apiConfig | Set-Content -Path "$PSScriptRoot\..\Api\SantaWeb\appsettings.json"

    $controlllerClass = (Get-Content -Path "$PSScriptRoot\NewNaughtyNiceListController.cs")
    $controlllerClass | Set-Content -Path "$PSScriptRoot\..\Api\SantaWeb\Features\NaughtyNiceList\NewNaughtyNiceListController.cs"

}

Set-AzContext -Tenant $TenantId 
ClearUp
Setup
Write-Host "Setup Demo"

