# Encounter API Refactoring - TCM Schedule Fields Added

## Overview

Successfully added two TCM (Transitional Care Management) schedule fields to the Encounter API and database schema.

**Date:** 2025-10-18

---

## Changes Summary

### New Fields Added

**TcmSchedule1** and **TcmSchedule2** - Date/time fields for tracking transitional care management follow-up appointments.

- **Type:** `DATETIME2(3)` (nullable)
- **Purpose:** Track scheduled follow-up appointments for patients transitioning from hospital to home care
- **Format:** HL7 timestamp format in API (YYYYMMDDHHmmss), stored as datetime in database

---

## Database Changes

### Encounter Table Schema Update

Added two columns to `he.Encounter` table:

```sql
TcmSchedule1 DATETIME2(3) NULL
TcmSchedule2 DATETIME2(3) NULL
```

### Stored Procedure Updated

`he.UpsertEncounter_Tenant` now includes:
- New parameters: `@TcmSchedule1_TS` and `@TcmSchedule2_TS`
- HL7 timestamp parsing for TCM fields
- Insert/Update logic includes TCM fields

**SQL Script Location:**
`C:\Users\Edwin Almetes\Projects\healthextent\database\ADD_TCM_FIELDS_TO_ENCOUNTER.sql`

---

## API Changes

### 1. Encounter Model (`Encounter.cs`)

Added properties:
```csharp
[Column(TypeName = "datetime2(3)")]
public DateTime? TcmSchedule1 { get; set; }

[Column(TypeName = "datetime2(3)")]
public DateTime? TcmSchedule2 { get; set; }
```

### 2. Encounter DTO (`EncounterDto.cs`)

**EncounterDto** - Added to response:
```csharp
public DateTime? TcmSchedule1 { get; set; }
public DateTime? TcmSchedule2 { get; set; }
```

**UpsertEncounterRequest** - Added to request:
```csharp
public string? TcmSchedule1_TS { get; set; }  // HL7 timestamp format
public string? TcmSchedule2_TS { get; set; }  // HL7 timestamp format
```

### 3. Service Layer (`HealthExtentService.cs`)

**Updated Methods:**
- `UpsertEncounterAsync()` - Passes TCM fields to stored procedure
- `GetEncounterByKeyAsync()` - Returns TCM fields in response
- `GetEncountersByPatientAsync()` - Returns TCM fields in response
- `GetEncountersByTenantAsync()` - Returns TCM fields in response

All SELECT queries now include TCM fields in the DTO mapping.

---

## API Usage

### Creating/Updating an Encounter with TCM Dates

**POST** `/api/Encounters/upsert`

```json
{
  "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
  "hospitalCode": "NBH",
  "visitNumber": "V123456",
  "patientKey": 1,
  "admit_TS": "20251015100000",
  "discharge_TS": "20251016150000",
  "tcmSchedule1_TS": "20251020140000",
  "tcmSchedule2_TS": "20251027140000",
  "patientClass": "I",
  "location": "Ward 3",
  "primaryDoctor": "Dr. Smith",
  "visitStatus": "F",
  "status": 1
}
```

### Getting Encounters with TCM Fields

**GET** `/api/Encounters/tenant/{tenantKey}?skip=0&take=100`

**Response:**
```json
[
  {
    "encounterKey": 16,
    "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
    "hospitalKey": 1,
    "patientKey": 4,
    "visitNumber": "V123456",
    "admitDateTime": "2025-10-15T10:00:00",
    "dischargeDateTime": "2025-10-16T15:00:00",
    "tcmSchedule1": "2025-10-20T14:00:00",
    "tcmSchedule2": "2025-10-27T14:00:00",
    "status": 1,
    "patient": {
      "patientKey": 4,
      "familyName": "Smith",
      "givenName": "John",
      ...
    }
  }
]
```

---

## HL7 Timestamp Format

TCM fields use HL7 timestamp format in API requests:

**Format:** `YYYYMMDDHHmmss`

**Examples:**
- `20251020140000` = October 20, 2025 at 2:00 PM
- `20251027093000` = October 27, 2025 at 9:30 AM

The stored procedure automatically parses HL7 format to `DATETIME2(3)`.

---

## Database Migration Steps

**⚠️ IMPORTANT: Run the database migration script**

1. Open Azure Data Studio or SQL Server Management Studio
2. Connect to `he-sql-dev-eus2.database.windows.net`
3. Select database: `he-healthcare-db`
4. Run script: `C:\Users\Edwin Almetes\Projects\healthextent\database\ADD_TCM_FIELDS_TO_ENCOUNTER.sql`

The script will:
- Add `TcmSchedule1` and `TcmSchedule2` columns to Encounter table
- Drop and recreate `UpsertEncounter_Tenant` stored procedure with TCM support
- Handle existing data (columns are nullable)

---

## Files Modified

### Database
- ✅ `database/ADD_TCM_FIELDS_TO_ENCOUNTER.sql` - Migration script (NEW)

### API Code
- ✅ `Models/Encounter.cs` - Added TcmSchedule1 and TcmSchedule2 properties
- ✅ `DTOs/EncounterDto.cs` - Added TCM fields to DTO and request
- ✅ `Services/HealthExtentService.cs` - Updated all encounter methods

---

## Testing

### 1. Test Creating an Encounter with TCM Dates

```bash
curl -X POST http://localhost:5000/api/Encounters/upsert \
  -H "Content-Type: application/json" \
  -d '{
    "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
    "hospitalCode": "NBH",
    "visitNumber": "TEST001",
    "patientKey": 1,
    "tcmSchedule1_TS": "20251120140000",
    "tcmSchedule2_TS": "20251127140000",
    "status": 1
  }'
```

### 2. Test Retrieving Encounters with TCM Fields

```bash
curl http://localhost:5000/api/Encounters/tenant/jY4rw2QSwyW0xIAnn2Xa7k2CGfF2?skip=0&take=5
```

Verify the response includes `tcmSchedule1` and `tcmSchedule2` fields.

---

## API Status

- **Running:** ✅ Yes
- **Ports:** http://localhost:5000 and https://localhost:5001
- **CORS:** Enabled for http://localhost:3004
- **Build Status:** ✅ Successful

---

## Backward Compatibility

✅ **Fully Backward Compatible**

- TCM fields are **optional** (nullable)
- Existing API calls work without TCM fields
- Old encounters without TCM data will return `null` for these fields
- No breaking changes to existing functionality

---

## Next Steps

1. **Run the database migration script** (required for TCM fields to work)
2. **Test the endpoints** using the examples above
3. **Update Mirth Connect** (if applicable) to include TCM fields in HL7 messages
4. **Update frontend dashboard** to display and edit TCM schedule dates

---

## Use Case: Transitional Care Management

TCM Schedule fields support Medicare's Transitional Care Management program:

- **TcmSchedule1:** First follow-up appointment (within 2 business days of discharge for high-risk patients)
- **TcmSchedule2:** Second follow-up appointment (within 14 days of discharge)

These fields enable:
- Automated appointment scheduling
- Compliance tracking for TCM billing codes
- Care coordination workflows
- Patient follow-up reminders

---

**Implementation Complete:** 2025-10-18
**Status:** ✅ API code updated and running
**Pending:** Database migration script execution
