# HealthExtent API Testing Guide

## Quick Start

### Option 1: Automated Testing (Recommended)
Run the all-in-one script that builds, starts, and tests the API:

```powershell
cd C:\Users\Edwin Almetes\Projects\healthextent
.\START-API-AND-TEST.ps1
```

### Option 2: Manual Step-by-Step

1. **Start the API**
```powershell
cd C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api
dotnet run
```

2. **Open Swagger UI**
- Navigate to: https://localhost:7272/swagger
- This provides an interactive interface to test all endpoints

3. **Run Automated Tests**
```powershell
cd C:\Users\Edwin Almetes\Projects\healthextent
.\test-refactored-apis.ps1
```

### Option 3: VS Code REST Client
If you have VS Code with the "REST Client" extension:

1. Open `test-refactored-apis.http` in VS Code
2. Click "Send Request" above each API call
3. View responses inline

---

## Test Files Created

### 1. `START-API-AND-TEST.ps1`
**All-in-one script** that:
- Builds the API
- Starts the API server
- Waits for it to be ready
- Runs comprehensive tests
- Reports results

**Usage:**
```powershell
.\START-API-AND-TEST.ps1

# Skip build if already built
.\START-API-AND-TEST.ps1 -SkipBuild

# Only start API, skip tests
.\START-API-AND-TEST.ps1 -SkipTests

# Custom tenant key
.\START-API-AND-TEST.ps1 -TenantKey "YourTenantKeyHere"
```

### 2. `test-refactored-apis.ps1`
**Comprehensive test suite** covering:
- ✓ Patient API with Custodian fields
- ✓ Encounter API with TCM Schedule fields
- ✓ Provider API with NPI validation
- ✓ Hospital API
- ✓ CRUD operations
- ✓ Validation tests
- ✓ Pagination tests

**Usage:**
```powershell
.\test-refactored-apis.ps1

# Custom API URL
.\test-refactored-apis.ps1 -ApiBaseUrl "https://your-api.com"

# Custom tenant
.\test-refactored-apis.ps1 -TenantKey "YourTenantKeyHere"
```

### 3. `test-refactored-apis.http`
**VS Code REST Client file** with:
- Individual API test requests
- Variable configuration
- Edge case tests
- Update operation tests

---

## What Gets Tested

### Patient API Tests ✓
1. **Upsert Patient** with new fields:
   - ✓ CustodianName
   - ✓ CustodianPhone
   - ✓ FirstSeenHospitalCode
   - ✓ All standard patient fields

2. **Get Patient by Key**
   - ✓ Retrieves patient with TenantKey filtering
   - ✓ Verifies custodian info is returned

3. **Get All Patients for Tenant**
   - ✓ Pagination (skip/take)
   - ✓ Multi-tenant isolation

### Encounter API Tests ✓
1. **Upsert Encounter** with TCM fields:
   - ✓ TcmSchedule1 (first follow-up)
   - ✓ TcmSchedule2 (second follow-up)
   - ✓ All standard encounter fields

2. **Get Encounter by Key**
   - ✓ Includes nested patient info
   - ✓ Verifies TCM schedules

3. **Get Encounters by Patient**
   - ✓ Returns all patient encounters
   - ✓ Includes TCM schedule info

4. **Get All Encounters for Tenant**
   - ✓ Pagination support
   - ✓ Tenant isolation

### Provider API Tests ✓
1. **Upsert Provider**
   - ✓ NPI-based identification
   - ✓ All provider fields
   - ✓ Status management

2. **Get Provider by Key**
   - ✓ Retrieves by ProviderKey
   - ✓ Tenant filtering

3. **Get Provider by NPI**
   - ✓ Unique NPI lookup
   - ✓ Tenant-scoped search

4. **Get All Providers for Tenant**
   - ✓ Pagination
   - ✓ Alphabetical sorting

### Hospital API Tests ✓
1. **Get All Hospitals for Tenant**
   - ✓ Returns active hospitals only
   - ✓ Tenant isolation

### Validation Tests ✓
- ✓ Missing required fields
- ✓ Invalid NPI format
- ✓ Invalid PatientKey
- ✓ Field length validations

---

## Expected Test Results

When all tests pass, you should see:

```
========================================
TEST SUMMARY
========================================
Total Tests: 11
Passed: 11
Failed: 0

✓ ALL TESTS PASSED!

The refactored API is working correctly with:
  • NVARCHAR(64) TenantKey support
  • Patient Custodian fields
  • Encounter TCM Schedule fields
  • Provider management with NPI
```

---

## Test Data

The tests create the following test records:

### Test Patient
```json
{
  "patientIdExternal": "TEST-PAT-001",
  "familyName": "TestPatient",
  "givenName": "John",
  "custodianName": "Jane TestPatient",
  "custodianPhone": "+15559876543"
}
```

