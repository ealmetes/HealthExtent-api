# HealthExtent API - Start and Test Script
# This script starts the API and runs comprehensive tests

param(
    [switch]$SkipBuild,
    [switch]$SkipTests,
    [string]$TenantKey = "CpPHRwj0GtR9d0k7NH9HtNVURYC3"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HealthExtent API - Start & Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to API directory
$apiDir = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"
Set-Location $apiDir

# Check if API is already running
Write-Host "Checking if API is already running..." -ForegroundColor Yellow
$existingProcess = Get-Process -Name "HealthExtent.Api" -ErrorAction SilentlyContinue
if ($existingProcess) {
    Write-Host "⚠ API is already running (PID: $($existingProcess.Id))" -ForegroundColor Yellow
    $response = Read-Host "Do you want to stop it and restart? (y/n)"
    if ($response -eq 'y') {
        Stop-Process -Id $existingProcess.Id -Force
        Write-Host "✓ Stopped existing API process" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
    else {
        Write-Host "Using existing API instance..." -ForegroundColor Yellow
        $skipBuild = $true
    }
}

# Build the API (unless skipped)
if (-not $SkipBuild) {
    Write-Host "`nBuilding API..." -ForegroundColor Yellow
    try {
        dotnet build --configuration Release
        if ($LASTEXITCODE -ne 0) {
            throw "Build failed with exit code $LASTEXITCODE"
        }
        Write-Host "✓ Build successful" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Build failed: $_" -ForegroundColor Red
        exit 1
    }
}

# Start the API in background
if (-not $existingProcess) {
    Write-Host "`nStarting API server..." -ForegroundColor Yellow
    Write-Host "URL: https://localhost:7272" -ForegroundColor Gray
    Write-Host "Swagger: https://localhost:7272/swagger" -ForegroundColor Gray
    Write-Host ""

    # Start API in background
    $apiJob = Start-Job -ScriptBlock {
        param($apiDir)
        Set-Location $apiDir
        dotnet run --configuration Release --no-build
    } -ArgumentList $apiDir

    Write-Host "✓ API starting (Job ID: $($apiJob.Id))..." -ForegroundColor Green
    Write-Host "Waiting for API to be ready..." -ForegroundColor Yellow

    # Wait for API to be ready
    $maxAttempts = 30
    $attempt = 0
    $apiReady = $false

    while ($attempt -lt $maxAttempts -and -not $apiReady) {
        $attempt++
        Start-Sleep -Seconds 2

        try {
            # Disable SSL validation for testing
            add-type @"
                using System.Net;
                using System.Security.Cryptography.X509Certificates;
                public class TrustAllCertsPolicy : ICertificatePolicy {
                    public bool CheckValidationResult(
                        ServicePoint srvPoint, X509Certificate certificate,
                        WebRequest request, int certificateProblem) {
                        return true;
                    }
                }
"@
            [System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

            $response = Invoke-WebRequest -Uri "https://localhost:7272/swagger" -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) {
                $apiReady = $true
            }
        }
        catch {
            Write-Host "." -NoNewline -ForegroundColor Gray
        }
    }

    if ($apiReady) {
        Write-Host "`n✓ API is ready!" -ForegroundColor Green
    }
    else {
        Write-Host "`n✗ API failed to start after $maxAttempts attempts" -ForegroundColor Red
        Stop-Job -Job $apiJob
        Remove-Job -Job $apiJob
        exit 1
    }
}

# Run tests (unless skipped)
if (-not $SkipTests) {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Running API Tests" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    $testScript = "C:\Users\Edwin Almetes\Projects\healthextent\test-refactored-apis.ps1"

    try {
        & $testScript -ApiBaseUrl "https://localhost:7272" -TenantKey $TenantKey

        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✓ All tests passed!" -ForegroundColor Green
        }
        else {
            Write-Host "`n⚠ Some tests failed. Review the output above." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "`n✗ Test execution failed: $_" -ForegroundColor Red
    }
}

# Show next steps
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API is running at: https://localhost:7272" -ForegroundColor White
Write-Host "Swagger UI: https://localhost:7272/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Options:" -ForegroundColor Yellow
Write-Host "  1. Open Swagger UI in browser to test manually" -ForegroundColor Gray
Write-Host "  2. Use test-refactored-apis.http in VS Code (REST Client extension)" -ForegroundColor Gray
Write-Host "  3. Run: .\test-refactored-apis.ps1 for automated tests" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop the API:" -ForegroundColor Yellow
Write-Host "  Get-Job | Stop-Job" -ForegroundColor Gray
Write-Host "  Get-Job | Remove-Job" -ForegroundColor Gray
Write-Host ""
