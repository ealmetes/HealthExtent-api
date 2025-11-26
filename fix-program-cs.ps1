# Fix Program.cs security issues
$filePath = "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Program.cs"

# Read the file
$content = Get-Content $filePath -Raw

# Replace HTTPS redirection section
$content = $content -replace '// HTTPS redirection disabled for local development with HTTP frontend\r?\n// app\.UseHttpsRedirection\(\);', @'
// Enable HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
'@

# Replace authentication/authorization section
$content = $content -replace '// TEMPORARILY DISABLED FOR TESTING - NO AUTH REQUIRED\r?\n// app\.UseAuthentication\(\);\r?\n// app\.UseAuthorization\(\);', @'
// Authentication and Authorization - ENABLED FOR PRODUCTION SECURITY
app.UseAuthentication();
app.UseAuthorization();
'@

# Write back to file
$content | Set-Content $filePath -NoNewline

Write-Host "SUCCESS: Program.cs has been updated with security fixes!" -ForegroundColor Green
Write-Host "  - HTTPS redirection enabled for production" -ForegroundColor Cyan
Write-Host "  - Authentication and Authorization enabled" -ForegroundColor Cyan
