# Quick API Test Script
param(
    [string]$ApiBaseUrl = "http://localhost:5000",
    [string]$TenantKey = "CpPHRwj0GtR9d0k7NH9HtNVURYC3"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HealthExtent API Quick Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API: $ApiBaseUrl" -ForegroundColor Yellow
Write-Host "Tenant: $TenantKey" -ForegroundColor Yellow
Write-Host ""

$ErrorActionPreference = "Continue"

# Test counters
$passed = 0
$failed = 0

function Test-Endpoint {
    param([string]$Name, [string]$Method, [string]$Endpoint, [object]$Body = $null)

    Write-Host "`n--- TEST: $Name ---" -ForegroundColor Green
    Write-Host "$Method $ApiBaseUrl$Endpoint" -ForegroundColor Gray

    try {
        $params = @{
            Method = $Method
            Uri = "$ApiBaseUrl$Endpoint"
            ContentType = "application/json"
        }

        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            Write-Host "Body: $jsonBody" -ForegroundColor DarkGray
            $params.Body = $jsonBody
        }

        $response = Invoke-RestMethod @params
        Write-Host "✓ SUCCESS" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor White
        $script:passed++
        return $response
    }
    catch {
        Write-Host "✗ FAILED: $_" -ForegroundColor Red
        $script:failed++
        return $null
    }
}

# TEST 1: Upsert Patient
$patientBody = @{
    tenantKey = $TenantKey
    patientIdExternal = "TEST-001"
    familyName = "Smith"
    givenName = "John"
    dob_TS = "19850615"
    sex = "M"
    custodianName = "Jane Smith"
    custodianPhone = "+15551234567"
    firstSeenHospitalCode = "PRMC"
}
$patientResp = Test-Endpoint -Name "Upsert Patient" -Method POST -Endpoint "/api/patients/upsert" -Body $patientBody
$patientKey = if ($patientResp) { $patientResp.patientKey } else { $null }

# TEST 2: Get Patient
if ($patientKey) {
    Test-Endpoint -Name "Get Patient" -Method GET -Endpoint "/api/patients/$patientKey" + "?tenantKey=$TenantKey"
}

# TEST 3: Get Patients for Tenant
Test-Endpoint -Name "Get Patients for Tenant" -Method GET -Endpoint ("/api/patients/tenant/" + $TenantKey + "?skip=0" + [char]38 + "take=10")

# TEST 4: Upsert Encounter
if ($patientKey) {
    $encounterBody = @{
        tenantKey = $TenantKey
        hospitalCode = "PRMC"
        visitNumber = "V-TEST-001"
        patientKey = $patientKey
        admit_TS = "20251019120000"
        patientClass = "I"
        location = "Room 101"
        tcmSchedule1_TS = "20251020100000"
        tcmSchedule2_TS = "20251027140000"
    }
    $encounterResp = Test-Endpoint -Name "Upsert Encounter with TCM" -Method POST -Endpoint "/api/encounters/upsert" -Body $encounterBody
}

# TEST 5: Get Encounters by Patient
if ($patientKey) {
    Test-Endpoint -Name "Get Encounters for Patient" -Method GET -Endpoint "/api/encounters/patient/$patientKey" + "?tenantKey=$TenantKey"
}

# TEST 6: Upsert Provider
$providerBody = @{
    tenantKey = $TenantKey
    npi = "1234567890"
    familyName = "Johnson"
    givenName = "Emily"
    prefix = "Dr."
    status = 1
}
$providerResp = Test-Endpoint -Name "Upsert Provider" -Method POST -Endpoint "/api/providers/upsert" -Body $providerBody

# TEST 7: Get Provider by NPI
Test-Endpoint -Name "Get Provider by NPI" -Method GET -Endpoint "/api/providers/npi/1234567890" + "?tenantKey=$TenantKey"

# TEST 8: Get Providers for Tenant
Test-Endpoint -Name "Get Providers for Tenant" -Method GET -Endpoint ("/api/providers/tenant/" + $TenantKey + "?skip=0" + [char]38 + "take=10")

# TEST 9: Get Hospitals
Test-Endpoint -Name "Get Hospitals" -Method GET -Endpoint "/api/hospitals/tenant/$TenantKey"

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total: $($passed + $failed)" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`n✓ ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n✗ SOME TESTS FAILED" -ForegroundColor Yellow
    exit 1
}
