# Provider API - Implementation Complete

## Overview

Successfully added a complete Provider API to the HealthExtent system with full CRUD operations, multi-tenant support, and Row Level Security (RLS).

---

## Database Schema

### Provider Table (`he.Provider`)

| Field | Type | Description |
|-------|------|-------------|
| ProviderKey | BIGINT IDENTITY | Primary key |
| TenantKey | NVARCHAR(64) | Multi-tenant identifier |
| FamilyName | NVARCHAR(100) | Provider's last name |
| GivenName | NVARCHAR(100) | Provider's first name |
| Prefix | NVARCHAR(20) | Title (Dr., MD, DO, etc.) |
| Status | INT | 1=Active, 0=Inactive |
| NPI | NVARCHAR(10) | National Provider Identifier (10 digits) |
| LastUpdatedUtc | DATETIME2(3) | Last update timestamp |

**Indexes:**
- Primary Key on ProviderKey
- Index on TenantKey
- Index on NPI
- Index on FamilyName

**Security:**
- Row Level Security (RLS) enabled
- Tenant isolation via `he.fn_TenantAccessPredicate`

---

## Database Migration

**⚠️ IMPORTANT: Run this SQL script to create the Provider table:**

```powershell
# Location of the SQL script
C:\Users\Edwin Almetes\Projects\healthextent\database\CREATE_PROVIDER_TABLE.sql
```

**To execute:**
1. Open Azure Data Studio or SQL Server Management Studio
2. Connect to `he-sql-dev-eus2.database.windows.net`
3. Database: `he-healthcare-db`
4. Run the `CREATE_PROVIDER_TABLE.sql` script

The script will:
- Create the Provider table
- Add indexes
- Enable RLS
- Create the `UpsertProvider_Tenant` stored procedure

---

## API Endpoints

### 1. Upsert Provider (Create or Update)

**POST** `/api/Providers/upsert`

Creates a new provider or updates an existing one by NPI.

**Request Body:**
```json
{
  "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
  "familyName": "Smith",
  "givenName": "John",
  "prefix": "Dr.",
  "status": 1,
  "npi": "1234567890"
}
```

**Response:**
```json
{
  "providerKey": 1,
  "success": true,
  "message": "Provider created successfully"
}
```

**Validation Rules:**
- `tenantKey`: Required, max 64 characters
- `npi`: Required, exactly 10 digits
- `familyName`: Optional, max 100 characters
- `givenName`: Optional, max 100 characters
- `prefix`: Optional, max 20 characters
- `status`: 0 (Inactive) or 1 (Active)

---

### 2. Get Provider by Key

**GET** `/api/Providers/{providerKey}?tenantKey={tenantKey}`

Retrieves a provider by ProviderKey.

**Example:**
```
GET http://localhost:5000/api/Providers/1?tenantKey=jY4rw2QSwyW0xIAnn2Xa7k2CGfF2
```

**Response:**
```json
{
  "providerKey": 1,
  "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
  "familyName": "Smith",
  "givenName": "John",
  "prefix": "Dr.",
  "status": 1,
  "npi": "1234567890",
  "lastUpdatedUtc": "2025-10-18T02:30:00"
}
```

---

### 3. Get Provider by NPI

**GET** `/api/Providers/npi/{npi}?tenantKey={tenantKey}`

Retrieves a provider by National Provider Identifier.

**Example:**
```
GET http://localhost:5000/api/Providers/npi/1234567890?tenantKey=jY4rw2QSwyW0xIAnn2Xa7k2CGfF2
```

**Response:** Same as Get Provider by Key

---

### 4. Get All Providers for Tenant

**GET** `/api/Providers/tenant/{tenantKey}?skip={skip}&take={take}`

Retrieves all providers for a tenant with pagination.

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `take`: Number of records to return (default: 100, max: 100)

**Example:**
```
GET http://localhost:5000/api/Providers/tenant/jY4rw2QSwyW0xIAnn2Xa7k2CGfF2?skip=0&take=10
```

**Response:**
```json
[
  {
    "providerKey": 1,
    "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
    "familyName": "Smith",
    "givenName": "John",
    "prefix": "Dr.",
    "status": 1,
    "npi": "1234567890",
    "lastUpdatedUtc": "2025-10-18T02:30:00"
  },
  {
    "providerKey": 2,
    "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
    "familyName": "Johnson",
    "givenName": "Emily",
    "prefix": "MD",
    "status": 1,
    "npi": "0987654321",
    "lastUpdatedUtc": "2025-10-18T02:31:00"
  }
]
```

**Note:** Results are sorted by FamilyName, then GivenName.

---

## Files Created

### Database
- `C:\Users\Edwin Almetes\Projects\healthextent\database\CREATE_PROVIDER_TABLE.sql`

### API - Models
- `C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Models\Provider.cs`

### API - DTOs
- `C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\DTOs\ProviderDto.cs`

### API - Validators
- `C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Validators\UpsertProviderRequestValidator.cs`

### API - Controllers
- `C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api\Controllers\ProvidersController.cs`

### Files Modified
- `HealthExtentDbContext.cs` - Added `DbSet<Provider>`
- `IHealthExtentService.cs` - Added Provider service methods
- `HealthExtentService.cs` - Implemented Provider service methods

---

## Testing the API

### 1. Create a Test Provider

```bash
curl -X POST http://localhost:5000/api/Providers/upsert \
  -H "Content-Type: application/json" \
  -d '{
    "tenantKey": "jY4rw2QSwyW0xIAnn2Xa7k2CGfF2",
    "familyName": "Smith",
    "givenName": "John",
    "prefix": "Dr.",
    "status": 1,
    "npi": "1234567890"
  }'
```

### 2. Get All Providers

```bash
curl http://localhost:5000/api/Providers/tenant/jY4rw2QSwyW0xIAnn2Xa7k2CGfF2?skip=0&take=10
```

### 3. Get Provider by NPI

```bash
curl http://localhost:5000/api/Providers/npi/1234567890?tenantKey=jY4rw2QSwyW0xIAnn2Xa7k2CGfF2
```

---

## Features

✅ **Full CRUD Operations** - Create, Read, Update via upsert
✅ **Multi-Tenant Support** - Isolated by TenantKey
✅ **Row Level Security** - Database-level tenant isolation
✅ **NPI Validation** - Ensures 10-digit format
✅ **Upsert Logic** - Updates if NPI exists, creates if new
✅ **Pagination** - Efficient data retrieval for large datasets
✅ **Search by NPI** - Quick lookup by National Provider Identifier
✅ **Input Validation** - FluentValidation for all requests
✅ **Swagger Documentation** - Auto-generated API docs

---

## Next Steps

1. **Run the database migration script** to create the Provider table
2. **Test the endpoints** using the examples above
3. **Integrate with your dashboard** at `http://localhost:3004`
4. **Add more test data** for development

---

## API Status

- **Running:** ✅ Yes
- **Port:** http://localhost:5000 and https://localhost:5001
- **CORS:** Enabled for http://localhost:3004
- **Authentication:** Temporarily disabled for testing

---

## Security Notes

- Authentication is currently disabled for testing
- NPI format validation enforces 10-digit requirement
- Row Level Security ensures tenant data isolation
- All provider operations filtered by TenantKey

---

**API Implementation Date:** 2025-10-18
