# Add current IP address to Azure SQL firewall
# This script helps when your IP changes and you get connection errors

Write-Host "Fetching your current public IP address..." -ForegroundColor Yellow

# Get current public IP
try {
    $currentIp = (Invoke-RestMethod -Uri "https://api.ipify.org?format=json").ip
    Write-Host "  Your current IP: $currentIp" -ForegroundColor Green
} catch {
    Write-Host "  Error: Could not detect IP address" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Adding firewall rule to Azure SQL Server..." -ForegroundColor Yellow

# Azure SQL Server details
$resourceGroup = "he-rg-data-dev-eus2"
$serverName = "he-sql-dev-eus2"
$ruleName = "DevMachine-$($currentIp -replace '\.', '-')"

# Add firewall rule
try {
    az sql server firewall-rule create `
        --resource-group $resourceGroup `
        --server $serverName `
        --name $ruleName `
        --start-ip-address $currentIp `
        --end-ip-address $currentIp `
        --output table

    Write-Host ""
    Write-Host "SUCCESS: Firewall rule added!" -ForegroundColor Green
    Write-Host "  Rule Name: $ruleName" -ForegroundColor Gray
    Write-Host "  IP Address: $currentIp" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Note: It may take up to 5 minutes for this change to take effect." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can now access the database from this IP address." -ForegroundColor Cyan
} catch {
    Write-Host "  Error adding firewall rule: $_" -ForegroundColor Red
    exit 1
}
