# Deployment Guide - HealthExtent API

## Overview

This guide covers deploying the HealthExtent API to Azure App Service with Azure Key Vault integration.

---

## 🚨 Quota Issue (Free Trial)

Your Free Trial subscription has **0 quota for Basic (B1) tier App Services**.

### Options:

#### Option 1: Use Free (F1) Tier ✅ RECOMMENDED
```powershell
.\create-app-service-free.ps1
```

**Limitations:**
- 60 CPU minutes/day
- 1 GB RAM
- No custom domains
- No SSL certificates
- Good for testing and development

#### Option 2: Request Quota Increase
1. Go to Azure Portal → Subscriptions
2. Select your subscription
3. Go to Usage + quotas
4. Request quota increase for Basic tier VMs

#### Option 3: Upgrade Subscription
- Upgrade from Free Trial to Pay-As-You-Go
- Provides higher quotas and production features

---

## 📦 Deployment Scripts

### 1. `create-app-service-free.ps1`
Creates App Service with FREE tier (F1)

```powershell
.\create-app-service-free.ps1
```

**What it does:**
- Creates Resource Group (if needed)
- Creates App Service Plan (F1 tier)
- Creates App Service
- Enables Managed Identity
- Grants Key Vault access
- Configures environment variables

### 2. `create-app-service.ps1`
Creates App Service with Basic tier (B1) - Requires quota

```powershell
.\create-app-service.ps1
```

### 3. `deploy-api.ps1`
Deploys your API to App Service

```powershell
.\deploy-api.ps1
```

**What it does:**
- Cleans and restores packages
- Builds in Release mode
- Publishes application
- Creates deployment ZIP
- Deploys to Azure
- Restarts App Service

---

## 🚀 Quick Start

### Step 1: Create App Service (Free Tier)

```powershell
cd C:\Users\Edwin Almetes\Projects\healthextent
.\create-app-service-free.ps1
```

Wait for completion (~2-3 minutes).

### Step 2: Deploy Your API

```powershell
.\deploy-api.ps1
```

Wait for deployment (~5-10 minutes for first deployment).

### Step 3: Test Deployment

```powershell
# Test health endpoint
curl https://he-api-dev-eus2.azurewebsites.net/health

# View logs
az webapp log tail --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

---

## 🔐 What Happens During Deployment

### App Service Creation:
1. ✅ Creates App Service with Free/Basic tier
2. ✅ Enables Managed Identity
3. ✅ Grants Key Vault access (get, list permissions)
4. ✅ Sets environment variables:
   - `ASPNETCORE_ENVIRONMENT=Production`
   - `KeyVaultUri=https://he-kv-dev-eus2.vault.azure.net/`
5. ✅ Enables HTTPS only

### Deployment:
1. ✅ Builds API in Release mode
2. ✅ Publishes application
3. ✅ Creates ZIP package
4. ✅ Uploads to Azure
5. ✅ Restarts App Service
6. ✅ API loads secrets from Key Vault

---

## 📊 Verify Deployment

### 1. Check Health Endpoint

```bash
curl https://he-api-dev-eus2.azurewebsites.net/health
```

**Expected:** `Healthy`

### 2. View Application Logs

```bash
# Stream logs in real-time
az webapp log tail \
  --name he-api-dev-eus2 \
  --resource-group he-rg-apps-dev-eus2

# Look for:
#   "Azure Key Vault configured: https://he-kv-dev-eus2.vault.azure.net/"
#   "Starting Health Extent API..."
```

### 3. Test Authentication

```bash
# Generate token
curl -X POST https://he-api-dev-eus2.azurewebsites.net/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"test","tenantKey":"account_123"}'

# Should return:
# { "token": "eyJ...", "expires": "...", ... }
```

### 4. Test Protected Endpoint

```bash
# Use token to call protected endpoint
curl https://he-api-dev-eus2.azurewebsites.net/api/patients/tenant/account_123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 Troubleshooting

### Issue: "Azure Key Vault not configured" in logs

**Cause:** Environment variable not set

**Fix:**
```bash
az webapp config appsettings set \
  --name he-api-dev-eus2 \
  --resource-group he-rg-apps-dev-eus2 \
  --settings KeyVaultUri=https://he-kv-dev-eus2.vault.azure.net/
