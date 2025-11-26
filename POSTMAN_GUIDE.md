# Postman Collection Guide - HealthExtent API

## 📦 Files Created

1. **HealthExtent-API.postman_collection.json** - Complete API collection with all endpoints
2. **HealthExtent-Production.postman_environment.json** - Production environment configuration

---

## 🚀 Quick Start

### Step 1: Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **HealthExtent-API.postman_collection.json**
4. Click **Import**

### Step 2: Import Environment

1. Click **Import** button again
2. Select **HealthExtent-Production.postman_environment.json**
3. Click **Import**

### Step 3: Activate Environment

1. Click the environment dropdown (top right)
2. Select **HealthExtent - Production**
3. The environment is now active ✅

### Step 4: Test Connection

1. Open the collection: **HealthExtent API**
2. Navigate to: **Health** → **Health Check**
3. Click **Send**
4. Expected response: `"Healthy"` with status `200 OK`

---

## 🔐 Authentication Setup

### Method 1: Automatic Token Generation (Development Only)

**Note:** This only works in Development mode. Your production API has this disabled.

1. Navigate to: **Authentication** → **Generate Token (Development Only)**
2. In the request body, set your `tenantKey`
3. Click **Send**
4. The token will be **automatically saved** to the environment variable `{{token}}`
5. All subsequent requests will use this token

### Method 2: Manual Token Entry (Production)

1. Obtain your JWT token from your authentication system
2. Click the environment **Quick Look** (eye icon, top right)
3. Find the `token` variable
4. Click **Edit** (pencil icon)
5. Paste your token in the **Current Value** field
6. Click **Save**

---

## 📋 Collection Structure

The collection includes 7 main folders:

### 1. **Health**
- `GET /health` - Health check (no auth required)

### 2. **Authentication**
- `POST /api/auth/token` - Generate JWT token (Development only)

### 3. **Patients**
- `GET /api/patients/tenant/{tenantKey}` - Get all patients
- `GET /api/patients/{id}/tenant/{tenantKey}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient

### 4. **Encounters**
- `GET /api/encounters/tenant/{tenantKey}` - Get all encounters
- `GET /api/encounters/{id}/tenant/{tenantKey}` - Get encounter by ID
- `POST /api/encounters` - Create encounter
- `PUT /api/encounters/{id}` - Update encounter

### 5. **Hospitals**
- `GET /api/hospitals/tenant/{tenantKey}` - Get all hospitals
- `GET /api/hospitals/{id}/tenant/{tenantKey}` - Get hospital by ID
- `POST /api/hospitals` - Create hospital
- `PUT /api/hospitals/{id}` - Update hospital
- `PUT /api/hospitals/{id}/status` - Set hospital status

### 6. **Providers**
- `GET /api/providers/tenant/{tenantKey}` - Get all providers
- `GET /api/providers/{id}/tenant/{tenantKey}` - Get provider by ID
- `POST /api/providers` - Create provider
- `PUT /api/providers/{id}` - Update provider

### 7. **Care Transitions**
- `GET /api/caretransitions/encounter/{encounterId}` - Get by encounter
- `POST /api/caretransitions` - Create care transition
- `PUT /api/caretransitions/{id}` - Update care transition

### 8. **Audit**
- `GET /api/audit/tenant/{tenantKey}` - Get audit logs
- `POST /api/audit` - Write audit log

---

## 🔧 Environment Variables

The collection uses 3 environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `baseUrl` | API base URL | `http://he-api-dev-eus2.eastus2.azurecontainer.io:8080` |
| `token` | JWT authentication token | _(empty - you need to set this)_ |
| `tenantKey` | Your tenant identifier | `account_123` |

### Updating Environment Variables

1. Click the environment **Quick Look** (eye icon)
2. Click **Edit** (pencil icon)
3. Update the values
4. Click **Save**

---

## 📝 Example Workflow

### Scenario: Create a Patient and Encounter

#### Step 1: Health Check
```
GET /health
```
**Verify API is running**

#### Step 2: Generate Token (if in Development mode)
```
POST /api/auth/token
Body:
{
  "username": "test",
  "tenantKey": "account_123"
}
```
**Token saved automatically to environment**

#### Step 3: Create Patient
```
POST /api/patients
Body:
{
  "mrn": "MRN12345",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-15",
  "gender": "M",
  "ssn": "123-45-6789",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "phoneNumber": "555-123-4567",
  "email": "john.doe@example.com",
  "tenantKey": "account_123"
}
```
**Note the returned patient ID**

#### Step 4: Get All Patients
```
GET /api/patients/tenant/account_123
```
**Verify patient was created**

#### Step 5: Create Hospital
```
POST /api/hospitals
Body:
{
  "name": "General Hospital",
  "facilityCode": "GH001",
  "address": "789 Medical Plaza",
  "city": "New York",
  "state": "NY",
  "zipCode": "10003",
  "phoneNumber": "555-111-2222",
  "isActive": true,
  "tenantKey": "account_123"
}
```
**Note the returned hospital ID**

