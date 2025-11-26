# Create Azure Container Instance for HealthExtent API
param(
    [Parameter(Mandatory=$false)]
    [string]$ContainerName = "he-api-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "he-rg-apps-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",

    [Parameter(Mandatory=$false)]
    [string]$RegistryName = "heacrdeveus2",

    [Parameter(Mandatory=$false)]
    [string]$ImageName = "healthextent-api",

    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest",

    [Parameter(Mandatory=$false)]
    [string]$KeyVaultName = "he-kv-dev-eus2",

    [Parameter(Mandatory=$false)]
    [int]$Port = 8080,

    [Parameter(Mandatory=$false)]
    [double]$Cpu = 1.0,

    [Parameter(Mandatory=$false)]
    [double]$Memory = 1.5
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create Azure Container Instance" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Container: $ContainerName" -ForegroundColor White
Write-Host "  Resource Group: $ResourceGroup" -ForegroundColor White
Write-Host "  Location: $Location" -ForegroundColor White
Write-Host "  CPU: $Cpu cores" -ForegroundColor White
Write-Host "  Memory: $Memory GB" -ForegroundColor White
Write-Host "  Port: $Port" -ForegroundColor White
Write-Host ""

# Step 1: Get ACR credentials
Write-Host "Step 1: Getting ACR credentials..." -ForegroundColor Cyan

$registry = az acr show --name $RegistryName --resource-group $ResourceGroup | ConvertFrom-Json
$loginServer = $registry.loginServer

$credentials = az acr credential show --name $RegistryName | ConvertFrom-Json
$acrUsername = $credentials.username
$acrPassword = $credentials.passwords[0].value

$fullImageName = "$loginServer/${ImageName}:$ImageTag"

Write-Host "  Registry: $loginServer" -ForegroundColor White
Write-Host "  Image: $fullImageName" -ForegroundColor White
Write-Host ""

# Step 2: Create Container Instance
Write-Host "Step 2: Creating Container Instance..." -ForegroundColor Cyan
Write-Host "  This may take 2-3 minutes..." -ForegroundColor Yellow
Write-Host ""

$keyVaultUri = "https://$KeyVaultName.vault.azure.net/"

# Get secrets from Key Vault for fallback configuration
Write-Host "  Retrieving secrets from Key Vault for fallback configuration..." -ForegroundColor Gray
$jwtSecret = az keyvault secret show --vault-name $KeyVaultName --name JwtSecretKey --query "value" -o tsv
$jwtIssuer = az keyvault secret show --vault-name $KeyVaultName --name JwtIssuer --query "value" -o tsv
$jwtAudience = az keyvault secret show --vault-name $KeyVaultName --name JwtAudience --query "value" -o tsv
$connectionString = az keyvault secret show --vault-name $KeyVaultName --name "ConnectionStrings--HealthExtentDb" --query "value" -o tsv

az container create `
    --name $ContainerName `
    --resource-group $ResourceGroup `
    --location $Location `
    --image $fullImageName `
    --os-type Linux `
    --registry-login-server $loginServer `
    --registry-username $acrUsername `
    --registry-password $acrPassword `
    --cpu $Cpu `
    --memory $Memory `
    --dns-name-label $ContainerName `
    --ports $Port `
    --protocol TCP `
    --restart-policy Always `
    --assign-identity `
    --environment-variables `
        ASPNETCORE_ENVIRONMENT=Production `
        KeyVaultUri=$keyVaultUri `
        ASPNETCORE_URLS="http://+:$Port" `
    --secure-environment-variables `
        "Jwt__SecretKey=$jwtSecret" `
        "Jwt__Issuer=$jwtIssuer" `
        "Jwt__Audience=$jwtAudience" `
        "ConnectionStrings__HealthExtentDb=$connectionString" `
    --output table

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  ERROR: Failed to create Container Instance" -ForegroundColor Red
    exit 1
}
Write-Host ""
Write-Host "  SUCCESS: Container Instance created!" -ForegroundColor Green
Write-Host ""

# Step 3: Get Managed Identity Principal ID
Write-Host "Step 3: Configuring Managed Identity..." -ForegroundColor Cyan

Start-Sleep -Seconds 5  # Wait for identity to be created

$container = az container show --name $ContainerName --resource-group $ResourceGroup | ConvertFrom-Json
$principalId = $container.identity.principalId

if ([string]::IsNullOrEmpty($principalId)) {
    Write-Host "  WARNING: Could not get Principal ID immediately" -ForegroundColor Yellow
    Write-Host "  Waiting 10 more seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    $container = az container show --name $ContainerName --resource-group $ResourceGroup | ConvertFrom-Json
    $principalId = $container.identity.principalId
}

Write-Host "  Principal ID: $principalId" -ForegroundColor White
Write-Host ""

# Step 4: Grant Key Vault access
Write-Host "Step 4: Granting Key Vault access..." -ForegroundColor Cyan

az keyvault set-policy `
    --name $KeyVaultName `
    --object-id $principalId `
    --secret-permissions get list `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: Key Vault access granted!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to grant Key Vault access" -ForegroundColor Red
    Write-Host "  You may need to grant access manually later" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Get Container details
Write-Host "Step 5: Getting container details..." -ForegroundColor Cyan

$container = az container show --name $ContainerName --resource-group $ResourceGroup | ConvertFrom-Json

$fqdn = $container.ipAddress.fqdn
$ip = $container.ipAddress.ip
$state = $container.instanceView.state

Write-Host "  FQDN: $fqdn" -ForegroundColor White
Write-Host "  IP: $ip" -ForegroundColor White
Write-Host "  State: $state" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Container Instance Created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Container: $ContainerName" -ForegroundColor White
Write-Host "  FQDN: $fqdn" -ForegroundColor White
Write-Host "  IP Address: $ip" -ForegroundColor White
Write-Host "  Port: $Port" -ForegroundColor White
Write-Host "  CPU: $Cpu cores" -ForegroundColor White
Write-Host "  Memory: $Memory GB" -ForegroundColor White
Write-Host "  State: $state" -ForegroundColor White
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Environment: Production" -ForegroundColor White
Write-Host "  Key Vault: $keyVaultUri" -ForegroundColor White
Write-Host "  Managed Identity: Enabled" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "  API Base: http://$fqdn`:$Port" -ForegroundColor White
Write-Host "  Health Check: http://$fqdn`:$Port/health" -ForegroundColor White
Write-Host ""
Write-Host "Test it:" -ForegroundColor Yellow
Write-Host "  curl http://$fqdn`:$Port/health" -ForegroundColor White
Write-Host ""
Write-Host "View logs:" -ForegroundColor Yellow
Write-Host "  az container logs --name $ContainerName --resource-group $ResourceGroup" -ForegroundColor White
Write-Host ""
Write-Host "Monitor container:" -ForegroundColor Yellow
Write-Host "  az container show --name $ContainerName --resource-group $ResourceGroup" -ForegroundColor White
Write-Host ""
Write-Host "Note: Container may take 30-60 seconds to fully start" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
