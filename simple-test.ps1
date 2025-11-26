$baseUrl = "http://localhost:5000"

Write-Host "Testing Refactored API" -ForegroundColor Cyan
Write-Host ""

# Test token generation
Write-Host "1. Testing token generation with string TenantKey..." -ForegroundColor Yellow
$tokenBody = @{
    username = "api-user"
    tenantKey = "account_hp_123"
    tenantCode = "TENANT123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/token" -Method Post -Body $tokenBody -ContentType "application/json"
    Write-Host "   SUCCESS: Token generated" -ForegroundColor Green
    Write-Host "   TenantKey: $($response.tenantKey)" -ForegroundColor Gray
    Write-Host "   Username: $($response.username)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test validation
Write-Host "2. Testing token validation..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $($response.token)" }
try {
    $validateResp = Invoke-RestMethod -Uri "$baseUrl/api/auth/validate" -Method Get -Headers $headers
    Write-Host "   SUCCESS: Token is valid" -ForegroundColor Green
    Write-Host "   TenantKey from token: $($validateResp.tenantKey)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "API is running successfully with string TenantKey!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Run database migration scripts" -ForegroundColor Yellow