```

### Issue: "401 Unauthorized" when accessing Key Vault

**Cause:** Managed Identity doesn't have access

**Fix:**
```bash
# Get Principal ID
$identity = az webapp identity show \
  --name he-api-dev-eus2 \
  --resource-group he-rg-apps-dev-eus2 | ConvertFrom-Json

# Grant access
az keyvault set-policy \
  --name he-kv-dev-eus2 \
  --object-id $identity.principalId \
  --secret-permissions get list
```

### Issue: "Connection string not found"

**Cause:** Connection string not in Key Vault

**Fix:**
```bash
az keyvault secret set \
  --vault-name he-kv-dev-eus2 \
  --name "ConnectionStrings--HealthExtentDb" \
  --value "YOUR_CONNECTION_STRING"

# Restart app
az webapp restart --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

### Issue: Deployment fails

**Check logs:**
```bash
az webapp log download \
  --name he-api-dev-eus2 \
  --resource-group he-rg-apps-dev-eus2 \
  --log-file logs.zip
```

### Issue: "Quota exceeded"

**Options:**
1. Use Free (F1) tier: `.\create-app-service-free.ps1`
2. Request quota increase
3. Use different subscription

---

## 🔄 Updating Your Deployment

### Update Code Only

```powershell
.\deploy-api.ps1
```

### Update Configuration

```bash
# Update app settings
az webapp config appsettings set \
  --name he-api-dev-eus2 \
  --resource-group he-rg-apps-dev-eus2 \
  --settings NewSetting=Value

# Restart
az webapp restart --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

### Update Secrets

```bash
# Update in Key Vault
az keyvault secret set \
  --vault-name he-kv-dev-eus2 \
  --name SecretName \
  --value NewValue

# Restart app to pick up new secret
az webapp restart --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

---

## 📈 Scaling

### Scale Up (Vertical)

```bash
# Upgrade to S1 tier (Production ready)
az appservice plan update \
  --name he-api-dev-plan \
  --resource-group he-rg-apps-dev-eus2 \
  --sku S1
```

### Scale Out (Horizontal)

```bash
# Add more instances
az appservice plan update \
  --name he-api-dev-plan \
  --resource-group he-rg-apps-dev-eus2 \
  --number-of-workers 2
```

---

## 🎯 Production Checklist

Before going to production:

### Infrastructure
- [ ] Upgrade from F1 to S1 or higher tier
- [ ] Enable autoscaling
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure Azure Front Door or CDN

### Security
- [ ] Enable Application Insights
- [ ] Configure alerts
- [ ] Enable diagnostic logs
- [ ] Set up backup schedule
- [ ] Review and test RLS policies
- [ ] Implement rate limiting
- [ ] Configure CORS for production domains

### Monitoring
- [ ] Set up Application Insights
- [ ] Configure log analytics
- [ ] Create alert rules
- [ ] Set up availability tests
- [ ] Configure performance monitoring

### Testing
- [ ] Load testing
- [ ] Security testing
- [ ] Penetration testing
- [ ] End-to-end testing

---

## 📚 Additional Commands

### View All App Settings
```bash
az webapp config appsettings list \
  --name he-api-dev-eus2 \
  --resource-group he-rg-apps-dev-eus2
```

### SSH into Container
```bash
az webapp ssh --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

### View Deployment History
```bash
az webapp deployment list \
  --name he-api-dev-eus2 \
  --resource-group he-rg-apps-dev-eus2
```

### Stop/Start App Service
```bash
# Stop
az webapp stop --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2

# Start
az webapp start --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

---

## 🔗 Resources

- **Azure Portal:** https://portal.azure.com
- **App Service:** https://he-api-dev-eus2.azurewebsites.net
- **Key Vault:** https://he-kv-dev-eus2.vault.azure.net
- **Logs:** `az webapp log tail --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2`

---

**Last Updated:** 2025-10-29
**Status:** Ready for deployment ✅
