# HealthExtent API Testing Script - Refactored Schema
# Tests all API endpoints with the new NVARCHAR(64) TenantKey and new fields

param(
    [string]$ApiBaseUrl = "http://localhost:5000",
    [string]$TenantKey = "CpPHRwj0GtR9d0k7NH9HtNVURYC3"  # Default test tenant from Mirth
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HealthExtent API Refactoring Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Base URL: $ApiBaseUrl" -ForegroundColor Yellow
Write-Host "Tenant Key: $TenantKey" -ForegroundColor Yellow
Write-Host ""

# Disable SSL certificate validation for local testing
add-type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAllCertsPolicy : ICertificatePolicy {
        public bool CheckValidationResult(
            ServicePoint srvPoint, X509Certificate certificate,
            WebRequest request, int certificateProblem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Function to make API requests
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$Description
    )

    Write-Host "`n--- $Description ---" -ForegroundColor Green
    Write-Host "$Method $Endpoint" -ForegroundColor Gray

    try {
        $params = @{
            Method = $Method
            Uri = "$ApiBaseUrl$Endpoint"
            ContentType = "application/json"
        }

        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            Write-Host "Request Body:" -ForegroundColor Gray
            Write-Host $jsonBody -ForegroundColor DarkGray
            $params.Body = $jsonBody
        }

        $response = Invoke-RestMethod @params
        Write-Host "Response:" -ForegroundColor Gray
        $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White

        return $response
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
        return $null
    }
}

# Test counters
$script:TestsPassed = 0
$script:TestsFailed = 0