#### Step 6: Create Encounter
```
POST /api/encounters
Body:
{
  "patientId": 1,
  "hospitalId": 1,
  "encounterNumber": "ENC123456",
  "admissionDate": "2025-10-29T10:00:00Z",
  "encounterType": "Inpatient",
  "admissionReason": "Chest pain",
  "attendingPhysician": "Dr. Smith",
  "status": "Active",
  "tenantKey": "account_123"
}
```

#### Step 7: Get Encounter
```
GET /api/encounters/1/tenant/account_123
```
**Verify encounter details**

---

## 🔒 Authentication Headers

All requests (except `/health` and `/api/auth/token`) automatically include:

```
Authorization: Bearer {{token}}
```

This is configured at the **collection level**, so you don't need to add it to individual requests.

---

## ✏️ Customizing Requests

### Changing Path Variables

For requests with path variables (e.g., `{id}`):

1. Select the request
2. Click on **Params** tab
3. Update the **Path Variables** values
4. Example: Change `id` from `1` to `5`

### Modifying Request Bodies

1. Select the request
2. Go to **Body** tab
3. Edit the JSON payload
4. Click **Send**

### Adding Query Parameters

1. Select the request
2. Click **Params** tab
3. Add new query parameters in the **Query Params** section

---

## 🧪 Testing Features

### Automatic Token Saving

The **Generate Token** request includes a test script that automatically saves the token:

```javascript
// Test script included in Generate Token request
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    console.log("Token saved to environment:", jsonData.token);
}
```

### Adding Your Own Tests

You can add test scripts to any request:

1. Select the request
2. Go to **Tests** tab
3. Add JavaScript test code
4. Example:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.not.be.empty;
});
```

---

## 🌍 Multiple Environments

You can create environments for different deployments:

### Creating Development Environment

1. Click **Environments** (left sidebar)
2. Click **+** to create new environment
3. Name it: **HealthExtent - Development**
4. Add variables:
   ```
   baseUrl: http://localhost:5000
   token: (empty)
   tenantKey: account_123
   ```
5. Click **Save**

### Creating Staging Environment

1. Create another environment
2. Name it: **HealthExtent - Staging**
3. Set `baseUrl` to your staging URL
4. Switch between environments using the dropdown

---

## 📊 Response Examples

### Successful Patient Creation (201 Created)

```json
{
  "id": 1,
  "mrn": "MRN12345",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-15T00:00:00",
  "gender": "M",
  "tenantKey": "account_123",
  "createdAt": "2025-10-29T18:50:00Z"
}
```

### Authentication Error (401 Unauthorized)

```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid or missing authentication token"
}
```

### Validation Error (400 Bad Request)

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "FirstName": ["The FirstName field is required."],
    "TenantKey": ["The TenantKey field is required."]
  }
}
```

---

## 🔍 Troubleshooting

### Issue: 401 Unauthorized on all requests

**Solution:**
1. Verify `token` environment variable is set
2. Check token hasn't expired
3. Generate new token if needed

### Issue: 404 Not Found

**Solution:**
1. Verify `baseUrl` is correct
2. Check API endpoint path
3. Ensure API container is running

### Issue: 400 Bad Request - Validation errors

**Solution:**
1. Review request body JSON
2. Check all required fields are present
3. Verify data types match expected format
4. Ensure `tenantKey` is included in request body

### Issue: Connection timeout

**Solution:**
1. Check API is running: `curl http://he-api-dev-eus2.eastus2.azurecontainer.io:8080/health`
2. Verify network connectivity
3. Check Azure Container Instance status:
   ```bash
   az container show --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2 --query "instanceView.state"
   ```

---

## 📚 Additional Resources

### Postman Documentation
- **Collections:** https://learning.postman.com/docs/collections/collections-overview/
- **Environments:** https://learning.postman.com/docs/sending-requests/managing-environments/
- **Variables:** https://learning.postman.com/docs/sending-requests/variables/

### API Documentation
- **DEPLOYMENT_SUCCESS.md** - Deployment details
- **QUICK_START.md** - Quick deployment guide
- **API Endpoints:** See collection descriptions

---

## 💡 Pro Tips

1. **Use Collection Runner** to test multiple requests in sequence
2. **Export results** for reporting and documentation
3. **Use Pre-request Scripts** for dynamic data generation
4. **Share collections** with your team via Postman workspace
5. **Mock servers** can be created from this collection for frontend development
6. **Monitor** API health by scheduling collection runs

---

## 🔗 Quick Reference

| Action | Shortcut |
|--------|----------|
| Send Request | Ctrl + Enter (Cmd + Enter on Mac) |
| New Request | Ctrl + N |
| Save Request | Ctrl + S |
| Open Console | Ctrl + Alt + C |
| Search | Ctrl + K |

---

**Created:** 2025-10-29
**API Version:** 1.0
**Postman Collection Version:** 2.1

For API support, see DEPLOYMENT_SUCCESS.md
