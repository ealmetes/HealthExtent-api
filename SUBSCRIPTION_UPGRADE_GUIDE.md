# Azure Subscription Upgrade Guide

## Overview

This guide walks you through upgrading your Azure Free Trial subscription to Pay-As-You-Go to enable full deployment capabilities.

---

## 🎯 Why Upgrade?

**Current Limitation:**
Your Free Trial has **0 quota** for App Service Plans, preventing deployment.

**After Upgrade:**
- ✅ Full access to all Azure services
- ✅ Ability to deploy App Services (F1, B1, S1, etc.)
- ✅ Ability to deploy Container Instances
- ✅ Higher resource quotas
- ✅ Production-grade features
- ✅ No daily/monthly usage limits

**Cost:** Pay only for what you use (see pricing below)

---

## 💰 Pricing Estimates for HealthExtent API

### Option 1: Azure Container Instances (CHEAPEST)
**~$1.50 - $3.00 per month**

```
CPU: 1 vCore x $0.0000139/second = $36.16/month if running 24/7
Memory: 1.5 GB x $0.0000015/second = $3.89/month if running 24/7

But you can stop it when not in use!
- Running 8 hours/day: ~$13/month
- Running 4 hours/day: ~$6.50/month
- Running 1 hour/day: ~$1.65/month
```

**Best for:** Development/testing with on-demand usage

### Option 2: App Service - Free (F1) Tier
**$0 per month**

```
Limits:
- 60 CPU minutes per day
- 1 GB RAM
- 1 GB storage
```

**Best for:** Testing, demos, personal projects

### Option 3: App Service - Basic (B1) Tier
**~$13.14 per month**

```
Features:
- 100 ACU (Azure Compute Units)
- 1.75 GB RAM
- 10 GB storage
- Custom domains
- SSL certificates
- No CPU minute limits
```

**Best for:** Development, staging environments

### Option 4: App Service - Standard (S1) Tier
**~$54.75 per month**

```
Features:
- 100 ACU
- 1.75 GB RAM
- 50 GB storage
- Custom domains + SSL
- Auto-scaling (up to 10 instances)
- Deployment slots (staging/production)
- Daily backups
- Traffic Manager support
```

**Best for:** Production applications

---

## 📋 Upgrade Process (Step-by-Step)

### Method 1: Azure Portal (RECOMMENDED)

#### Step 1: Login to Azure Portal
1. Open browser and go to: https://portal.azure.com
2. Sign in with your Azure account

#### Step 2: Navigate to Subscriptions
1. In the search bar at the top, type "Subscriptions"
2. Click on "Subscriptions" in the results
3. You should see "Free Trial" subscription

#### Step 3: Upgrade Subscription
1. Click on your "Free Trial" subscription
2. Look for an "Upgrade" button at the top (or in the left menu)
3. Click "Upgrade" or "Upgrade to Pay-As-You-Go"

#### Step 4: Review and Accept Terms
1. Review the pricing information
2. Read the terms and conditions
3. Check the box to accept
4. Click "Upgrade" or "Submit"

#### Step 5: Wait for Upgrade to Complete
- Usually takes 1-5 minutes
- You'll see a notification when complete
- Subscription name changes to "Pay-As-You-Go" or "Microsoft Azure Plan"

#### Step 6: Verify Upgrade
Run this command to verify:
```powershell
az account show --query "{Name:name, State:state, Type:user.type}" --output table
```

You should see your subscription is still "Enabled" and type is "user"

---

### Method 2: Azure CLI (Alternative)

```powershell
# Check current subscription
az account show --output table

# Note: Upgrade cannot be done via CLI
# You must use Azure Portal method above
```

---

## ✅ Post-Upgrade Steps

### 1. Verify Quota Increase

Check if App Service quota is now available:

```powershell
az vm list-usage --location eastus2 --query "[?contains(localName, 'Standard')]" --output table
```

### 2. Deploy Your API

You now have 3 deployment options:

#### Option A: Azure Container Instances (CHEAPEST - ~$1.50/month)

```powershell
# Create Container Registry
.\create-container-registry.ps1

# Build and push Docker image
.\deploy-container.ps1

# Create Container Instance
.\create-container-instance.ps1
```

#### Option B: App Service Free Tier (FREE)

```powershell
.\create-app-service-free.ps1
.\deploy-api.ps1
```

#### Option C: App Service Basic Tier (~$13/month)

```powershell
.\create-app-service.ps1
.\deploy-api.ps1
```

---

## 💡 Cost Management Tips

