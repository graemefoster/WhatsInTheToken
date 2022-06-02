#Requires -Modules Az

param (
    [Parameter(Mandatory)]$TenantId 
)


function ClearUp 
{
    # Check for the deployment with the ids we need to remove
    $deployment = Get-AzDeployment -Name "SantaDemo" -ErrorAction Ignore
    if ($null -ne $deployment) {

        $applicationId = $deployment.Outputs['santaWebApplicationId'].Value
        Remove-AzADApplication -ApplicationId $applicationId

        $applicationId = $deployment.Outputs['santaLiteApplicationId'].Value
        Remove-AzADApplication -ApplicationId $applicationId
        
        $deployment | Remove-AzDeployment

    } else {
        Write-Host "No existing deployment found"
    }
}

function Setup
{
    $santaWeb = New-AzADApplication -DisplayName 'SantaWeb' -IdentifierUri 'api://santaweb/'
    $santaLite = New-AzADApplication -DisplayName 'SantaLite' -ReplyUrls 'https://santalite.localtest.me/signin-oidc'
    $santaLiteServicePrincipal = New-AzADServicePrincipal -ApplicationId $santaLite.AppId

    $params = @{
        santaWebApplicationId = $santaWeb.AppId
        santaLiteApplicationId = $santaLite.AppId
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

