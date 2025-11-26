# Configure Azure App Service with Managed Identity and Key Vault
param(
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "he-api-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "he-rg-apps-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$KeyVaultName = "he-kv-dev-eus2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configure App Service with Key Vault" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "App Service: $AppServiceName" -ForegroundColor White
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor White
Write-Host "Key Vault: $KeyVaultName" -ForegroundColor White
Write-Host ""

# Step 1: Check if App Service exists
Write-Host "Step 1: Checking if App Service exists..." -ForegroundColor Cyan
$appService = az webapp show --name $AppServiceName --resource-group $ResourceGroup 2>$null

if ($null -eq $appService) {
    Write-Host "  App Service '$AppServiceName' does not exist yet." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor Yellow
    Write-Host "  A. Create the App Service now" -ForegroundColor White
    Write-Host "  B. Skip this step (configure later when App Service is created)" -ForegroundColor White
    Write-Host ""

    $choice = Read-Host "Choose option (A/B)"

    if ($choice -eq "A" -or $choice -eq "a") {
        Write-Host ""
        Write-Host "Creating App Service..." -ForegroundColor Yellow

        # Create App Service Plan first
        Write-Host "  Creating App Service Plan..." -ForegroundColor Gray
        az appservice plan create `
            --name "$AppServiceName-plan" `
            --resource-group $ResourceGroup `
            --sku B1 `
            --is-linux `
            --output table

        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ERROR: Failed to create App Service Plan" -ForegroundColor Red
            exit 1
        }

        # Create App Service
        Write-Host "  Creating App Service..." -ForegroundColor Gray
        az webapp create `
            --name $AppServiceName `
            --resource-group $ResourceGroup `
            --plan "$AppServiceName-plan" `
            --runtime "DOTNETCORE:8.0" `
            --output table

        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ERROR: Failed to create App Service" -ForegroundColor Red
            exit 1
        }

        Write-Host "  SUCCESS: App Service created!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Skipping App Service configuration." -ForegroundColor Yellow
        Write-Host "Run this script again after creating the App Service." -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "  App Service exists!" -ForegroundColor Green
}

Write-Host ""

# Step 2: Enable Managed Identity
Write-Host "Step 2: Enabling Managed Identity..." -ForegroundColor Cyan
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

# Step 3: Get the Principal ID
Write-Host "Step 3: Getting Managed Identity Principal ID..." -ForegroundColor Cyan
$identity = az webapp identity show `
    --name $AppServiceName `
    --resource-group $ResourceGroup | ConvertFrom-Json

$principalId = $identity.principalId

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
    exit 1
}

Write-Host ""

# Step 5: Configure App Settings
Write-Host "Step 5: Configuring App Settings..." -ForegroundColor Cyan
$keyVaultUri = "https://$KeyVaultName.vault.azure.net/"

az webapp config appsettings set `
    --name $AppServiceName `
    --resource-group $ResourceGroup `
    --settings `
        ASPNETCORE_ENVIRONMENT=Production `
        KeyVaultUri=$keyVaultUri `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: App Settings configured!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Failed to configure App Settings" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  App Service: $AppServiceName" -ForegroundColor White
Write-Host "  Managed Identity: Enabled" -ForegroundColor White
Write-Host "  Key Vault Access: Granted" -ForegroundColor White
Write-Host "  Environment: Production" -ForegroundColor White
Write-Host "  Key Vault URI: $keyVaultUri" -ForegroundColor White
Write-Host ""
Write-Host "The App Service will now:" -ForegroundColor Cyan
Write-Host "  1. Authenticate using Managed Identity (no passwords)" -ForegroundColor White
Write-Host "  2. Load secrets from Key Vault automatically" -ForegroundColor White
Write-Host "  3. Use secure JWT and database configuration" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Deploy your API to App Service" -ForegroundColor White
Write-Host "  2. Test the deployment" -ForegroundColor White
Write-Host "  3. Monitor logs for 'Azure Key Vault configured' message" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
