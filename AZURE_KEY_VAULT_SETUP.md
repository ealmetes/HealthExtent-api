# Azure Key Vault Setup Guide - HealthExtent API

## Overview

This guide walks you through setting up Azure Key Vault to securely store and manage secrets for the HealthExtent API in production.

**Benefits of Azure Key Vault:**
- ✅ Centralized secret management
- ✅ Automatic secret rotation
- ✅ Access auditing and monitoring
- ✅ Integration with Azure services
- ✅ No secrets in code or configuration files
- ✅ Managed Identity support (no passwords needed)

---

## 🚀 Quick Start

### Step 1: Run the Setup Script

```powershell
cd C:\Users\Edwin Almetes\Projects\healthextent
.\setup-keyvault.ps1
```

**What this script does:**
1. Creates an Azure Key Vault
2. Generates a secure 256-bit JWT secret key
3. Stores JWT configuration (Issuer, Audience, Secret)
4. Prompts for and stores database connection string
5. Configures access policies

**Default configuration:**
- Key Vault Name: `he-kv-dev-eus2`
- Resource Group: `he-rg-data-dev-eus2`
- Location: `eastus2`

### Step 2: Verify Installation

Check that secrets were created:

```powershell
az keyvault secret list --vault-name he-kv-dev-eus2 --output table
```

You should see:
- `JwtSecretKey`
- `JwtIssuer`
- `JwtAudience`
- `HealthExtentDbConnectionString` (if provided)

### Step 3: Test Locally (Optional)

Test Key Vault access from your machine:

```powershell
# Set environment variable
$env:KeyVaultUri="https://he-kv-dev-eus2.vault.azure.net/"
$env:ASPNETCORE_ENVIRONMENT="Production"

# Run API
cd api/HealthExtent.Api
dotnet run
```

The API will load secrets from Key Vault instead of appsettings.json.

---

## 📦 What Was Installed

### NuGet Packages Added

```xml
<PackageReference Include="Azure.Identity" Version="1.17.0" />
<PackageReference Include="Azure.Extensions.AspNetCore.Configuration.Secrets" Version="1.4.0" />
```

### Code Changes in Program.cs

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Extensions.AspNetCore.Configuration.Secrets;

// Azure Key Vault Configuration (Production only)
if (!builder.Environment.IsDevelopment())
{
    var keyVaultUri = builder.Configuration["KeyVaultUri"];

    if (!string.IsNullOrEmpty(keyVaultUri))
    {
        var secretClient = new SecretClient(
            new Uri(keyVaultUri),
            new DefaultAzureCredential());

        builder.Configuration.AddAzureKeyVault(secretClient, new KeyVaultSecretManager());
    }
}
```

**Key Points:**
- Only loads Key Vault in Production (not Development)
- Uses `DefaultAzureCredential` for authentication
- Automatically maps Key Vault secrets to configuration

---

## 🔐 Secret Naming Convention

Key Vault secrets automatically map to configuration keys:

| Key Vault Secret | Configuration Key | Usage |
|------------------|-------------------|-------|
| `JwtSecretKey` | `Jwt:SecretKey` | JWT signing key |
| `JwtIssuer` | `Jwt:Issuer` | JWT issuer |
| `JwtAudience` | `Jwt:Audience` | JWT audience |
| `HealthExtentDbConnectionString` | `ConnectionStrings:HealthExtentDb` | Database connection |

**Naming Rules:**
- Double hyphens (`--`) become colons (`:`) in configuration
- Example: `Jwt--SecretKey` → `Jwt:SecretKey`
- Recommended: Use simple names without special characters

---

## 🏢 Production Deployment

### Option 1: Azure App Service with Managed Identity (Recommended)

#### Step 1: Enable Managed Identity

```bash
az webapp identity assign \
  --name he-api-prod-eus2 \
  --resource-group he-rg-apps-prod-eus2
```

Save the `principalId` from the output.

#### Step 2: Grant Access to Key Vault

```bash
# Get the principal ID
$appIdentity = az webapp identity show \
  --name he-api-prod-eus2 \
  --resource-group he-rg-apps-prod-eus2 | ConvertFrom-Json

# Grant access to Key Vault
az keyvault set-policy \
  --name he-kv-prod-eus2 \
  --object-id $appIdentity.principalId \
  --secret-permissions get list
```

#### Step 3: Configure App Service Settings

```bash
az webapp config appsettings set \
  --name he-api-prod-eus2 \
  --resource-group he-rg-apps-prod-eus2 \
  --settings \
    ASPNETCORE_ENVIRONMENT=Production \
    KeyVaultUri=https://he-kv-prod-eus2.vault.azure.net/
