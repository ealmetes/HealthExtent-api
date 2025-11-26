# HealthExtent API Refactoring Status

## Date: October 19, 2025

## Overview
This document summarizes the refactoring status of the HealthExtent API to align with the refactored database schema. The database migration changed `TenantKey` from `INT` to `NVARCHAR(64)` and added new fields to support multi-tenant operations with Firestore account IDs.

---

## Database Schema Changes Summary

### Key Changes:
1. **TenantKey Type Change**: `INT` → `NVARCHAR(64)` across all tables
2. **Tenant Table Removed**: Using Firestore `accounts_hp` document IDs instead
3. **New Fields Added**:
   - **Patient**: Added `CustodianName`, `CustodianPhone`, `FirstSeenHospitalKey`
   - **Encounter**: Added `TcmSchedule1`, `TcmSchedule2` (Transitional Care Management)
   - **Provider**: New table created with `ProviderKey`, `TenantKey`, `FamilyName`, `GivenName`, `Prefix`, `Status`, `NPI`

---

## ✅ Refactoring Complete - Summary

### 1. **Models** ✅ COMPLETE
All entity models have been updated to match the new database schema:

#### Patient Model (`Models/Patient.cs`)
- ✅ TenantKey changed to `string` (NVARCHAR(64))
- ✅ Added `CustodianName` and `CustodianPhone` fields
- ✅ Added `FirstSeenHospitalKey` (int?) and navigation property
- ✅ Computed column `AssigningAuthorityNorm` configured

#### Encounter Model (`Models/Encounter.cs`)
- ✅ TenantKey changed to `string` (NVARCHAR(64))
- ✅ Added `TcmSchedule1` (DateTime2(3)?)
- ✅ Added `TcmSchedule2` (DateTime2(3)?)
- ✅ Status field configured (int)

#### Hospital Model (`Models/Hospital.cs`)
- ✅ TenantKey changed to `string` (NVARCHAR(64))
- ✅ All fields match database schema
- ✅ Navigation properties configured

#### Provider Model (`Models/Provider.cs`)
- ✅ New model created
- ✅ TenantKey as `string` (NVARCHAR(64))
- ✅ All required fields: `FamilyName`, `GivenName`, `Prefix`, `Status`, `NPI`
- ✅ LastUpdatedUtc configured

---

### 2. **DTOs** ✅ COMPLETE
All Data Transfer Objects have been updated:

#### PatientDto.cs
- ✅ `PatientDto` includes all new fields
- ✅ `UpsertPatientRequest` supports `CustodianName`, `CustodianPhone`, `FirstSeenHospitalCode`
- ✅ `UpsertPatientResponse` configured

#### EncounterDto.cs
- ✅ `EncounterDto` includes `TcmSchedule1` and `TcmSchedule2`
- ✅ `UpsertEncounterRequest` supports `TcmSchedule1_TS` and `TcmSchedule2_TS`
- ✅ `PatientInfoDto` nested object for encounter patient info
- ✅ `UpsertEncounterResponse` configured

#### ProviderDto.cs
- ✅ New `ProviderDto` created
- ✅ `UpsertProviderRequest` configured with NPI requirement
- ✅ `UpsertProviderResponse` configured

---

### 3. **Controllers** ✅ COMPLETE
All controllers have been updated:

#### PatientsController.cs
- ✅ Uses `IHealthExtentService` for all operations
- ✅ Supports upsert with validation
- ✅ Get by PatientKey with tenant context
- ✅ Get by tenant with pagination

#### EncountersController.cs
- ✅ Uses `IHealthExtentService` for all operations
- ✅ Supports upsert with validation
- ✅ Get by EncounterKey
- ✅ Get by PatientKey
- ✅ Get by tenant with pagination

#### HospitalsController.cs
- ✅ Get hospitals by tenant
- ✅ Returns Hospital entities directly

#### ProvidersController.cs
- ✅ New controller created
- ✅ Upsert provider by NPI with validation
- ✅ Get by ProviderKey
- ✅ Get by NPI
- ✅ Get by tenant with pagination

