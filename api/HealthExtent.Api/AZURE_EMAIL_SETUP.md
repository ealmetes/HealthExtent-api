# Azure Communication Services Email Setup

The contact form now uses **Azure Communication Services** for email delivery instead of SMTP.

## Configuration Steps

### 1. Get Connection String from Azure Portal

1. Navigate to Azure Portal: https://portal.azure.com
2. Go to your subscription: `89c2ca56-e927-45c2-9bb0-27664b631120`
3. Find the **HEmailling** Communication Services resource
4. Click on **Settings** → **Keys** in the left menu
5. Copy the **Connection string** (Primary or Secondary)

### 2. Configure the API

Add the connection string to your `appsettings.Development.json` or `appsettings.Production.json`:

```json
{
  "AzureCommunicationServices": {
    "ConnectionString": "endpoint=https://hemailing.communication.azure.com/;accesskey=YOUR_ACCESS_KEY_HERE",
    "FromEmail": "DoNotReply@healthextent.ai"
  }
}
```

**Important Notes:**
- The `FromEmail` must be a verified sender address in your Azure Communication Services Email domain
- Default is set to `DoNotReply@healthextent.ai`
- The connection string should be kept secure and never committed to source control
- Consider using Azure Key Vault or User Secrets for production

### 3. Verify Email Domain

Ensure that `healthextent.ai` is configured as a verified domain in your Azure Communication Services Email resource:

1. In Azure Portal, go to your Communication Services resource
2. Navigate to **Email** → **Domains**
3. Verify that your domain is listed and verified
4. Ensure the sender address (`DoNotReply@healthextent.ai`) is allowed

### 4. Using Azure CLI (Alternative)

To get the connection string via Azure CLI:

```bash
# Login to Azure
az login

# Get the connection string
az communication show-connection-string --name HEmailling --resource-group emailling_group
```

### 5. Test the Configuration

Once configured, the contact form at http://localhost:3000/contact will send emails to `ealmetes@gmail.com` using Azure Communication Services.

The API logs will show:
- In development without connection string: Contact form details logged to console
- With connection string: Email sent via Azure Communication Services with message ID

### 6. NuGet Package

The following package has been added to the project:
- `Azure.Communication.Email` (Version 1.0.1)

This package provides the `EmailClient` used to send emails through Azure Communication Services.

## Troubleshooting

### Email not received
- Verify the connection string is correct
- Check that the sender domain is verified in Azure
- Ensure the `FromEmail` address is allowed for your domain
- Check Azure Communication Services logs in the portal

### Configuration not loading
- Verify the JSON syntax in appsettings files
- Check that the file is being loaded (Development vs Production)
- Review API logs for configuration warnings

### Connection issues
- Verify network connectivity to `*.communication.azure.com`
- Check firewall rules if applicable
- Ensure the access key in the connection string is valid
