# Add database connection string to Key Vault
param(
    [Parameter(Mandatory=$false)]
    [string]$KeyVaultName = "he-kv-dev-eus2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Add Database Connection String to Key Vault" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Please enter your Azure SQL connection string:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Format examples:" -ForegroundColor Gray
Write-Host "  Server=tcp:server.database.windows.net,1433;Database=db;User ID=user;Password=pass;Encrypt=True;" -ForegroundColor Gray
Write-Host "  OR" -ForegroundColor Gray
Write-Host "  Server=tcp:server.database.windows.net,1433;Database=db;Authentication=Active Directory Default;Encrypt=True;" -ForegroundColor Gray
Write-Host ""

# Read connection string securely
$connectionString = Read-Host "Connection String"

if ([string]::IsNullOrWhiteSpace($connectionString)) {
    Write-Host "ERROR: No connection string provided." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Adding connection string to Key Vault..." -ForegroundColor Yellow

# Add to Key Vault with correct naming convention
az keyvault secret set `
    --vault-name $KeyVaultName `
    --name "ConnectionStrings--HealthExtentDb" `
    --value $connectionString `
    --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Connection string added!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Secret Name: ConnectionStrings--HealthExtentDb" -ForegroundColor Cyan
    Write-Host "Maps To: ConnectionStrings:HealthExtentDb" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The API will now use this connection string in Production!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to add connection string" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Verifying secrets in Key Vault..." -ForegroundColor Yellow
az keyvault secret list --vault-name $KeyVaultName --output table

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
