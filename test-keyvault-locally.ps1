# Test Azure Key Vault integration locally
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Key Vault Integration Locally" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables for Production mode
$env:KeyVaultUri = "https://he-kv-dev-eus2.vault.azure.net/"
$env:ASPNETCORE_ENVIRONMENT = "Production"

Write-Host "Environment configured:" -ForegroundColor Yellow
Write-Host "  KeyVaultUri: $env:KeyVaultUri" -ForegroundColor White
Write-Host "  ASPNETCORE_ENVIRONMENT: $env:ASPNETCORE_ENVIRONMENT" -ForegroundColor White
Write-Host ""

Write-Host "Starting API with Key Vault..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Watch for this message:" -ForegroundColor Gray
Write-Host '  "Azure Key Vault configured: https://he-kv-dev-eus2.vault.azure.net/"' -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the API" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to API directory and run
cd "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"
dotnet run
