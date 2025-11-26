# Quick test of Key Vault integration
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick Key Vault Integration Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:KeyVaultUri = "https://he-kv-dev-eus2.vault.azure.net/"
$env:ASPNETCORE_ENVIRONMENT = "Production"

Write-Host "1. Environment configured:" -ForegroundColor Yellow
Write-Host "   KeyVaultUri: $env:KeyVaultUri" -ForegroundColor White
Write-Host "   Environment: Production" -ForegroundColor White
Write-Host ""

Write-Host "2. Building API..." -ForegroundColor Yellow
cd "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"
$buildOutput = dotnet build --no-restore 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Build successful!" -ForegroundColor Green
} else {
    Write-Host "   Build failed!" -ForegroundColor Red
    Write-Host $buildOutput
    exit 1
}
Write-Host ""

Write-Host "3. Starting API (will run for 10 seconds)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start API in background and capture output
$job = Start-Job -ScriptBlock {
    param($path, $kvUri, $env)
    cd $path
    $env:KeyVaultUri = $kvUri
    $env:ASPNETCORE_ENVIRONMENT = $env
    dotnet run 2>&1
} -ArgumentList (Get-Location).Path, $env:KeyVaultUri, $env:ASPNETCORE_ENVIRONMENT

# Wait for startup and check output
Start-Sleep -Seconds 8

$output = Receive-Job $job

# Stop the job
Stop-Job $job
Remove-Job $job

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Results:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Key Vault message
if ($output -match "Azure Key Vault configured") {
    Write-Host "SUCCESS: Key Vault integration working!" -ForegroundColor Green
    Write-Host ""
    $kvLine = $output | Select-String "Azure Key Vault configured"
    Write-Host "  $kvLine" -ForegroundColor Cyan
} else {
    Write-Host "WARNING: Did not see Key Vault configuration message" -ForegroundColor Yellow
}

# Check for startup message
if ($output -match "Starting Health Extent API") {
    Write-Host "SUCCESS: API started successfully!" -ForegroundColor Green
    Write-Host ""
    $startLine = $output | Select-String "Starting Health Extent API"
    Write-Host "  $startLine" -ForegroundColor Cyan
} else {
    Write-Host "WARNING: Did not see API startup message" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Full output saved to: keyvault-test-output.log" -ForegroundColor Gray
$output | Out-File "keyvault-test-output.log"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