### Set Up Budget Alerts

1. Go to Azure Portal → Cost Management + Billing
2. Click "Budgets"
3. Create a new budget:
   - Budget amount: $20/month (or your preference)
   - Alert threshold: 80% ($16)
   - Email notification to your email

### Monitor Spending

```powershell
# Check current month's cost
az consumption usage list --query "[].{Date:usageStart, Cost:pretaxCost, Service:meterName}" --output table

# Or view in portal
# https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/overview
```

### Cost Optimization

**For Azure Container Instances:**
- **Stop when not in use:** Save 100% of costs
  ```powershell
  az container stop --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
  az container start --name he-api-dev-eus2 --resource-group he-rg-apps-dev-eus2
  ```

**For App Service:**
- **Use Free (F1) tier** for development
- **Scale down when not needed:**
  ```powershell
  az appservice plan update --name he-api-dev-plan --resource-group he-rg-apps-dev-eus2 --sku F1
  ```

---

## 🔄 What Happens to Free Trial Credits?

**Good News:**
- Your remaining Free Trial credits ($200) are **NOT lost**
- Credits remain available for 30 days from signup date
- After credits expire, you transition to Pay-As-You-Go pricing

**Check remaining credits:**
```powershell
# Via Portal
# Go to: https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade
# Click your subscription → Overview → Credits remaining
```

---

## ❓ Common Questions

### Q: Will I be charged immediately?
**A:** No. You're only charged for resources you create and use. If you do nothing, cost is $0.

### Q: Can I go back to Free Trial?
**A:** No. Once upgraded, you cannot downgrade back to Free Trial. However, you can continue using free tier services (F1 App Service, shared databases, etc.).

### Q: What if I don't want to upgrade?
**A:** You have alternatives:
1. Request quota increase (1-3 day wait) - see DEPLOYMENT_OPTIONS.md
2. Use a different Azure subscription (work, school, etc.)
3. Wait until your Free Trial naturally expires and auto-converts

### Q: How do I cancel if I change my mind?
**A:**
1. Delete all resources first
2. Go to Subscriptions → Select subscription → Cancel subscription
3. Follow prompts

---

## 🛡️ Safety Measures

### Before Upgrading:

1. **Set up billing alerts** (see above)
2. **Understand costs** for services you'll use
3. **Review payment method** on file

### After Upgrading:

1. **Monitor costs daily** for the first week
2. **Set budget limits** in Azure Cost Management
3. **Use Free/Basic tiers** initially
4. **Delete unused resources** immediately

---

## 📞 Need Help?

### Azure Support
- Portal: https://portal.azure.com → Help + Support
- Phone: 1-800-867-1389 (US)
- Docs: https://docs.microsoft.com/azure/cost-management-billing/manage/upgrade-azure-subscription

### Billing Questions
- Portal: https://portal.azure.com → Cost Management + Billing → Support

---

## 🚀 Recommended Path for HealthExtent API

Based on your needs, I recommend:

### Phase 1: Development (Now)
**Use:** Azure Container Instances
**Cost:** ~$1.50/month (1 hour/day) or ~$6.50/month (4 hours/day)
**Why:** Cheapest option, full control, stop when not using

```powershell
# Upgrade subscription first, then:
.\create-container-registry.ps1
.\deploy-container.ps1
.\create-container-instance.ps1
```

### Phase 2: Testing/Staging
**Use:** App Service Basic (B1)
**Cost:** ~$13/month
**Why:** Always-on, easier management, good for demos

```powershell
.\create-app-service.ps1
.\deploy-api.ps1
```

### Phase 3: Production
**Use:** App Service Standard (S1) + Azure SQL
**Cost:** ~$100-150/month
**Why:** Auto-scaling, deployment slots, backups, monitoring

```powershell
# Upgrade App Service Plan
az appservice plan update --name he-api-dev-plan --resource-group he-rg-apps-dev-eus2 --sku S1
```

---

## ✅ Checklist Before Upgrading

- [ ] Read this entire guide
- [ ] Understand Pay-As-You-Go pricing model
- [ ] Verify payment method on file
- [ ] Plan to set up budget alerts immediately after
- [ ] Choose deployment option (Container Instances recommended)
- [ ] Know how to stop/delete resources to save costs
- [ ] Have scripts ready to deploy (all created ✅)

---

**Ready to upgrade?** → Go to https://portal.azure.com → Subscriptions → Upgrade

**Last Updated:** 2025-10-29
**Status:** Upgrade required to proceed with deployment