---

### 4. **Services** ✅ COMPLETE

#### IHealthExtentService.cs
- ✅ All patient operations defined
- ✅ All encounter operations defined
- ✅ All provider operations defined
- ✅ Hospital and audit operations defined

#### HealthExtentService.cs
All stored procedures are being called correctly:

**Patient Operations:**
- ✅ `UpsertPatientAsync` calls `he.UpsertPatient_Tenant` with all new parameters
- ✅ `GetPatientByKeyAsync` uses RLS session context
- ✅ `GetPatientsByTenantAsync` with pagination

**Encounter Operations:**
- ✅ `UpsertEncounterAsync` calls `he.UpsertEncounter_Tenant` with TCM fields
- ✅ `GetEncounterByKeyAsync` joins with Patient for nested DTO
- ✅ `GetEncountersByPatientAsync` with Patient info
- ✅ `GetEncountersByTenantAsync` with pagination

**Provider Operations:**
- ✅ `UpsertProviderAsync` calls `he.UpsertProvider_Tenant`
- ✅ `GetProviderByKeyAsync` uses RLS session context
- ✅ `GetProviderByNPIAsync` queries by NPI
- ✅ `GetProvidersByTenantAsync` with pagination

**Hospital Operations:**
- ✅ `GetHospitalsByTenantAsync` returns active hospitals

---

### 5. **Database Context** ✅ COMPLETE

#### HealthExtentDbContext.cs
- ✅ All DbSets configured (Patients, Encounters, Hospitals, Providers, Hl7Sources, Hl7MessageAudits)
- ✅ Computed column for `Patient.AssigningAuthorityNorm`
- ✅ Unique constraints configured
- ✅ Foreign key relationships configured with NoAction delete behavior
- ✅ Row Level Security (RLS) session context set in `SaveChangesAsync`

---

### 6. **Validators** ✅ COMPLETE

#### UpsertPatientRequestValidator.cs
- ✅ TenantKey validation (required, max 64 chars)
- ✅ PatientIdExternal validation
- ✅ All field length validations match database schema
- ✅ Custodian fields validated

#### UpsertEncounterRequestValidator.cs
- ✅ TenantKey validation (required, max 64 chars)
- ✅ HospitalCode validation
- ✅ VisitNumber validation
- ✅ PatientKey validation

#### UpsertProviderRequestValidator.cs
- ✅ TenantKey validation (required, max 64 chars)
- ✅ NPI validation (required, exactly 10 digits)
- ✅ All field length validations
- ✅ Status validation (0 or 1)

---

## Database Stored Procedures
The following stored procedures exist in the database:

1. ✅ `he.UpsertPatient_Tenant` - Updated with new fields
2. ✅ `he.UpsertEncounter_Tenant` - Updated with TCM fields
3. ✅ `he.UpsertProvider_Tenant` - New stored procedure
4. ✅ `he.WriteAudit_Tenant` - Audit logging

---

## Row Level Security (RLS)
- ✅ RLS function `he.fn_TenantAccessPredicate` configured for NVARCHAR TenantKey
- ✅ Security policy `he.RLS_TenantPolicy` applied to all tables
- ✅ Session context set via `sp_set_session_context` in all service methods

---

## API Endpoints Available

### Patients
- `POST /api/patients/upsert` - Create or update patient
- `GET /api/patients/{patientKey}` - Get patient by key
- `GET /api/patients/tenant/{tenantKey}` - Get all patients for tenant

### Encounters
- `POST /api/encounters/upsert` - Create or update encounter (with TCM fields)
- `GET /api/encounters/{encounterKey}` - Get encounter by key
- `GET /api/encounters/patient/{patientKey}` - Get encounters for patient
- `GET /api/encounters/tenant/{tenantKey}` - Get all encounters for tenant

### Hospitals
- `GET /api/hospitals/tenant/{tenantKey}` - Get all hospitals for tenant

