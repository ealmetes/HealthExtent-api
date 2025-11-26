# Deploy HealthExtent API to Azure App Service
param(
    [Parameter(Mandatory=$false)]
    [string]$AppServiceName = "he-api-dev-eus2",

    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "he-rg-apps-dev-eus2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy HealthExtent API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target:" -ForegroundColor Yellow
Write-Host "  App Service: $AppServiceName" -ForegroundColor White
Write-Host "  Resource Group: $ResourceGroup" -ForegroundColor White
Write-Host ""

$apiPath = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"

# Step 1: Clean and restore
Write-Host "Step 1: Cleaning and restoring packages..." -ForegroundColor Cyan
cd $apiPath
dotnet clean
dotnet restore

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Restore failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  SUCCESS: Packages restored!" -ForegroundColor Green
Write-Host ""

# Step 2: Build in Release mode
Write-Host "Step 2: Building in Release mode..." -ForegroundColor Cyan
dotnet build --configuration Release --no-restore

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  SUCCESS: Build completed!" -ForegroundColor Green
Write-Host ""

# Step 3: Publish
Write-Host "Step 3: Publishing application..." -ForegroundColor Cyan
dotnet publish --configuration Release --output ./publish --no-build

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Publish failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  SUCCESS: Application published!" -ForegroundColor Green
Write-Host ""

# Step 4: Create deployment package
Write-Host "Step 4: Creating deployment package..." -ForegroundColor Cyan
cd publish

# Remove old zip if exists
if (Test-Path "../app.zip") {
    Remove-Item "../app.zip" -Force
}

Compress-Archive -Path * -DestinationPath ../app.zip -Force

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Failed to create deployment package!" -ForegroundColor Red
    exit 1
}

$zipSize = (Get-Item "../app.zip").Length / 1MB
Write-Host "  SUCCESS: Deployment package created! (Size: $([math]::Round($zipSize, 2)) MB)" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy to Azure
Write-Host "Step 5: Deploying to Azure App Service..." -ForegroundColor Cyan
Write-Host "  This may take a few minutes..." -ForegroundColor Yellow

cd ..
az webapp deployment source config-zip `
    --name $AppServiceName `
    --resource-group $ResourceGroup `
    --src app.zip `
    --timeout 600

if ($LASTEXITCODE -eq 0) {
    Write-Host "  SUCCESS: Deployment completed!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Restart App Service
Write-Host "Step 6: Restarting App Service..." -ForegroundColor Cyan
az webapp restart --name $AppServiceName --resource-group $ResourceGroup

Write-Host "  App Service restarted!" -ForegroundColor Green
Write-Host ""

# Get the URL
$app = az webapp show --name $AppServiceName --resource-group $ResourceGroup | ConvertFrom-Json
$url = "https://$($app.defaultHostName)"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your API is now deployed!" -ForegroundColor Yellow
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  API Base: $url" -ForegroundColor White
Write-Host "  Health Check: $url/health" -ForegroundColor White
Write-Host "  Swagger (Dev): $url/" -ForegroundColor Gray
Write-Host ""
Write-Host "Test it:" -ForegroundColor Yellow
Write-Host "  curl $url/health" -ForegroundColor White
Write-Host ""
Write-Host "View logs:" -ForegroundColor Yellow
Write-Host "  az webapp log tail --name $AppServiceName --resource-group $ResourceGroup" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Cleanup
Write-Host ""
Write-Host "Cleaning up temporary files..." -ForegroundColor Gray
Remove-Item app.zip -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse publish -Force -ErrorAction SilentlyContinue

Write-Host "Done!" -ForegroundColor Green
