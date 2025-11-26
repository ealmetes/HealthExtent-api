# Create Azure Container Instance with Proper Secret Configuration
$ContainerName = "he-api-dev-eus2"
$ResourceGroup = "he-rg-apps-dev-eus2"
$Location = "eastus2"
$RegistryName = "heacrdeveus2"
$ImageName = "healthextent-api"
$ImageTag = "latest"
$KeyVaultName = "he-kv-dev-eus2"
$Cpu = 1
$Memory = 1.5
$Port = 8080

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create Azure Container Instance (Fixed)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get ACR credentials
Write-Host "Step 1: Getting ACR credentials..." -ForegroundColor Cyan
$credentials = az acr credential show --name $RegistryName | ConvertFrom-Json
$acrUsername = $credentials.username
$acrPassword = $credentials.passwords[0].value
$fullImageName = "$RegistryName.azurecr.io/${ImageName}:$ImageTag"

Write-Host "  Image: $fullImageName" -ForegroundColor White
Write-Host ""

# Step 2: Retrieve secrets from Key Vault
Write-Host "Step 2: Retrieving secrets from Key Vault..." -ForegroundColor Cyan
$jwtSecret = az keyvault secret show --vault-name $KeyVaultName --name JwtSecretKey --query "value" -o tsv
$jwtIssuer = az keyvault secret show --vault-name $KeyVaultName --name JwtIssuer --query "value" -o tsv
$jwtAudience = az keyvault secret show --vault-name $KeyVaultName --name JwtAudience --query "value" -o tsv
$connectionString = az keyvault secret show --vault-name $KeyVaultName --name "ConnectionStrings--HealthExtentDb" --query "value" -o tsv

Write-Host "  JWT Secret: $(if($jwtSecret){'Retrieved ✓'}else{'Failed ✗'})" -ForegroundColor $(if($jwtSecret){'Green'}else{'Red'})
Write-Host "  JWT Issuer: $jwtIssuer" -ForegroundColor White
Write-Host "  JWT Audience: $jwtAudience" -ForegroundColor White
Write-Host "  Connection String: $(if($connectionString){'Retrieved ✓'}else{'Failed ✗'})" -ForegroundColor $(if($connectionString){'Green'}else{'Red'})
Write-Host ""

# Step 3: Create Container Instance
Write-Host "Step 3: Creating Container Instance..." -ForegroundColor Cyan
Write-Host "  This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

$keyVaultUri = "https://$KeyVaultName.vault.azure.net/"

az container create `
    --name $ContainerName `
    --resource-group $ResourceGroup `
    --location $Location `
    --image $fullImageName `
    --registry-login-server "$RegistryName.azurecr.io" `
    --registry-username $acrUsername `
    --registry-password $acrPassword `
    --cpu $Cpu `
    --memory $Memory `
    --ports $Port `
    --dns-name-label $ContainerName `
    --os-type Linux `
    --restart-policy Always `
    --assign-identity "[system]" `
    --environment-variables `
        "ASPNETCORE_ENVIRONMENT=Production" `
        "KeyVaultUri=$keyVaultUri" `
        "ASPNETCORE_URLS=http://+:8080" `
    --secure-environment-variables `
        "Jwt__SecretKey=$jwtSecret" `
        "Jwt__Issuer=$jwtIssuer" `
        "Jwt__Audience=$jwtAudience" `
        "ConnectionStrings__HealthExtentDb=$connectionString" `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  SUCCESS: Container Instance created!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "  ERROR: Failed to create Container Instance" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Step 4: Get Managed Identity
Write-Host "Step 4: Getting Managed Identity..." -ForegroundColor Cyan
$identity = az container show --name $ContainerName --resource-group $ResourceGroup --query "identity.principalId" -o tsv
Write-Host "  Principal ID: $identity" -ForegroundColor White
Write-Host ""

# Step 5: Grant Key Vault access
Write-Host "Step 5: Granting Key Vault access..." -ForegroundColor Cyan
az keyvault show --name $KeyVaultName --output table
az keyvault set-policy `
    --name $KeyVaultName `
    --object-id $identity `
    --secret-permissions get list `
    --output none

Write-Host "  SUCCESS: Key Vault access granted!" -ForegroundColor Green
Write-Host ""

# Step 6: Wait for container to start
Write-Host "Step 6: Waiting for container to start (30 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Step 7: Get container details
Write-Host "Step 7: Getting container details..." -ForegroundColor Cyan
$containerInfo = az container show --name $ContainerName --resource-group $ResourceGroup | ConvertFrom-Json
$fqdn = $containerInfo.ipAddress.fqdn
$ip = $containerInfo.ipAddress.ip
$state = $containerInfo.instanceView.state
$containerState = $containerInfo.containers[0].instanceView.currentState.state

Write-Host "  FQDN: $fqdn" -ForegroundColor White
Write-Host "  IP: $ip" -ForegroundColor White
Write-Host "  State: $state" -ForegroundColor White
Write-Host "  Container State: $containerState" -ForegroundColor White
Write-Host ""

# Step 8: Test health endpoint
Write-Host "Step 8: Testing health endpoint..." -ForegroundColor Cyan
try {
    $healthUrl = "http://$($fqdn):8080/health"
    Write-Host "  URL: $healthUrl" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 10
    Write-Host "  Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "  Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "  Health check failed (container may still be starting): $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "  Try again in a minute: curl http://$($fqdn):8080/health" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Container Instance Created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API URLs:" -ForegroundColor White
Write-Host "  Base: http://$($fqdn):8080" -ForegroundColor Cyan
Write-Host "  Health: http://$($fqdn):8080/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "View logs:" -ForegroundColor White
Write-Host "  az container logs --name $ContainerName --resource-group $ResourceGroup" -ForegroundColor Gray
Write-Host ""