### Providers
- `POST /api/providers/upsert` - Create or update provider
- `GET /api/providers/{providerKey}` - Get provider by key
- `GET /api/providers/npi/{npi}` - Get provider by NPI
- `GET /api/providers/tenant/{tenantKey}` - Get all providers for tenant

### Audit
- `POST /api/audit/write` - Write HL7 message audit record
- `GET /api/audit/tenant/{tenantKey}` - Get audit records for tenant

---

## Testing Recommendations

### 1. Test Patient API
```bash
# Test patient upsert with new custodian fields
POST /api/patients/upsert
{
  "tenantKey": "your-firebase-account-id",
  "patientIdExternal": "PAT001",
  "assigningAuthority": "TEST",
  "familyName": "Smith",
  "givenName": "John",
  "dob_TS": "19900101",
  "sex": "M",
  "custodianName": "Jane Smith",
  "custodianPhone": "+1234567890",
  "firstSeenHospitalCode": "HOSP001"
}

# Get patient
GET /api/patients/1?tenantKey=your-firebase-account-id
```

### 2. Test Encounter API with TCM Fields
```bash
# Test encounter upsert with TCM schedule fields
POST /api/encounters/upsert
{
  "tenantKey": "your-firebase-account-id",
  "hospitalCode": "HOSP001",
  "visitNumber": "V001",
  "patientKey": 1,
  "admit_TS": "20251019120000",
  "patientClass": "I",
  "location": "Room 101",
  "primaryDoctor": "Dr. Smith",
  "tcmSchedule1_TS": "20251020100000",
  "tcmSchedule2_TS": "20251027100000"
}
```

### 3. Test Provider API
```bash
# Test provider upsert
POST /api/providers/upsert
{
  "tenantKey": "your-firebase-account-id",
  "npi": "1234567890",
  "familyName": "Johnson",
  "givenName": "Emily",
  "prefix": "Dr.",
  "status": 1
}

# Get provider by NPI
GET /api/providers/npi/1234567890?tenantKey=your-firebase-account-id
```

---

## Migration Checklist

- [x] Update Patient model to NVARCHAR TenantKey
- [x] Add Custodian fields to Patient
- [x] Add FirstSeenHospitalKey to Patient
- [x] Update Encounter model to NVARCHAR TenantKey
- [x] Add TcmSchedule1 and TcmSchedule2 to Encounter
- [x] Update Hospital model to NVARCHAR TenantKey
- [x] Create Provider model with NVARCHAR TenantKey
- [x] Update all DTOs
- [x] Update all Controllers
- [x] Update HealthExtentService
- [x] Update IHealthExtentService
- [x] Update DbContext configuration
- [x] Update all Validators
- [x] Configure RLS session context
- [ ] Test all API endpoints
- [ ] Update API documentation
- [ ] Deploy to production

---

## Notes

1. **TenantKey Format**: The API now expects Firebase/Firestore account document IDs as TenantKey values (e.g., "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2")

2. **Row Level Security**: All database operations automatically filter by tenant using RLS policies

3. **Stored Procedures**: The API relies on database stored procedures for upsert operations to handle complex logic and maintain data integrity

4. **TCM Fields**: The new Transitional Care Management fields (TcmSchedule1, TcmSchedule2) support scheduling follow-up appointments for discharged patients

5. **Provider Table**: Providers can now be managed separately and linked by NPI for better data normalization

---

## Next Steps

1. **API Testing**: Comprehensive testing of all endpoints with the new schema
2. **Integration Testing**: Test Mirth Connect integration with the new API endpoints
3. **Documentation Updates**: Update Swagger/OpenAPI documentation
4. **Performance Testing**: Verify RLS performance with production-like data volumes
5. **Deployment**: Deploy API to staging and production environments

---

## Conclusion

✅ **The API refactoring is COMPLETE and ready for testing!**

All models, DTOs, controllers, services, validators, and database context have been successfully updated to match the refactored database schema. The API now supports:
- Multi-tenant operations with Firebase/Firestore account IDs
- Enhanced patient information with custodian details
- Transitional Care Management scheduling
- Provider management with NPI-based identification
- Row Level Security for data isolation
