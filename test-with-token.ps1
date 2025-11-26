# Quick script to test API endpoints with authentication
param(
    [Parameter(Mandatory=$false)]
    [string]$TenantKey = "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",

    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:5000"
)

Write-Host "=== Health Extent API Test with Authentication ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate token
Write-Host "Step 1: Generating JWT token..." -ForegroundColor Yellow
$tokenBody = @{
    username = "test-user"
    tenantKey = $TenantKey
    tenantCode = "TEST001"
} | ConvertTo-Json

try {
    $tokenResponse = Invoke-RestMethod -Uri "$ApiUrl/api/auth/token" `
        -Method POST `
        -Body $tokenBody `
        -ContentType "application/json" `
        -ErrorAction Stop

    $token = $tokenResponse.token
    Write-Host "  Token generated successfully!" -ForegroundColor Green
    Write-Host "  Expires: $($tokenResponse.expires)" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "  ERROR: Could not generate token" -ForegroundColor Red
    Write-Host "  Make sure the API is running and in Development mode" -ForegroundColor Yellow
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Test the CareTransitions endpoint
Write-Host "Step 2: Testing CareTransitions endpoint..." -ForegroundColor Yellow
Write-Host "  GET /api/CareTransitions/encounter/58" -ForegroundColor Gray

$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $careTransition = Invoke-RestMethod -Uri "$ApiUrl/api/CareTransitions/encounter/58?tenantKey=$TenantKey" `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $careTransition | ConvertTo-Json -Depth 5
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "  HTTP Status: $statusCode" -ForegroundColor Yellow

    if ($statusCode -eq 404) {
        Write-Host "  No care transition found for encounter 58" -ForegroundColor Yellow
        Write-Host "  This might mean:" -ForegroundColor Gray
        Write-Host "    - No care transition exists for this encounter" -ForegroundColor Gray
        Write-Host "    - The encounter doesn't exist" -ForegroundColor Gray
        Write-Host "    - Wrong tenant key" -ForegroundColor Gray
    }
    elseif ($statusCode -eq 401) {
        Write-Host "  ERROR: Unauthorized - Token invalid" -ForegroundColor Red
    }
    else {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Additional Useful Commands ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Use the token for other requests:" -ForegroundColor Gray
Write-Host '$headers = @{"Authorization"="Bearer ' + $token + '"}' -ForegroundColor White
Write-Host ""
Write-Host "# Example: Get all active care transitions" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri '$ApiUrl/api/CareTransitions/active?tenantKey=$TenantKey' -Headers `$headers" -ForegroundColor White
Write-Host ""
Write-Host "# Example: Get care transitions by tenant" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri '$ApiUrl/api/CareTransitions/tenant/$TenantKey' -Headers `$headers" -ForegroundColor White
Write-Host ""