```

**That's it!** The API will now:
1. Authenticate using Managed Identity (no credentials needed)
2. Load secrets from Key Vault automatically
3. Use those secrets for JWT and database connections

---

### Option 2: Azure Container Apps with Managed Identity

#### Step 1: Enable Managed Identity

```bash
az containerapp identity assign \
  --name he-api-prod \
  --resource-group he-rg-apps-prod-eus2
```

#### Step 2: Grant Access to Key Vault

```bash
# Get the principal ID
$appIdentity = az containerapp identity show \
  --name he-api-prod \
  --resource-group he-rg-apps-prod-eus2 | ConvertFrom-Json

# Grant access
az keyvault set-policy \
  --name he-kv-prod-eus2 \
  --object-id $appIdentity.principalId \
  --secret-permissions get list
```

#### Step 3: Set Environment Variables

```bash
az containerapp update \
  --name he-api-prod \
  --resource-group he-rg-apps-prod-eus2 \
  --set-env-vars \
    ASPNETCORE_ENVIRONMENT=Production \
    KeyVaultUri=https://he-kv-prod-eus2.vault.azure.net/
```

---

### Option 3: Local Development with Azure CLI

For local testing with Key Vault:

```bash
# Login to Azure
az login

# Set environment variables
$env:KeyVaultUri="https://he-kv-dev-eus2.vault.azure.net/"
$env:ASPNETCORE_ENVIRONMENT="Production"

# Run API
cd api/HealthExtent.Api
dotnet run
```

`DefaultAzureCredential` will use your Azure CLI login.

---

## 🔑 Managing Secrets

### View All Secrets

```powershell
az keyvault secret list --vault-name he-kv-dev-eus2 --output table
```

### Get a Secret Value

```powershell
az keyvault secret show --vault-name he-kv-dev-eus2 --name JwtSecretKey --query value -o tsv
```

### Update a Secret

```powershell
az keyvault secret set \
  --vault-name he-kv-dev-eus2 \
  --name JwtSecretKey \
  --value "new-secret-value"
```

### Delete a Secret

```powershell
az keyvault secret delete --vault-name he-kv-dev-eus2 --name SecretName
```

### Add a New Secret

```powershell
az keyvault secret set \
  --vault-name he-kv-dev-eus2 \
  --name NewSecretName \
  --value "secret-value"
```

---

## 🔄 Secret Rotation

### Automatic Rotation (Azure Managed)

Azure Key Vault supports automatic secret rotation for:
- Storage account keys
- SQL connection strings
- Function keys

**To enable:**
1. Go to Azure Portal → Key Vault
2. Select the secret
3. Click "Rotation policy"
4. Configure rotation settings

### Manual Rotation

```powershell
# Generate new JWT secret
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$newSecret = [Convert]::ToBase64String($bytes)

# Update in Key Vault
az keyvault secret set \
  --vault-name he-kv-prod-eus2 \
  --name JwtSecretKey \
  --value $newSecret

# Restart API to pick up new secret
az webapp restart --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2
```

---

## 🔒 Access Control

### Grant User Access

```bash
# Get user object ID
$user = az ad user show --id user@domain.com | ConvertFrom-Json

# Grant access
az keyvault set-policy \
  --name he-kv-dev-eus2 \
  --object-id $user.id \
  --secret-permissions get list
```

### Grant Service Principal Access

```bash
# Get service principal object ID
$sp = az ad sp show --id <app-id> | ConvertFrom-Json

# Grant access
az keyvault set-policy \
  --name he-kv-dev-eus2 \
  --object-id $sp.id \
  --secret-permissions get list set delete
```

### Revoke Access

```bash
az keyvault delete-policy \
  --name he-kv-dev-eus2 \
  --object-id <object-id>
```

---

## 📊 Monitoring & Auditing

### Enable Diagnostic Logs

```bash
# Create Log Analytics workspace (if not exists)
az monitor log-analytics workspace create \
  --resource-group he-rg-data-dev-eus2 \
  --workspace-name he-log-dev-01

# Get workspace ID
$workspaceId = az monitor log-analytics workspace show \
  --resource-group he-rg-data-dev-eus2 \
  --workspace-name he-log-dev-01 \
  --query id -o tsv

# Enable diagnostics
az monitor diagnostic-settings create \
  --name KeyVaultDiagnostics \
  --resource /subscriptions/<sub-id>/resourceGroups/he-rg-data-dev-eus2/providers/Microsoft.KeyVault/vaults/he-kv-dev-eus2 \
  --workspace $workspaceId \
  --logs '[{"category": "AuditEvent", "enabled": true}]' \
  --metrics '[{"category": "AllMetrics", "enabled": true}]'
