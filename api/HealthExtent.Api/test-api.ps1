# Health Extent API Test Script
# Run this in PowerShell to test your API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Health Extent API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate Token
Write-Host "Step 1: Generating JWT Token..." -ForegroundColor Yellow
$tokenBody = @{
    username = "test-user"
    tenantId = 1
    tenantCode = "TENANT001"
} | ConvertTo-Json

try {
    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/token" `
        -Method POST `
        -Body $tokenBody `
        -ContentType "application/json"

    Write-Host "✓ Token generated successfully!" -ForegroundColor Green
    Write-Host "  Username: $($tokenResponse.username)" -ForegroundColor Gray
    Write-Host "  Tenant ID: $($tokenResponse.tenantId)" -ForegroundColor Gray
    Write-Host "  Expires: $($tokenResponse.expires)" -ForegroundColor Gray
    Write-Host "  Token: $($tokenResponse.token.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""

    $token = $tokenResponse.token
} catch {
    Write-Host "✗ Failed to generate token" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Validate Token
Write-Host "Step 2: Validating Token..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $validateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/validate" `
        -Headers $headers

    Write-Host "✓ Token is valid!" -ForegroundColor Green
    Write-Host "  Authenticated as: $($validateResponse.username)" -ForegroundColor Gray
    Write-Host "  Tenant ID: $($validateResponse.tenantId)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Token validation failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Get Patients
Write-Host "Step 3: Fetching Patients..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "X-Tenant-Id" = "1"
}

try {
    $patients = Invoke-RestMethod -Uri "http://localhost:5000/api/Patients/tenant/1?skip=0&take=100" `
        -Headers $headers

    Write-Host "✓ Successfully retrieved patients!" -ForegroundColor Green
    Write-Host "  Total patients: $($patients.Count)" -ForegroundColor Gray

    if ($patients.Count -gt 0) {
        Write-Host ""
        Write-Host "First patient:" -ForegroundColor Cyan
        $patients[0] | Format-List
    } else {
        Write-Host "  (No patients found in database)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to fetch patients" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your token (valid for 24 hours):" -ForegroundColor Yellow
Write-Host $token -ForegroundColor White
Write-Host ""
Write-Host "Use this in your requests:" -ForegroundColor Yellow
Write-Host "  Header: Authorization" -ForegroundColor White
Write-Host "  Value: Bearer [token]" -ForegroundColor White
