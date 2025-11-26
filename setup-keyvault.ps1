# Azure Key Vault Setup Script for HealthExtent API
# This script creates and configures Azure Key Vault for production secrets

param(
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionId = "",

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "he-rg-data-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",

    [Parameter(Mandatory=$false)]
    [string]$KeyVaultName = "he-kv-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "he-api-dev-eus2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Azure Key Vault Setup for HealthExtent" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
Write-Host "Checking Azure CLI..." -ForegroundColor Yellow
try {
    $azVersion = az version --output json | ConvertFrom-Json
    Write-Host "  Azure CLI version: $($azVersion.'azure-cli')" -ForegroundColor Green
}
catch {
    Write-Host "  ERROR: Azure CLI is not installed!" -ForegroundColor Red
    Write-Host "  Install from: https://aka.ms/installazurecliwindows" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Login to Azure (if not already logged in)
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json

if ($null -eq $account) {
    Write-Host "  Not logged in. Opening browser for authentication..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}

Write-Host "  Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host "  Subscription: $($account.name)" -ForegroundColor Green
Write-Host ""

# Set subscription if provided
if ($SubscriptionId) {
    Write-Host "Setting subscription to: $SubscriptionId" -ForegroundColor Yellow
    az account set --subscription $SubscriptionId
}

# Step 1: Create Key Vault
Write-Host "Step 1: Creating Azure Key Vault..." -ForegroundColor Cyan
Write-Host "  Name: $KeyVaultName" -ForegroundColor Gray
Write-Host "  Resource Group: $ResourceGroup" -ForegroundColor Gray
Write-Host "  Location: $Location" -ForegroundColor Gray
Write-Host ""

$existingKv = az keyvault show --name $KeyVaultName --resource-group $ResourceGroup 2>$null

if ($existingKv) {
    Write-Host "  Key Vault already exists. Skipping creation." -ForegroundColor Yellow
}
else {
    Write-Host "  Creating new Key Vault..." -ForegroundColor Yellow
    az keyvault create `
        --name $KeyVaultName `
        --resource-group $ResourceGroup `
        --location $Location `
        --enable-rbac-authorization false `
        --output table

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  SUCCESS: Key Vault created!" -ForegroundColor Green
    }
    else {
        Write-Host "  ERROR: Failed to create Key Vault" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 2: Generate and store JWT secret key
Write-Host "Step 2: Generating JWT Secret Key..." -ForegroundColor Cyan

# Generate a secure random key (256-bit)
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$jwtSecret = [Convert]::ToBase64String($bytes)

Write-Host "  Generated 256-bit secret key" -ForegroundColor Green
Write-Host "  Storing in Key Vault as 'JwtSecretKey'..." -ForegroundColor Yellow

az keyvault secret set `
    --vault-name $KeyVaultName `
    --name "JwtSecretKey" `
    --value $jwtSecret `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: JWT secret stored!" -ForegroundColor Green
}
else {
    Write-Host "  ERROR: Failed to store JWT secret" -ForegroundColor Red
}

Write-Host ""

# Step 3: Store JWT configuration
Write-Host "Step 3: Storing JWT Configuration..." -ForegroundColor Cyan

az keyvault secret set `
    --vault-name $KeyVaultName `
    --name "JwtIssuer" `
    --value "https://healthextent.com" `
    --output table

az keyvault secret set `
    --vault-name $KeyVaultName `
    --name "JwtAudience" `
    --value "https://healthextent.com" `
    --output table

Write-Host "  SUCCESS: JWT configuration stored!" -ForegroundColor Green
Write-Host ""

# Step 4: Prompt for connection string
Write-Host "Step 4: Storing Database Connection String..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Enter your Azure SQL connection string:" -ForegroundColor Yellow
Write-Host "(Format: Server=tcp:server.database.windows.net,1433;Database=db;...)" -ForegroundColor Gray

$connectionString = Read-Host "Connection String"

if ($connectionString) {
    az keyvault secret set `
        --vault-name $KeyVaultName `
        --name "HealthExtentDbConnectionString" `
        --value $connectionString `
        --output table

    Write-Host "  SUCCESS: Connection string stored!" -ForegroundColor Green
}
else {
    Write-Host "  SKIPPED: No connection string provided" -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Get current user for access policy
Write-Host "Step 5: Configuring Access Policies..." -ForegroundColor Cyan

$currentUser = az ad signed-in-user show | ConvertFrom-Json
$currentUserObjectId = $currentUser.id

Write-Host "  Granting access to: $($currentUser.userPrincipalName)" -ForegroundColor Yellow

az keyvault set-policy `
    --name $KeyVaultName `
    --object-id $currentUserObjectId `
    --secret-permissions get list set delete `
    --output table

Write-Host "  SUCCESS: Access policy configured!" -ForegroundColor Green
Write-Host ""

# Step 6: Show Key Vault information
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Key Vault Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$kvUri = "https://$KeyVaultName.vault.azure.net/"
Write-Host "Key Vault Name: $KeyVaultName" -ForegroundColor Cyan
Write-Host "Key Vault URI: $kvUri" -ForegroundColor Cyan
Write-Host ""

Write-Host "Secrets stored:" -ForegroundColor Yellow
Write-Host "  - JwtSecretKey" -ForegroundColor White
Write-Host "  - JwtIssuer" -ForegroundColor White
Write-Host "  - JwtAudience" -ForegroundColor White
if ($connectionString) {
    Write-Host "  - HealthExtentDbConnectionString" -ForegroundColor White
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Add Azure Key Vault NuGet packages to your API:" -ForegroundColor White
Write-Host "   cd api/HealthExtent.Api" -ForegroundColor Gray
Write-Host "   dotnet add package Azure.Identity" -ForegroundColor Gray
Write-Host "   dotnet add package Azure.Extensions.AspNetCore.Configuration.Secrets" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Update Program.cs to use Key Vault (see setup-keyvault-config.md)" -ForegroundColor White
Write-Host ""

Write-Host "3. If deploying to App Service, enable Managed Identity:" -ForegroundColor White
Write-Host "   az webapp identity assign --name $AppServiceName --resource-group $ResourceGroup" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Grant App Service access to Key Vault:" -ForegroundColor White
Write-Host "   `$appIdentity = az webapp identity show --name $AppServiceName --resource-group $ResourceGroup | ConvertFrom-Json" -ForegroundColor Gray
Write-Host "   az keyvault set-policy --name $KeyVaultName --object-id `$appIdentity.principalId --secret-permissions get list" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Set environment variable in App Service:" -ForegroundColor White
Write-Host "   az webapp config appsettings set --name $AppServiceName --resource-group $ResourceGroup \\" -ForegroundColor Gray
Write-Host "     --settings KeyVaultUri=$kvUri" -ForegroundColor Gray
Write-Host ""

# Save configuration to file
$configFile = "keyvault-config.json"
$config = @{
    KeyVaultName = $KeyVaultName
    KeyVaultUri = $kvUri
    ResourceGroup = $ResourceGroup
    Location = $Location
    CreatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Secrets = @(
        "JwtSecretKey",
        "JwtIssuer",
        "JwtAudience"
    )
}

if ($connectionString) {
    $config.Secrets += "HealthExtentDbConnectionString"
}

$config | ConvertTo-Json -Depth 5 | Set-Content $configFile

Write-Host "Configuration saved to: $configFile" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
