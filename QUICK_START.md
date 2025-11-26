# HealthExtent API - Quick Start

## 🚀 Deploy in 3 Commands (10-15 minutes)

### Prerequisites
- ✅ Docker Desktop installed and running
- ✅ Azure CLI logged in
- ✅ Free Trial subscription (no upgrade needed!)

### Deployment Commands

```powershell
# Navigate to project directory
cd "C:\Users\Edwin Almetes\Projects\healthextent"

# Step 1: Create Container Registry (2 min)
.\create-container-registry.ps1

# Step 2: Build and push Docker image (5-8 min)
.\deploy-container.ps1

# Step 3: Deploy container instance (2 min)
.\create-container-instance.ps1
```

### Test Your Deployment

```bash
# The URL will be shown in output, format:
# http://he-api-dev-eus2.eastus2.azurecontainer.io:8080

# Test health endpoint
curl http://he-api-dev-eus2.eastus2.azurecontainer.io:8080/health

# Expected: "Healthy"
```

---

## 💰 Cost: ~$1.50 - $6.50/month

**Stop when not using:**
```powershell
az container stop --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

**Start when needed:**
```powershell
az container start --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
```

---

## 📋 What's Already Configured

✅ **Security:** Authentication, HTTPS, JWT tokens
✅ **Secrets:** All in Azure Key Vault (he-kv-dev-eus2)
✅ **Database:** Connection string configured
✅ **Multi-tenant:** Row-Level Security enabled
✅ **Managed Identity:** Automatic Key Vault access

---

## 🔧 Useful Commands

### View Logs
```powershell
az container logs --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2 --follow
```

### Check Container Status
```powershell
az container show --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2 --query "{Name:name, State:instanceView.state, IP:ipAddress.ip, FQDN:ipAddress.fqdn}" --output table
```

### Delete Container (when done)
```powershell
az container delete --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2 --yes
```

### Update Container (after code changes)
```powershell
# Rebuild and push image
.\deploy-container.ps1

# Delete old container
az container delete --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2 --yes

# Create new container
.\create-container-instance.ps1
```

---

## 📚 Full Documentation

- **DEPLOYMENT_SUMMARY.md** - Complete overview and recommendations
- **SUBSCRIPTION_UPGRADE_GUIDE.md** - If you want to upgrade later
- **DEPLOYMENT_OPTIONS.md** - Alternative deployment options
- **AZURE_KEY_VAULT_SETUP.md** - Key Vault details and troubleshooting

---

**Ready to deploy?** → Run: `.\create-container-registry.ps1`

**Last Updated:** 2025-10-29