### Test Encounter with TCM
```json
{
  "visitNumber": "TEST-VISIT-001",
  "patientClass": "I",
  "tcmSchedule1": "2025-10-22 10:00:00",
  "tcmSchedule2": "2025-10-29 14:00:00"
}
```

### Test Provider
```json
{
  "npi": "1234567890",
  "familyName": "TestDoctor",
  "givenName": "Sarah",
  "prefix": "Dr."
}
```

---

## Troubleshooting

### API Won't Start
1. Check if port 7272 is already in use:
   ```powershell
   Get-NetTCPConnection -LocalPort 7272
   ```

2. Check database connection string in `appsettings.Development.json`

3. Verify SQL Server is running and accessible

### Tests Fail with 404
- API might not be fully started yet
- Check Swagger UI is accessible: https://localhost:7272/swagger

### Tests Fail with Database Errors
1. Verify database migrations are applied
2. Check stored procedures exist:
   - `he.UpsertPatient_Tenant`
   - `he.UpsertEncounter_Tenant`
   - `he.UpsertProvider_Tenant`

3. Verify Row Level Security is configured

### SSL Certificate Errors
The test scripts disable SSL validation for local testing. If you still get errors:
```powershell
dotnet dev-certs https --trust
```

---

## Manual Testing via Swagger

1. Navigate to https://localhost:7272/swagger
2. Test each endpoint:

### Test Patient Upsert
```json
POST /api/patients/upsert
{
  "tenantKey": "CpPHRwj0GtR9d0k7NH9HtNVURYC3",
  "patientIdExternal": "MANUAL-TEST-001",
  "familyName": "Manual",
  "givenName": "Test",
  "custodianName": "Custodian Test"
}
```

### Test Encounter Upsert with TCM
```json
POST /api/encounters/upsert
{
  "tenantKey": "CpPHRwj0GtR9d0k7NH9HtNVURYC3",
  "hospitalCode": "PRMC",
  "visitNumber": "MANUAL-V-001",
  "patientKey": 1,
  "tcmSchedule1_TS": "20251020100000",
  "tcmSchedule2_TS": "20251027140000"
}
```

---

## API Endpoints Reference

### Patient Endpoints
- `POST /api/patients/upsert` - Create/update patient
- `GET /api/patients/{patientKey}?tenantKey=xxx` - Get by key
- `GET /api/patients/tenant/{tenantKey}?skip=0&take=20` - List all

### Encounter Endpoints
- `POST /api/encounters/upsert` - Create/update encounter
- `GET /api/encounters/{encounterKey}?tenantKey=xxx` - Get by key
- `GET /api/encounters/patient/{patientKey}?tenantKey=xxx` - Get by patient
- `GET /api/encounters/tenant/{tenantKey}?skip=0&take=20` - List all

### Provider Endpoints
- `POST /api/providers/upsert` - Create/update provider
- `GET /api/providers/{providerKey}?tenantKey=xxx` - Get by key
- `GET /api/providers/npi/{npi}?tenantKey=xxx` - Get by NPI
- `GET /api/providers/tenant/{tenantKey}?skip=0&take=20` - List all

### Hospital Endpoints
- `GET /api/hospitals/tenant/{tenantKey}` - List all

---

## Environment Variables

The API uses these configuration sources:
1. `appsettings.json` - Base configuration
2. `appsettings.Development.json` - Development overrides
3. Environment variables
4. User secrets (if configured)

**Key settings:**
- `ConnectionStrings:DefaultConnection` - Database connection
- `Jwt:SecretKey` - JWT authentication key (if enabled)
- `Logging:LogLevel` - Logging verbosity

---

## Success Criteria

✓ **API Refactoring is successful if:**

1. All 11 automated tests pass
2. Patient custodian fields are saved and retrieved
3. Encounter TCM schedules are saved and retrieved
4. Provider records can be managed by NPI
5. Multi-tenant isolation works (TenantKey filtering)
6. Row Level Security prevents cross-tenant access
7. Validation rules prevent invalid data

---

## Next Steps After Testing

1. **Review Test Results** - Address any failures
2. **Integration Testing** - Test with Mirth Connect
3. **Performance Testing** - Test with production data volumes
4. **Security Testing** - Verify RLS and authentication
5. **Documentation** - Update API docs with new fields
6. **Deployment** - Deploy to staging/production

---

## Support

If you encounter issues:
1. Check `logs/` directory for API logs
2. Review SQL Server error logs
3. Verify database schema matches migration scripts
4. Check stored procedure definitions
5. Verify Row Level Security is enabled

For detailed API status, see: `API_REFACTORING_STATUS.md`
