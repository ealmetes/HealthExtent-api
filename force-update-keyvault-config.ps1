# Force update Program.cs with Key Vault configuration
$programFile = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Program.cs"

Write-Host "Force updating Program.cs with Key Vault configuration..." -ForegroundColor Cyan

# Read all lines
$lines = Get-Content $programFile

# Output array
$newLines = @()
$inUsings = $true
$addedKeyVaultCode = $false

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]

    # Add Key Vault usings after FluentValidation
    if ($line -match "using FluentValidation;" -and $inUsings) {
        $newLines += $line
        $newLines += "using Azure.Identity;"
        $newLines += "using Azure.Security.KeyVault.Secrets;"
        $newLines += "using Azure.Extensions.AspNetCore.Configuration.Secrets;"
        $inUsings = $false
        continue
    }

    # Add Key Vault configuration after builder creation
    if ($line -match "var builder = WebApplication.CreateBuilder" -and !$addedKeyVaultCode) {
        $newLines += $line
        $newLines += ""
        $newLines += "// Azure Key Vault Configuration (Production only)"
        $newLines += "if (!builder.Environment.IsDevelopment())"
        $newLines += "{"
        $newLines += "    var keyVaultUri = builder.Configuration[""KeyVaultUri""];"
        $newLines += ""
        $newLines += "    if (!string.IsNullOrEmpty(keyVaultUri))"
        $newLines += "    {"
        $newLines += "        var secretClient = new SecretClient("
        $newLines += "            new Uri(keyVaultUri),"
        $newLines += "            new DefaultAzureCredential());"
        $newLines += ""
        $newLines += "        builder.Configuration.AddAzureKeyVault(secretClient, new KeyVaultSecretManager());"
        $newLines += ""
        $newLines += "        Console.WriteLine(`"Azure Key Vault configured: {0}`", keyVaultUri);"
        $newLines += "    }"
        $newLines += "    else"
        $newLines += "    {"
        $newLines += "        Console.WriteLine(`"WARNING: KeyVaultUri not configured. Using appsettings for secrets.`");"
        $newLines += "    }"
        $newLines += "}"
        $addedKeyVaultCode = $true
        continue
    }

    $newLines += $line
}

# Write back
$newLines | Set-Content $programFile

Write-Host "SUCCESS: Program.cs updated with Key Vault configuration!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes applied:" -ForegroundColor Cyan
Write-Host "  - Added 3 using statements for Azure Key Vault" -ForegroundColor White
Write-Host "  - Added Key Vault configuration (Production only)" -ForegroundColor White
Write-Host ""
