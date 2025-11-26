# Restart HealthExtent API with new CORS configuration

Write-Host "Stopping existing API processes..." -ForegroundColor Yellow

# Find and stop all HealthExtent.Api processes
Get-Process | Where-Object { $_.ProcessName -like "*HealthExtent*" } | ForEach-Object {
    Write-Host "  Stopping process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# Also stop any dotnet processes running on ports 5000/5001
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    $processId = $port5000.OwningProcess
    Write-Host "  Stopping process on port 5000 (PID: $processId)" -ForegroundColor Gray
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

$port5001 = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue
if ($port5001) {
    $processId = $port5001.OwningProcess
    Write-Host "  Stopping process on port 5001 (PID: $processId)" -ForegroundColor Gray
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

Write-Host "Waiting for processes to stop..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Starting API with new configuration..." -ForegroundColor Green
Write-Host "  - CORS now allows http://localhost:3004" -ForegroundColor Gray
Write-Host "  - HTTPS redirection disabled" -ForegroundColor Gray
Write-Host ""

# Start the API
Set-Location "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"
Start-Process -FilePath "dotnet" -ArgumentList "run" -NoNewWindow

Write-Host "API is starting..." -ForegroundColor Green
Write-Host "Access it at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Refresh your dashboard at http://localhost:3004" -ForegroundColor Yellow
