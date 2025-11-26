# Start Mirth Connect Docker Container
Write-Host "Setting Docker environment..." -ForegroundColor Cyan
$env:DOCKER_HOST = "npipe:////./pipe/docker_engine"

Write-Host "Starting Mirth Connect container..." -ForegroundColor Cyan
Set-Location "C:\Users\Edwin Almetes\Projects\healthextent\mirth"

# Try to start the container
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Mirth Connect container started!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Waiting for services to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    Write-Host ""
    Write-Host "Checking container status..." -ForegroundColor Cyan
    docker ps | Select-String "mirth"

    Write-Host ""
    Write-Host "Testing connectivity..." -ForegroundColor Cyan
    Write-Host "HTTP Admin: http://localhost:8081" -ForegroundColor White
    Write-Host "HTTPS Admin: https://localhost:8444" -ForegroundColor White
} else {
    Write-Host "ERROR: Failed to start container. Error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure Docker Desktop is running"
    Write-Host "2. Try restarting Docker Desktop"
    Write-Host "3. Check Docker Desktop logs for errors"
}
