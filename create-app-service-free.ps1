# Create Azure App Service using FREE tier (F1)
# Use this if you have quota issues with B1 tier
param(
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "he-api-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "he-rg-apps-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",

    [Parameter(Mandatory=$false)]
    [string]$KeyVaultName = "he-kv-dev-eus2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create Azure App Service (FREE Tier)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: Using F1 (Free) tier to avoid quota issues" -ForegroundColor Yellow
Write-Host ""

# Step 1: Ensure Resource Group exists
Write-Host "Step 1: Ensuring Resource Group exists..." -ForegroundColor Cyan
$rgExists = az group exists --name $ResourceGroup

if ($rgExists -eq "false") {
    Write-Host "  Creating Resource Group..." -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location --output table
    Write-Host "  SUCCESS!" -ForegroundColor Green
} else {
    Write-Host "  Resource Group exists!" -ForegroundColor Green
}
Write-Host ""

# Step 2: Create App Service Plan with F1 (Free) tier
Write-Host "Step 2: Creating FREE App Service Plan..." -ForegroundColor Cyan
$planName = "$AppServiceName-plan"

az appservice plan create `
    --name $planName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku F1 `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: Free App Service Plan created!" -ForegroundColor Green
} else {
    Write-Host "  WARNING: Plan creation may have failed" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Create App Service
Write-Host "Step 3: Creating App Service..." -ForegroundColor Cyan

az webapp create `
    --name $AppServiceName `
    --resource-group $ResourceGroup `
    --plan $planName `
    --runtime "dotnet:8" `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: App Service created!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to create App Service" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4-7: Same as before (Managed Identity, Key Vault, etc.)
Write-Host "Step 4: Enabling Managed Identity..." -ForegroundColor Cyan
az webapp identity assign --name $AppServiceName --resource-group $ResourceGroup --output table
Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Configuring Key Vault access..." -ForegroundColor Cyan
$identity = az webapp identity show --name $AppServiceName --resource-group $ResourceGroup | ConvertFrom-Json
$principalId = $identity.principalId

az keyvault set-policy `
    --name $KeyVaultName `
    --object-id $principalId `
    --secret-permissions get list `
    --output table

Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host ""

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

Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 7: Enabling HTTPS only..." -ForegroundColor Cyan
az webapp update --name $AppServiceName --resource-group $ResourceGroup --set httpsOnly=true --output table
Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host ""

$app = az webapp show --name $AppServiceName --resource-group $ResourceGroup | ConvertFrom-Json
$hostname = $app.defaultHostName

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "App Service Created Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  URL: https://$hostname" -ForegroundColor Cyan
Write-Host "  Tier: F1 (Free)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ready to deploy: .\deploy-api.ps1" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
