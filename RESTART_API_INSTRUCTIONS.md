# How to Restart the API with New Changes

## Problem
The API is currently running (Process ID: 54884) and needs to be restarted to:
1. Apply CORS fixes (allow http://localhost:3004)
2. Disable HTTPS redirection
3. Load the new DischargeSummariesController

## Solution

### Option 1: Use PowerShell Script (Recommended)

Open PowerShell and run:

```powershell
cd "C:\Users\Edwin Almetes\Projects\healthextent"
.\restart-api.ps1
```

This script will:
- Stop all running API processes
- Start a fresh instance with new configuration
- Show status messages

### Option 2: Manual Restart

1. **Stop the running API:**
   ```powershell
   Stop-Process -Id 54884 -Force
   ```

2. **Navigate to API directory:**
   ```powershell
   cd "C:\Users\Edwin Almetes\Projects\healthextent\api\HealthExtent.Api"
   ```

3. **Start the API:**
   ```powershell
   dotnet run
   ```

### Option 3: Task Manager

1. Open Task Manager (Ctrl+Shift+Esc)
2. Find "HealthExtent.Api" or "dotnet.exe" (PID 54884)
3. Right-click → End Task
4. Open terminal in API directory
5. Run `dotnet run`

---

## What's New

### 1. CORS Configuration Fixed
- Added `http://localhost:3004` to allowed origins
- Your dashboard can now access the API

### 2. HTTPS Redirection Disabled
- No more redirect from HTTP to HTTPS
- Frontend can use `http://localhost:5000` directly

### 3. New DischargeSummariesController

#### Endpoints Available:

**GET /api/discharge-summaries**
- Query Parameters:
  - `tenantKey` (optional)
  - `page` (default: 1)
  - `pageSize` (default: 10)
  - `reviewStatus` (Pending, In Review, Completed, Approved)
  - `priority` (Urgent, High, Normal, Low)
  - `assignedTo` (optional)

Example:
```
GET http://localhost:5000/api/discharge-summaries?page=1&pageSize=5&reviewStatus=Pending
```

**GET /api/discharge-summaries/{id}**
- Get a specific discharge summary by ID

**POST /api/discharge-summaries**
- Create a new discharge summary
- Body:
```json
{
  "tenantKey": "account_hp_123",
  "patientKey": 1,
  "encounterKey": 1,
  "summaryText": "Patient discharged in good condition...",
  "priority": "Normal",
  "assignedTo": "Dr. Smith"
}
```

**PUT /api/discharge-summaries/{id}**
- Update a discharge summary
- Body:
```json
{
  "summaryText": "Updated summary text...",
  "reviewStatus": "Completed",
  "priority": "High",
  "reviewedBy": "Dr. Jones"
}
```

**DELETE /api/discharge-summaries/{id}**
- Delete a discharge summary

**GET /api/discharge-summaries/statistics**
- Get statistics about discharge summaries
- Returns counts by status and priority

---

## Testing

After restart, test the endpoints:

```powershell
# Test CORS is working
curl http://localhost:5000/api/discharge-summaries?page=1&pageSize=5

# From your dashboard at http://localhost:3004
# The API calls should now work without CORS errors!
```

---

## Files Modified

1. `appsettings.json` - Added localhost:3004 to CORS
2. `Program.cs` - Disabled HTTPS redirection
3. `DTOs/DischargeSummaryDto.cs` - New DTOs
4. `Controllers/DischargeSummariesController.cs` - New controller

---

## Important Notes

- The DischargeSummariesController uses **Encounter** data as the backend
- Review status and priority are mock data (not stored in database yet)
- Summary text is stored in Encounter.Notes field
- Authentication is still disabled for testing

---

## Next Steps After Restart

1. Refresh your dashboard at `http://localhost:3004`
2. CORS errors should be gone
3. Discharge summaries endpoint should work
4. Data will come from existing Encounter records

---

## Troubleshooting

### CORS Error Still Appears
- Make sure you stopped ALL API processes
- Check no other instance is running on ports 5000/5001
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

### 404 Not Found
- Verify API is running: `http://localhost:5000/health`
- Check endpoint URL is correct
- Look at API console for errors

### No Data Returned
- Check if you have any Encounter records with DischargeDateTime
- Use the Patients/Encounters endpoints to add test data first
- Run SQL migration if database hasn't been updated

---

**Ready to restart? Run the PowerShell script!**

```powershell
cd "C:\Users\Edwin Almetes\Projects\healthextent"
.\restart-api.ps1
```
