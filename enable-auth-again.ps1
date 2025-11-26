# Re-enable authentication after temporary testing
Write-Host "Re-enabling authentication..." -ForegroundColor Yellow

$programFile = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Program.cs"

# Read the file
$content = Get-Content $programFile -Raw

# Uncomment authentication/authorization
$content = $content -replace '// app\.UseAuthentication\(\); // TEMPORARILY DISABLED', 'app.UseAuthentication();'
$content = $content -replace '// app\.UseAuthorization\(\); // TEMPORARILY DISABLED', 'app.UseAuthorization();'

# Write back
$content | Set-Content $programFile -NoNewline

Write-Host "SUCCESS: Authentication re-enabled!" -ForegroundColor Green
Write-Host ""
Write-Host "All endpoints now require JWT tokens again." -ForegroundColor Cyan