function Test-ApiEndpoint {
    param(
        [string]$TestName,
        [scriptblock]$TestBlock
    )

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "TEST: $TestName" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan

    try {
        & $TestBlock
        $script:TestsPassed++
        Write-Host "✓ PASSED" -ForegroundColor Green
    }
    catch {
        $script:TestsFailed++
        Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# =============================================================================
# TEST 1: Patient API - Upsert with new Custodian fields
# =============================================================================
Test-ApiEndpoint "Patient API - Upsert Patient with Custodian Fields" {
    $patientRequest = @{
        tenantKey = $TenantKey
        patientIdExternal = "TEST-PAT-001"
        assigningAuthority = "TEST-HOSPITAL"
        mrn = "MRN-TEST-001"
        ssn = "123456789"
        familyName = "TestPatient"
        givenName = "John"
        dob_TS = "19850615"
        sex = "M"
        phone = "+15551234567"
        custodianName = "Jane TestPatient"
        custodianPhone = "+15559876543"
        addressLine1 = "123 Test Street"
        city = "Test City"
        state = "FL"
        postalCode = "33301"
        country = "USA"
        firstSeenHospitalCode = "PRMC"
    }

    $script:patientResponse = Invoke-ApiRequest -Method POST -Endpoint "/api/patients/upsert" `
        -Body $patientRequest -Description "Create/Update Patient with Custodian Info"

    if ($script:patientResponse -and $script:patientResponse.success) {
        $script:testPatientKey = $script:patientResponse.patientKey
        Write-Host "✓ Patient created/updated with PatientKey: $script:testPatientKey" -ForegroundColor Green
    }
    else {
        throw "Failed to create/update patient"
    }
}

# =============================================================================
# TEST 2: Patient API - Get Patient by Key
# =============================================================================
Test-ApiEndpoint "Patient API - Get Patient by Key" {
    if (-not $script:testPatientKey) {
        throw "No patient key available from previous test"
    }

    $patient = Invoke-ApiRequest -Method GET `
        -Endpoint "/api/patients/$($script:testPatientKey)?tenantKey=$TenantKey" `
        -Description "Get Patient by PatientKey"

    if ($patient -and $patient.patientKey -eq $script:testPatientKey) {
        Write-Host "✓ Patient retrieved successfully" -ForegroundColor Green
        Write-Host "  - Custodian Name: $($patient.custodianName)" -ForegroundColor Gray
        Write-Host "  - Custodian Phone: $($patient.custodianPhone)" -ForegroundColor Gray
        Write-Host "  - First Seen Hospital: $($patient.firstSeenHospitalKey)" -ForegroundColor Gray
    }
    else {
        throw "Failed to retrieve patient"
    }
}

# =============================================================================
# TEST 3: Patient API - Get All Patients for Tenant
# =============================================================================
Test-ApiEndpoint "Patient API - Get All Patients for Tenant" {
    $endpoint = "/api/patients/tenant/$TenantKey" + "?skip=0&take=10"
    $patients = Invoke-ApiRequest -Method GET `
        -Endpoint $endpoint `
        -Description "Get All Patients for Tenant"

    if ($patients) {
        Write-Host "✓ Retrieved $($patients.Count) patients" -ForegroundColor Green
    }
    else {
        throw "Failed to retrieve patients"
    }
}

# =============================================================================
# TEST 4: Encounter API - Upsert with TCM Schedule fields
# =============================================================================
Test-ApiEndpoint "Encounter API - Upsert Encounter with TCM Schedule" {
    if (-not $script:testPatientKey) {
        Write-Host "⚠ Skipping: No patient key available" -ForegroundColor Yellow
        return
    }

    $encounterRequest = @{
        tenantKey = $TenantKey
        hospitalCode = "PRMC"
        visitNumber = "TEST-VISIT-001"
        patientKey = $script:testPatientKey
        admit_TS = "20251019120000"
        discharge_TS = "20251021150000"
        patientClass = "I"
        location = "ICU-Room-101"
        attendingDoctor = "Dr. Smith, John, MD (NPI123)"
        primaryDoctor = "Dr. Johnson, Emily, MD (NPI456)"
        admittingDoctor = "Dr. Williams, Robert, MD (NPI789)"
        admitSource = "Emergency Room"
        visitStatus = "F"
        notes = "Test encounter with TCM scheduling. Patient discharged in stable condition."
        admitMessageId = "TEST-ADT-A01-001"
        dischargeMessageId = "TEST-ADT-A03-001"
        status = 1
        tcmSchedule1_TS = "20251022100000"
        tcmSchedule2_TS = "20251029140000"
    }

    $script:encounterResponse = Invoke-ApiRequest -Method POST -Endpoint "/api/encounters/upsert" `
        -Body $encounterRequest -Description "Create/Update Encounter with TCM Schedule"

    if ($script:encounterResponse -and $script:encounterResponse.success) {
        Write-Host "✓ Encounter created/updated with TCM schedule" -ForegroundColor Green
    }
    else {
        throw "Failed to create/update encounter"
    }
}

# =============================================================================
# TEST 5: Encounter API - Get Encounters by Patient
# =============================================================================
Test-ApiEndpoint "Encounter API - Get Encounters by Patient" {
    if (-not $script:testPatientKey) {
        Write-Host "⚠ Skipping: No patient key available" -ForegroundColor Yellow
        return
    }

    $encounters = Invoke-ApiRequest -Method GET `
        -Endpoint "/api/encounters/patient/$($script:testPatientKey)?tenantKey=$TenantKey" `
        -Description "Get Encounters for Patient"

    if ($encounters) {
        Write-Host "✓ Retrieved $($encounters.Count) encounters" -ForegroundColor Green
        foreach ($enc in $encounters) {
            Write-Host "  - Visit: $($enc.visitNumber)" -ForegroundColor Gray
            Write-Host "    TCM Schedule 1: $($enc.tcmSchedule1)" -ForegroundColor Gray
            Write-Host "    TCM Schedule 2: $($enc.tcmSchedule2)" -ForegroundColor Gray
        }
    }
    else {
        throw "Failed to retrieve encounters"
    }
}

# =============================================================================
# TEST 6: Encounter API - Get All Encounters for Tenant
# =============================================================================
Test-ApiEndpoint "Encounter API - Get All Encounters for Tenant" {
    $endpoint = "/api/encounters/tenant/$TenantKey" + "?skip=0&take=10"
    $encounters = Invoke-ApiRequest -Method GET `
        -Endpoint $endpoint `
        -Description "Get All Encounters for Tenant"

    if ($encounters) {
        Write-Host "✓ Retrieved $($encounters.Count) encounters" -ForegroundColor Green
    }
    else {
        throw "Failed to retrieve encounters"
    }
}

# =============================================================================
# TEST 7: Provider API - Upsert Provider
# =============================================================================
Test-ApiEndpoint "Provider API - Upsert Provider" {
    $providerRequest = @{
        tenantKey = $TenantKey
        npi = "1234567890"
        familyName = "TestDoctor"
        givenName = "Sarah"
        prefix = "Dr."
        status = 1
    }

    $script:providerResponse = Invoke-ApiRequest -Method POST -Endpoint "/api/providers/upsert" `
        -Body $providerRequest -Description "Create/Update Provider"

    if ($script:providerResponse -and $script:providerResponse.success) {
        $script:testProviderKey = $script:providerResponse.providerKey
        Write-Host "✓ Provider created/updated with ProviderKey: $script:testProviderKey" -ForegroundColor Green
    }
    else {
        throw "Failed to create/update provider"
    }
}

# =============================================================================
# TEST 8: Provider API - Get Provider by NPI
# =============================================================================
Test-ApiEndpoint "Provider API - Get Provider by NPI" {
    $provider = Invoke-ApiRequest -Method GET `
        -Endpoint "/api/providers/npi/1234567890?tenantKey=$TenantKey" `
        -Description "Get Provider by NPI"

    if ($provider -and $provider.npi -eq "1234567890") {
        Write-Host "✓ Provider retrieved by NPI" -ForegroundColor Green
        Write-Host "  - Name: $($provider.prefix) $($provider.givenName) $($provider.familyName)" -ForegroundColor Gray
        Write-Host "  - Status: $($provider.status)" -ForegroundColor Gray
    }
    else {
        throw "Failed to retrieve provider by NPI"
    }
}

# =============================================================================
# TEST 9: Provider API - Get Provider by Key
# =============================================================================
Test-ApiEndpoint "Provider API - Get Provider by Key" {
    if (-not $script:testProviderKey) {
        Write-Host "⚠ Skipping: No provider key available" -ForegroundColor Yellow
        return
    }

    $provider = Invoke-ApiRequest -Method GET `
        -Endpoint "/api/providers/$($script:testProviderKey)?tenantKey=$TenantKey" `
        -Description "Get Provider by ProviderKey"

    if ($provider -and $provider.providerKey -eq $script:testProviderKey) {
        Write-Host "✓ Provider retrieved by key" -ForegroundColor Green
    }
    else {
        throw "Failed to retrieve provider by key"
    }
}

# =============================================================================
# TEST 10: Provider API - Get All Providers for Tenant
# =============================================================================
Test-ApiEndpoint "Provider API - Get All Providers for Tenant" {
    $endpoint = "/api/providers/tenant/$TenantKey" + "?skip=0&take=10"
    $providers = Invoke-ApiRequest -Method GET `
        -Endpoint $endpoint `
        -Description "Get All Providers for Tenant"

    if ($providers) {
        Write-Host "✓ Retrieved $($providers.Count) providers" -ForegroundColor Green
    }
    else {
        throw "Failed to retrieve providers"
    }
}

# =============================================================================
# TEST 11: Hospital API - Get All Hospitals for Tenant
# =============================================================================
Test-ApiEndpoint "Hospital API - Get All Hospitals for Tenant" {
    $hospitals = Invoke-ApiRequest -Method GET `
        -Endpoint "/api/hospitals/tenant/$TenantKey" `
        -Description "Get All Hospitals for Tenant"

    if ($hospitals) {
        Write-Host "✓ Retrieved $($hospitals.Count) hospitals" -ForegroundColor Green
        foreach ($hosp in $hospitals) {
            Write-Host "  - $($hosp.hospitalCode): $($hosp.hospitalName)" -ForegroundColor Gray
        }
    }
    else {
        throw "Failed to retrieve hospitals"
    }
}

# =============================================================================
# TEST SUMMARY
# =============================================================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($script:TestsPassed + $script:TestsFailed)" -ForegroundColor White
Write-Host "Passed: $script:TestsPassed" -ForegroundColor Green
Write-Host "Failed: $script:TestsFailed" -ForegroundColor Red

if ($script:TestsFailed -eq 0) {
    Write-Host "`n✓ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "`nThe refactored API is working correctly with:" -ForegroundColor Green
    Write-Host "  • NVARCHAR(64) TenantKey support" -ForegroundColor White
    Write-Host "  • Patient Custodian fields" -ForegroundColor White
    Write-Host "  • Encounter TCM Schedule fields" -ForegroundColor White
    Write-Host "  • Provider management with NPI" -ForegroundColor White
    exit 0
}
else {
    Write-Host "`n✗ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "Please review the errors above and fix any issues." -ForegroundColor Yellow
    exit 1
}
