#Requires -Modules AzureAD

function RemoveConsent
 (
    # The service principal (user) object id of the application. Can be found in the Enterprise applications->your application, under the overview blade
    [Parameter(Mandatory = $true)]
    [string] $AzureAdServicePrincipalObjectId,
    # The user principal object id that you want to remove the consent for
    [Parameter(Mandatory = $true)]
    [string] $UserPrincipalObjectId
)

{
# Get Service Principal using objectId
$sp = Get-AzureADServicePrincipal -ObjectId $AzureAdServicePrincipalObjectId
Write-Host "Got service principal"

# Get all delegated permissions for the service principal
$spOAuth2PermissionsGrants = Get-AzureADOAuth2PermissionGrant -All $true | Where-Object { $_.clientId -eq $sp.ObjectId }
Write-Host "Got application grants"

# Remove the consented permissions for the principal
$spOAuth2PermissionsGrants | Where-Object PrincipalId -eq $UserPrincipalObjectId | Remove-AzureADOAuth2PermissionGrant
Write-Host "Removed consent for user"

}

Connect-AzureAD -TenantId '49f24cca-11a6-424d-b2e2-0650053986cc'
RemoveConsent -AzureAdServicePrincipalObjectId '4103fccf-148e-4c0d-8e34-1bc0e259f978' -UserPrincipalObjectId 'b8c2473c-04c3-4321-b0e9-9daf29695023'
RemoveConsent -AzureAdServicePrincipalObjectId '4103fccf-148e-4c0d-8e34-1bc0e259f978' -UserPrincipalObjectId '5a1ebbc8-a63d-4099-a801-8e76f906b88f'
RemoveConsent -AzureAdServicePrincipalObjectId '4103fccf-148e-4c0d-8e34-1bc0e259f978' -UserPrincipalObjectId '2c4b2823-e69f-47ef-8112-e85eb2c39096'
RemoveConsent -AzureAdServicePrincipalObjectId '4103fccf-148e-4c0d-8e34-1bc0e259f978' -UserPrincipalObjectId '3e634841-08ed-4d5d-83f9-0d1735acb843'

Write-Host "Don't forget to:"
Write-Host "  - Remove Santa from his role"
Write-Host "  - Change the redirect URI"
Write-Host "  - Remove the role requirement from the controller"
Write-Host "  - Remove the audience from the web-api"

