# Create Azure App Service for HealthExtent API
param(
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "he-api-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "he-rg-apps-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",

    [Parameter(Mandatory=$false)]
    [string]$KeyVaultName = "he-kv-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$Sku = "B1"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create Azure App Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  App Service: $AppServiceName" -ForegroundColor White
Write-Host "  Resource Group: $ResourceGroup" -ForegroundColor White
Write-Host "  Location: $Location" -ForegroundColor White
Write-Host "  SKU: $Sku" -ForegroundColor White
Write-Host "  Key Vault: $KeyVaultName" -ForegroundColor White
Write-Host ""

# Step 1: Create Resource Group if needed
Write-Host "Step 1: Ensuring Resource Group exists..." -ForegroundColor Cyan
$rgExists = az group exists --name $ResourceGroup

if ($rgExists -eq "false") {
    Write-Host "  Creating Resource Group..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location --output table

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  SUCCESS: Resource Group created!" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Failed to create Resource Group" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  Resource Group already exists!" -ForegroundColor Green
}
Write-Host ""

# Step 2: Create App Service Plan
Write-Host "Step 2: Creating App Service Plan..." -ForegroundColor Cyan
$planName = "$AppServiceName-plan"

az appservice plan create `
    --name $planName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku $Sku `
    --is-linux `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: App Service Plan created!" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Plan may already exist or creation failed" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Create App Service
Write-Host "Step 3: Creating App Service..." -ForegroundColor Cyan

az webapp create `
    --name $AppServiceName `
    --resource-group $ResourceGroup `
    --plan $planName `
    --runtime "DOTNET|8.0" `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: App Service created!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to create App Service" -ForegroundColor Red
    Write-Host "  This might be because the name is already taken globally" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 4: Enable Managed Identity
Write-Host "Step 4: Enabling Managed Identity..." -ForegroundColor Cyan

az webapp identity assign `
    --name $AppServiceName `
    --resource-group $ResourceGroup `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: Managed Identity enabled!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to enable Managed Identity" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Get Principal ID and grant Key Vault access
Write-Host "Step 5: Configuring Key Vault access..." -ForegroundColor Cyan

$identity = az webapp identity show `
    --name $AppServiceName `
    --resource-group $ResourceGroup | ConvertFrom-Json

$principalId = $identity.principalId
Write-Host "  Principal ID: $principalId" -ForegroundColor White

az keyvault set-policy `
    --name $KeyVaultName `
    --object-id $principalId `
    --secret-permissions get list `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: Key Vault access granted!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to grant Key Vault access" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Configure App Settings
Write-Host "Step 6: Configuring App Settings..." -ForegroundColor Cyan
$keyVaultUri = "https://$KeyVaultName.vault.azure.net/"

az webapp config appsettings set `
    --name $AppServiceName `
    --resource-group $ResourceGroup `
    --settings `
        ASPNETCORE_ENVIRONMENT=Production `
        KeyVaultUri=$keyVaultUri `
        ASPNETCORE_URLS="http://+:8080" `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: App Settings configured!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to configure App Settings" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 7: Configure HTTPS only
Write-Host "Step 7: Enabling HTTPS only..." -ForegroundColor Cyan

az webapp update `
    --name $AppServiceName `
    --resource-group $ResourceGroup `
    --set httpsOnly=true `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: HTTPS only enabled!" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Could not enable HTTPS only" -ForegroundColor Yellow
}
Write-Host ""

# Get the default hostname
$app = az webapp show --name $AppServiceName --resource-group $ResourceGroup | ConvertFrom-Json
$hostname = $app.defaultHostName

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "App Service Created Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  App Service: $AppServiceName" -ForegroundColor White
Write-Host "  URL: https://$hostname" -ForegroundColor White
Write-Host "  Resource Group: $ResourceGroup" -ForegroundColor White
Write-Host "  SKU: $Sku" -ForegroundColor White
Write-Host "  Managed Identity: Enabled" -ForegroundColor White
Write-Host "  Key Vault Access: Granted" -ForegroundColor White
Write-Host "  HTTPS Only: Enabled" -ForegroundColor White
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Environment: Production" -ForegroundColor White
Write-Host "  Key Vault URI: $keyVaultUri" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Deploy your API: .\deploy-api.ps1" -ForegroundColor White
Write-Host "  2. Test: https://$hostname/health" -ForegroundColor White
Write-Host "  3. View logs: az webapp log tail --name $AppServiceName --resource-group $ResourceGroup" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
