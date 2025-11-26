# Simple Token Generator
Write-Host "Generating JWT Token..." -ForegroundColor Cyan

$body = '{"username":"test-user","tenantId":1}'
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/token" -Method POST -Body $body -ContentType "application/json"

Write-Host ""
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host ""
Write-Host "Token:" -ForegroundColor Yellow
Write-Host $response.token
Write-Host ""
Write-Host "Expires:" $response.expires -ForegroundColor Gray
Write-Host "Tenant ID:" $response.tenantId -ForegroundColor Gray
Write-Host ""
Write-Host "Now test with Patients endpoint..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $($response.token)"
    "X-Tenant-Id" = "1"
}

try {
    $patients = Invoke-RestMethod -Uri "http://localhost:5000/api/Patients/tenant/1?skip=0&take=100" -Headers $headers
    Write-Host "Patients found: $($patients.Count)" -ForegroundColor Green
    if ($patients.Count -gt 0) {
        $patients | Select-Object -First 3 | Format-Table PatientKey, FamilyName, GivenName, DOB
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
