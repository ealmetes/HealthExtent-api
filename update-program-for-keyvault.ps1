# Update Program.cs to use Azure Key Vault
$programFile = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Program.cs"

Write-Host "Updating Program.cs to use Azure Key Vault..." -ForegroundColor Cyan
Write-Host ""

# Read the file
$content = Get-Content $programFile -Raw

# Add using statements after existing usings
$oldUsings = @'
using Microsoft.EntityFrameworkCore;
using HealthExtent.Api.Data;
using HealthExtent.Api.Services;
using FluentValidation;
'@

$newUsings = @'
using Microsoft.EntityFrameworkCore;
using HealthExtent.Api.Data;
using HealthExtent.Api.Services;
using FluentValidation;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
'@

$content = $content -replace [regex]::Escape($oldUsings), $newUsings

# Add Key Vault configuration after builder creation
$oldBuilderSection = @'
var builder = WebApplication.CreateBuilder(args);

// Configure URLs - Bind to all interfaces to allow Mirth Connect access
'@

$newBuilderSection = @'
var builder = WebApplication.CreateBuilder(args);

// Azure Key Vault Configuration (Production only)
if (!builder.Environment.IsDevelopment())
{
    var keyVaultUri = builder.Configuration["KeyVaultUri"];

    if (!string.IsNullOrEmpty(keyVaultUri))
    {
        var secretClient = new SecretClient(
            new Uri(keyVaultUri),
            new DefaultAzureCredential());

        builder.Configuration.AddAzureKeyVault(secretClient, new KeyVaultSecretManager());

        builder.Logging.LogInformation("Azure Key Vault configured: {KeyVaultUri}", keyVaultUri);
    }
    else
    {
        builder.Logging.LogWarning("KeyVaultUri not configured. Using appsettings for secrets.");
    }
}

// Configure URLs - Bind to all interfaces to allow Mirth Connect access
'@

$content = $content -replace [regex]::Escape($oldBuilderSection), $newBuilderSection

# Write back
$content | Set-Content $programFile -NoNewline

Write-Host "SUCCESS: Program.cs updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "  - Added Azure.Identity and Key Vault using statements" -ForegroundColor White
Write-Host "  - Added Key Vault configuration (Production only)" -ForegroundColor White
Write-Host "  - Secrets will be loaded from Key Vault in Production" -ForegroundColor White
Write-Host "  - Development still uses appsettings.json" -ForegroundColor White
Write-Host ""
