# Quick verification that Key Vault is accessible
Write-Host "Verifying Key Vault access..." -ForegroundColor Yellow
Write-Host ""

$keyVaultName = "he-kv-dev-eus2"

# Test access
try {
    Write-Host "1. Testing connection to Key Vault..." -ForegroundColor Cyan
    $secrets = az keyvault secret list --vault-name $keyVaultName --query "[].name" -o tsv

    if ($secrets) {
        Write-Host "   SUCCESS: Can access Key Vault!" -ForegroundColor Green
        Write-Host ""

        Write-Host "2. Secrets available:" -ForegroundColor Cyan
        $secrets -split "`n" | ForEach-Object {
            Write-Host "   - $_" -ForegroundColor White
        }
        Write-Host ""

        Write-Host "3. Testing secret retrieval (JwtIssuer)..." -ForegroundColor Cyan
        $issuer = az keyvault secret show --vault-name $keyVaultName --name "JwtIssuer" --query value -o tsv
        Write-Host "   JwtIssuer = $issuer" -ForegroundColor White
        Write-Host ""

        Write-Host "SUCCESS: Key Vault is fully configured and accessible!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now run: .\test-keyvault-locally.ps1" -ForegroundColor Yellow
    } else {
        Write-Host "   WARNING: No secrets found in Key Vault" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ERROR: Cannot access Key Vault" -ForegroundColor Red
    Write-Host "   Make sure you're logged in: az login" -ForegroundColor Yellow
}
