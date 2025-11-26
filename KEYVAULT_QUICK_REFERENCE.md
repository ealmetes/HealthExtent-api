# Azure Key Vault - Quick Reference

## 🚀 Setup (One Time)

```powershell
# Run setup script
.\setup-keyvault.ps1
```

## 🔑 Common Commands

### View Secrets
```bash
az keyvault secret list --vault-name he-kv-dev-eus2 --output table
```

### Get Secret Value
```bash
az keyvault secret show --vault-name he-kv-dev-eus2 --name JwtSecretKey --query value -o tsv
```

### Update Secret
```bash
az keyvault secret set --vault-name he-kv-dev-eus2 --name JwtSecretKey --value "new-value"
```

## 🏢 Production Setup

### 1. Enable Managed Identity
```bash
az webapp identity assign --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2
```

### 2. Grant Access
```bash
$appIdentity = az webapp identity show --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2 | ConvertFrom-Json
az keyvault set-policy --name he-kv-prod-eus2 --object-id $appIdentity.principalId --secret-permissions get list
```

### 3. Set Environment Variable
```bash
az webapp config appsettings set --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2 \
  --settings KeyVaultUri=https://he-kv-prod-eus2.vault.azure.net/
```

## 🧪 Local Testing

```powershell
$env:KeyVaultUri="https://he-kv-dev-eus2.vault.azure.net/"
$env:ASPNETCORE_ENVIRONMENT="Production"
cd api/HealthExtent.Api
dotnet run
```

## 🔄 Restart API After Secret Change

```bash
az webapp restart --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2
```

## 📊 Check Configuration

```bash
# View app settings
az webapp config appsettings list --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2

# Check managed identity
az webapp identity show --name he-api-prod-eus2 --resource-group he-rg-apps-prod-eus2
```

## 🔐 Secret Names → Configuration Keys

| Key Vault Secret | Maps To |
|------------------|---------|
| `JwtSecretKey` | `Jwt:SecretKey` |
| `JwtIssuer` | `Jwt:Issuer` |
| `JwtAudience` | `Jwt:Audience` |
| `HealthExtentDbConnectionString` | `ConnectionStrings:HealthExtentDb` |

---

**Full Documentation:** See `AZURE_KEY_VAULT_SETUP.md`
