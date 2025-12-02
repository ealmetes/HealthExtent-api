# Azure Communication Services Email - Current Status

## ✅ Completed Setup

### 1. Email Service Resource
- **Name**: HEmailling
- **Resource Group**: he-rg-app-dev-eus2
- **Status**: ✅ Provisioned and Active

### 2. Domain Configuration
- **Domain**: healthextent.ai
- **Status**: ✅ Configured (but NOT verified - see below)
- **From Email**: DoNotReply@healthextent.ai

### 3. Communication Services Resource
- **Name**: HEmailling-CommService
- **Resource Group**: he-rg-app-dev-eus2
- **Status**: ✅ Created and Active
- **Endpoint**: https://hemailling-commservice.unitedstates.communication.azure.com/

### 4. Connection String
- ✅ Retrieved and configured in `appsettings.Development.json`
- ✅ API restarted with new configuration

### 5. API Code
- ✅ Azure.Communication.Email package installed (v1.0.1)
- ✅ EmailService updated to use Azure Communication Services
- ✅ Contact form configured to send to: **ealmetes@gmail.com**

## ❌ Critical: Domain NOT Verified

**The email service will NOT work until you verify your domain DNS records.**

### Required DNS Records (Must be added to healthextent.ai):

#### 1. Domain Verification (TXT Record)
```
Host: @ (or healthextent.ai)
Type: TXT
Value: ms-domain-verification=a7255ece-3e50-4b9b-b016-7b7a647a1f0f
TTL: 3600
```

#### 2. DKIM Record 1 (CNAME)
```
Host: selector1-azurecomm-prod-net._domainkey
Type: CNAME
Value: selector1-azurecomm-prod-net._domainkey.azurecomm.net
TTL: 3600
```

#### 3. DKIM Record 2 (CNAME)
```
Host: selector2-azurecomm-prod-net._domainkey
Type: CNAME
Value: selector2-azurecomm-prod-net._domainkey.azurecomm.net
TTL: 3600
```

#### 4. SPF Record (TXT)
```
Host: @ (or healthextent.ai)
Type: TXT
Value: v=spf1 include:spf.protection.outlook.com -all
TTL: 3600
```

**⚠️ IMPORTANT**: If you already have an SPF record, you must **merge** them:
```
v=spf1 include:existing-provider.com include:spf.protection.outlook.com -all
```

## 🔧 How to Add DNS Records

### Option 1: If you manage DNS yourself
1. Log into your DNS provider (GoDaddy, Cloudflare, Route53, etc.)
2. Navigate to DNS management for healthextent.ai
3. Add all 4 records above
4. Wait 5-15 minutes for propagation

### Option 2: If someone else manages DNS
Forward them this section and ask them to add these records.

## ✔️ Verify DNS Records

After adding the records:

1. Wait 15 minutes for DNS propagation
2. Test with command line:
   ```bash
   # Test TXT records
   nslookup -type=TXT healthextent.ai

   # Test DKIM CNAME
   nslookup -type=CNAME selector1-azurecomm-prod-net._domainkey.healthextent.ai
   ```

3. Check in Azure Portal:
   - Go to: Azure Portal → Email Services → HEmailling → Domains
   - Click on "healthextent.ai"
   - Click "Refresh" button
   - All verification statuses should show "Verified" ✅

## 🧪 Testing the Contact Form

Once DNS is verified:

1. Go to: http://localhost:3000/contact
2. Fill out the form with test data
3. Submit the form
4. Check API logs (console) for confirmation
5. Check ealmetes@gmail.com inbox for the email

### Expected API Log Output:
```
info: Sending contact form email via Azure Communication Services to ealmetes@gmail.com
info: Contact form email sent successfully. Message ID: xxx, Status: In Progress
```

## 📊 Current Verification Status

**As of last check** (via Azure CLI):
- Domain Verification: ❌ NotStarted
- DKIM: ❌ NotStarted
- DKIM2: ❌ NotStarted
- SPF: ❌ NotStarted
- DMARC: ❌ NotStarted (optional)

## 🚀 Once Verified, Email Will:

- ✅ Send from: DoNotReply@healthextent.ai
- ✅ Send to: ealmetes@gmail.com
- ✅ Include reply-to header with sender's email
- ✅ Use HTML-formatted email template
- ✅ Be delivered via Azure Communication Services

## 📝 Quick Reference Commands

### Check Domain Verification Status
```bash
az rest --method get --url "/subscriptions/89c2ca56-e927-45c2-9bb0-27664b631120/resourceGroups/he-rg-app-dev-eus2/providers/Microsoft.Communication/EmailServices/HEmailling/domains/healthextent.ai?api-version=2023-04-01" --query "properties.verificationStates"
```

### Get Connection String (if needed again)
```bash
az rest --method post --url "/subscriptions/89c2ca56-e927-45c2-9bb0-27664b631120/resourceGroups/he-rg-app-dev-eus2/providers/Microsoft.Communication/CommunicationServices/HEmailling-CommService/listKeys?api-version=2023-04-01"
```

## ⏭️ Next Steps

1. **[ACTION REQUIRED]** Add DNS records to healthextent.ai
2. Wait 15-30 minutes for DNS propagation
3. Verify records in Azure Portal
4. Test contact form at http://localhost:3000/contact
5. Check ealmetes@gmail.com inbox

## 🔒 Security Notes

- ✅ Connection string is stored in appsettings.Development.json (local only)
- ⚠️ Do NOT commit connection strings to source control
- 💡 For production, use Azure Key Vault or environment variables
- 🔑 Connection string contains access keys - treat as sensitive

## 📞 Support

If emails still don't send after DNS verification:
1. Check API logs for detailed errors
2. Verify sender email matches domain (DoNotReply@healthextent.ai)
3. Check Azure Communication Services logs in Azure Portal
4. Verify all DNS records with `nslookup` or online DNS checker tools