```

### View Audit Logs

```bash
# Query Key Vault access logs
az monitor log-analytics query \
  --workspace <workspace-id> \
  --analytics-query "AzureDiagnostics | where ResourceProvider == 'MICROSOFT.KEYVAULT' | top 100 by TimeGenerated desc"
```

### Set Up Alerts

```bash
# Alert when secret is accessed
az monitor metrics alert create \
  --name SecretAccessAlert \
  --resource-group he-rg-data-dev-eus2 \
  --scopes /subscriptions/<sub-id>/resourceGroups/he-rg-data-dev-eus2/providers/Microsoft.KeyVault/vaults/he-kv-dev-eus2 \
  --condition "total ServiceApiHit > 100" \
  --window-size 5m \
  --evaluation-frequency 1m
```

---

## 🛠️ Troubleshooting

### Error: "The user, group or application does not have secrets list permission"

**Solution:**
```bash
# Grant yourself list permission
az keyvault set-policy \
  --name he-kv-dev-eus2 \
  --upn your-email@domain.com \
  --secret-permissions get list
```

### Error: "DefaultAzureCredential failed to retrieve a token"

**Possible causes:**
1. Not logged in to Azure CLI → Run `az login`
2. Managed Identity not configured → Enable managed identity
3. No access policy → Grant access to Key Vault

**Debug:**
```bash
# Check current login
az account show

# Test Key Vault access
az keyvault secret list --vault-name he-kv-dev-eus2
```

### API Not Loading Secrets

**Check:**
1. `KeyVaultUri` environment variable is set
2. `ASPNETCORE_ENVIRONMENT` is set to `Production`
3. Managed Identity has access to Key Vault
4. Secrets exist in Key Vault

**Test:**
```bash
# Check environment variables in App Service
az webapp config appsettings list \
  --name he-api-prod-eus2 \
  --resource-group he-rg-apps-prod-eus2

# Check managed identity
az webapp identity show \
  --name he-api-prod-eus2 \
  --resource-group he-rg-apps-prod-eus2
```

### Secrets Not Updating

**Cause:** API caches configuration on startup.

**Solution:** Restart the API
```bash
az webapp restart --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2
```

---

## 📋 Production Checklist

Before deploying to production:

- [ ] Key Vault created with production name (`he-kv-prod-eus2`)
- [ ] JWT secret generated and stored
- [ ] Database connection string stored
- [ ] Managed Identity enabled for App Service/Container App
- [ ] Access policy configured for managed identity
- [ ] `KeyVaultUri` environment variable set
- [ ] `ASPNETCORE_ENVIRONMENT` set to `Production`
- [ ] Diagnostic logs enabled
- [ ] Access alerts configured
- [ ] Secret rotation policy defined
- [ ] Backup plan for secrets
- [ ] Access control reviewed

---

## 🔐 Security Best Practices

1. **Use Managed Identity** - Never use connection strings or service principal secrets
2. **Principle of Least Privilege** - Only grant `get` and `list` permissions to apps
3. **Enable Soft Delete** - Prevents accidental secret deletion
4. **Enable Purge Protection** - Prevents permanent deletion
5. **Regular Rotation** - Rotate secrets every 90 days
6. **Monitor Access** - Set up alerts for unusual access patterns
7. **Separate Environments** - Use different Key Vaults for dev, staging, prod
8. **Backup Secrets** - Export secrets to secure storage periodically

---

## 📚 Additional Resources

- [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
- [Managed Identity Overview](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)
- [DefaultAzureCredential](https://docs.microsoft.com/dotnet/api/azure.identity.defaultazurecredential)
- [Key Vault Best Practices](https://docs.microsoft.com/azure/key-vault/general/best-practices)

---

## 🎯 Summary

**You've successfully configured:**
✅ Azure Key Vault for secret management
✅ Automatic secret loading in production
✅ Managed Identity authentication
✅ Secure JWT and database secrets

**Your secrets are now:**
- Centrally managed in Azure
- Automatically loaded at runtime
- Protected with Azure AD authentication
- Audited and monitored
- Never stored in code or config files

**Next steps:**
1. Run `.\setup-keyvault.ps1` to create Key Vault
2. Deploy API to Azure
3. Enable Managed Identity
4. Test secret access in production

---

**Last Updated:** 2025-10-29
**Status:** Ready for Production ✅
