# TEMPORARY: Disable authentication for local testing
# WARNING: DO NOT use this in production!

Write-Host "TEMPORARILY disabling authentication for local testing..." -ForegroundColor Yellow
Write-Host "WARNING: This is only for development/testing!" -ForegroundColor Red
Write-Host ""

$programFile = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Program.cs"

# Read the file
$content = Get-Content $programFile -Raw

# Comment out authentication/authorization
$content = $content -replace 'app\.UseAuthentication\(\);', '// app.UseAuthentication(); // TEMPORARILY DISABLED'
$content = $content -replace 'app\.UseAuthorization\(\);', '// app.UseAuthorization(); // TEMPORARILY DISABLED'

# Write back
$content | Set-Content $programFile -NoNewline

Write-Host "SUCCESS: Authentication temporarily disabled!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now call endpoints without a token." -ForegroundColor Cyan
Write-Host ""
Write-Host "To re-enable security, run: .\enable-auth-again.ps1" -ForegroundColor Yellow
