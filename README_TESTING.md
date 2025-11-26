# 🧪 API Testing - Quick Start

## ✅ All Refactoring Complete!

The HealthExtent API has been fully refactored to support:
- ✓ **NVARCHAR(64) TenantKey** (Firebase/Firestore account IDs)
- ✓ **Patient Custodian Fields** (CustodianName, CustodianPhone)
- ✓ **Encounter TCM Schedules** (TcmSchedule1, TcmSchedule2)
- ✓ **Provider Management** (NPI-based with full CRUD)
- ✓ **Row Level Security** (Multi-tenant data isolation)

---

## 🚀 One-Command Testing

Run everything (build, start, test):

```powershell
cd C:\Users\Edwin Almetes\Projects\healthextent
.\START-API-AND-TEST.ps1
```

That's it! This will:
1. Build the API
2. Start the server at https://localhost:7272
3. Wait for it to be ready
4. Run all 11 comprehensive tests
5. Report results

---

## 📊 What Gets Tested

### ✓ 11 Comprehensive Tests

1. **Patient API** (3 tests)
   - Upsert with custodian fields
   - Get by key
   - Get all for tenant

2. **Encounter API** (4 tests)
   - Upsert with TCM schedules
   - Get by key
   - Get by patient
   - Get all for tenant

3. **Provider API** (3 tests)
   - Upsert by NPI
   - Get by NPI
   - Get all for tenant

4. **Hospital API** (1 test)
   - Get all for tenant

---

## 📁 Test Files Created

| File | Purpose |
|------|---------|
| `START-API-AND-TEST.ps1` | All-in-one: build, start, test |
| `test-refactored-apis.ps1` | Comprehensive test suite (11 tests) |
| `test-refactored-apis.http` | VS Code REST Client tests |
| `TESTING_GUIDE.md` | Detailed testing documentation |
| `API_REFACTORING_STATUS.md` | Complete refactoring status report |

---

## 🎯 Expected Results

When successful, you'll see:

```
========================================
TEST SUMMARY
========================================
Total Tests: 11
Passed: 11 ✓
Failed: 0

✓ ALL TESTS PASSED!

The refactored API is working correctly with:
  • NVARCHAR(64) TenantKey support
  • Patient Custodian fields
  • Encounter TCM Schedule fields
  • Provider management with NPI
```

---

## 🌐 Manual Testing Options

### Option 1: Swagger UI (Recommended)
1. Start API: `dotnet run` (in HealthExtent.Api folder)
2. Open: https://localhost:7272/swagger
3. Test endpoints interactively

### Option 2: VS Code REST Client
1. Install "REST Client" extension in VS Code
2. Open `test-refactored-apis.http`
3. Click "Send Request" above any test

### Option 3: PowerShell Script
```powershell
.\test-refactored-apis.ps1
```

---

## 🔍 Key Test Examples

### Test Patient with Custodian
```json
POST /api/patients/upsert
{
  "tenantKey": "CpPHRwj0GtR9d0k7NH9HtNVURYC3",
  "patientIdExternal": "TEST-001",
  "familyName": "Smith",
  "givenName": "John",
  "custodianName": "Jane Smith",
  "custodianPhone": "+15551234567"
}
```

### Test Encounter with TCM
```json
POST /api/encounters/upsert
{
  "tenantKey": "CpPHRwj0GtR9d0k7NH9HtNVURYC3",
  "hospitalCode": "PRMC",
  "visitNumber": "V-001",
  "patientKey": 1,
  "tcmSchedule1_TS": "20251020100000",
  "tcmSchedule2_TS": "20251027140000"
}
```

### Test Provider
```json
POST /api/providers/upsert
{
  "tenantKey": "CpPHRwj0GtR9d0k7NH9HtNVURYC3",
  "npi": "1234567890",
  "familyName": "Johnson",
  "givenName": "Emily",
  "prefix": "Dr."
}
```

---

## 🛠 Troubleshooting

### API Won't Start
```powershell
# Check if port is in use
Get-NetTCPConnection -LocalPort 7272

# Kill existing process
Get-Process -Name "HealthExtent.Api" | Stop-Process
```

### Tests Fail
1. Verify database is accessible
2. Check stored procedures exist:
   - `he.UpsertPatient_Tenant`
   - `he.UpsertEncounter_Tenant`
   - `he.UpsertProvider_Tenant`
3. Verify Row Level Security is enabled

### SSL Errors
```powershell
dotnet dev-certs https --trust
```

---

## 📋 Checklist

Before deploying to production:

- [ ] All 11 automated tests pass
- [ ] Manual Swagger testing successful
- [ ] Custodian fields save/retrieve correctly
- [ ] TCM schedules save/retrieve correctly
- [ ] Provider NPI uniqueness enforced
- [ ] Multi-tenant isolation verified
- [ ] Row Level Security tested
- [ ] Validation rules working
- [ ] Mirth Connect integration tested
- [ ] Performance testing completed
- [ ] Documentation updated

---

## 📚 Additional Resources

- **Full Status Report**: `API_REFACTORING_STATUS.md`
- **Detailed Testing Guide**: `TESTING_GUIDE.md`
- **Database Migrations**: `database/SCHEMA_MIGRATION*.sql`
- **API Documentation**: https://localhost:7272/swagger

---

## 🎉 Summary

**Status**: ✅ **READY FOR TESTING**

All refactoring is complete. The API fully supports the new database schema with:
- Multi-tenant operations using Firebase account IDs
- Enhanced patient information with custodian details
- Transitional Care Management (TCM) scheduling
- Provider management with NPI identification
- Complete Row Level Security

**Next Step**: Run `.\START-API-AND-TEST.ps1` to verify everything works!

---

## 📞 Need Help?

1. Check error logs in `logs/` folder
2. Review API output in console
3. Verify database connection in `appsettings.Development.json`
4. Check stored procedures in SQL Server
5. Review `TESTING_GUIDE.md` for detailed troubleshooting
