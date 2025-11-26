# Add Azure Key Vault NuGet packages to the API project

$projectPath = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"

Write-Host "Adding Azure Key Vault packages to HealthExtent.Api..." -ForegroundColor Cyan
Write-Host ""

cd $projectPath

Write-Host "Installing Azure.Identity..." -ForegroundColor Yellow
dotnet add package Azure.Identity

Write-Host ""
Write-Host "Installing Azure.Extensions.AspNetCore.Configuration.Secrets..." -ForegroundColor Yellow
dotnet add package Azure.Extensions.AspNetCore.Configuration.Secrets

Write-Host ""
Write-Host "SUCCESS: Azure Key Vault packages installed!" -ForegroundColor Green
Write-Host ""

Write-Host "Packages added:" -ForegroundColor Cyan
Write-Host "  - Azure.Identity (for managed identity authentication)" -ForegroundColor White
Write-Host "  - Azure.Extensions.AspNetCore.Configuration.Secrets (for Key Vault configuration)" -ForegroundColor White
Write-Host ""

Write-Host "Next step: Update Program.cs to use Key Vault" -ForegroundColor Yellow
