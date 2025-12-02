# Azure Communication Services Email - Complete Setup Guide

## Current Status

✅ **Email Service Created**: `HEmailling` in resource group `he-rg-app-dev-eus2`
✅ **Domain Added**: `healthextent.ai`
❌ **Domain NOT Verified** - All DNS records show "NotStarted"
❌ **Communication Services Resource** - Needs to be created and linked

## Missing Components

### 1. Domain Verification (CRITICAL)

Your domain `healthextent.ai` is configured but **NOT VERIFIED**. You must add these DNS records:

#### Required DNS Records:

**A. Domain Verification (TXT Record)**
```
Type: TXT
Name: healthextent.ai (or @)
Value: ms-domain-verification=a7255ece-3e50-4b9b-b016-7b7a647a1f0f
TTL: 3600
```

**B. DKIM Record 1 (CNAME)**
```
Type: CNAME
Name: selector1-azurecomm-prod-net._domainkey
Value: selector1-azurecomm-prod-net._domainkey.azurecomm.net
TTL: 3600
```

**C. DKIM Record 2 (CNAME)**
```
Type: CNAME
Name: selector2-azurecomm-prod-net._domainkey
Value: selector2-azurecomm-prod-net._domainkey.azurecomm.net
TTL: 3600
```

**D. SPF Record (TXT)**
```
Type: TXT
Name: healthextent.ai (or @)
Value: v=spf1 include:spf.protection.outlook.com -all
TTL: 3600
```

**Note**: If you already have an SPF record, you need to **merge** it, not replace it. SPF records should be combined like:
```
v=spf1 include:existing-provider.com include:spf.protection.outlook.com -all
```

### 2. Create Communication Services Resource

You need a **Communication Services** resource (different from Email Services) to get the connection string.

#### Via Azure Portal:

1. Go to: https://portal.azure.com
2. Click **Create a resource**
3. Search for **"Communication Services"**
4. Click **Create**
5. Configure:
   - **Resource Group**: `he-rg-app-dev-eus2`
   - **Name**: `HEmailling-CommService` (or similar)
   - **Data Location**: `United States`
6. Click **Review + Create**
7. After creation, go to **Settings** → **Email** → **Domains**
8. Click **Connect domain**
9. Select `healthextent.ai`

#### Via Azure CLI:

```bash
# Create Communication Services resource
az communication create \
  --name "HEmailling-CommService" \
  --resource-group "he-rg-app-dev-eus2" \
  --data-location "UnitedStates"

# Link the email domain
az communication email domain add \
  --communication-service-name "HEmailling-CommService" \
  --resource-group "he-rg-app-dev-eus2" \
  --email-service-name "HEmailling" \
  --domain-name "healthextent.ai"
```

### 3. Get Connection String

After creating the Communication Services resource:

#### Via Azure Portal:
1. Navigate to your Communication Services resource
2. Go to **Settings** → **Keys**
3. Copy the **Connection string**

#### Via Azure CLI:
```bash
az communication list-key \
  --name "HEmailling-CommService" \
  --resource-group "he-rg-app-dev-eus2"
```

### 4. Configure API

Add to `appsettings.Development.json`:

```json
{
  "AzureCommunicationServices": {
    "ConnectionString": "endpoint=https://hemailing-commservice.communication.azure.com/;accesskey=YOUR_KEY",
    "FromEmail": "DoNotReply@healthextent.ai"
  }
}
```

## Step-by-Step Setup Instructions

### Step 1: Add DNS Records (Do this first!)

1. Log into your DNS provider for `healthextent.ai`
2. Add all 4 DNS records listed above
3. Wait 5-15 minutes for DNS propagation
4. Verify in Azure Portal:
   - Go to Email Services → HEmailling → Domains
   - Click on `healthextent.ai`
   - Click **Refresh** to check verification status
   - All should show "Verified" ✅

### Step 2: Create Communication Services Resource

```bash
# Login to Azure
az login

# Create the Communication Services resource
az communication create \
  --name "HEmailling-CommService" \
  --resource-group "he-rg-app-dev-eus2" \
  --data-location "UnitedStates"
```

### Step 3: Link Email Domain

In Azure Portal:
1. Go to your new Communication Services resource
2. Navigate to **Email** → **Domains**
3. Click **Connect domain**
4. Select `healthextent.ai` from the list
5. Click **Connect**

### Step 4: Get Connection String

```bash
az communication list-key \
  --name "HEmailling-CommService" \
  --resource-group "he-rg-app-dev-eus2" \
  --query "primaryConnectionString" \
  --output tsv
```

### Step 5: Configure and Test

1. Add the connection string to `appsettings.Development.json`
2. Restart the API
3. Test the contact form at http://localhost:3000/contact
4. Check API logs for confirmation

## Verification Checklist

- [ ] DNS records added for healthextent.ai
- [ ] Domain verification status shows "Verified" in Azure Portal
- [ ] Communication Services resource created
- [ ] Email domain linked to Communication Services
- [ ] Connection string obtained
- [ ] Connection string added to appsettings.Development.json
- [ ] API restarted
- [ ] Contact form tested successfully

## Troubleshooting

### DNS Records Not Verifying
- Wait 15-30 minutes for DNS propagation
- Use `nslookup` or `dig` to verify records are live
- Some DNS providers require "@" instead of domain name for root records

### Cannot Send Emails
- Verify domain status is "Verified" for all records
- Check connection string is correct
- Ensure sender address matches domain (DoNotReply@healthextent.ai)
- Review API logs for detailed error messages

### SPF Conflicts
- If you have existing SPF records, merge them
- Only one SPF record is allowed per domain
- Format: `v=spf1 include:existing.com include:spf.protection.outlook.com -all`

## Quick Commands Reference

```bash
# Check domain verification status
az rest --method get --url "/subscriptions/89c2ca56-e927-45c2-9bb0-27664b631120/resourceGroups/he-rg-app-dev-eus2/providers/Microsoft.Communication/EmailServices/HEmailling/domains/healthextent.ai?api-version=2023-04-01"

# List Communication Services resources
az communication list --resource-group "he-rg-app-dev-eus2"

# Get connection string
az communication list-key --name "HEmailling-CommService" --resource-group "he-rg-app-dev-eus2"
```

## Notes

- DNS changes can take up to 48 hours to fully propagate (usually 5-15 minutes)
- The Email Service alone cannot send emails - you need the Communication Services resource
- The connection string contains sensitive keys - keep it secure
- Test with the recipient email: `ealmetes@gmail.com`
