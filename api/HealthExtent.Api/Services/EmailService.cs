using Azure;
using Azure.Communication.Email;
using HealthExtent.Api.DTOs;

namespace HealthExtent.Api.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendContactFormEmailAsync(ContactFormRequest request)
    {
        // DIAGNOSTIC: Log at ERROR level to ensure visibility in production
        _logger.LogError("=== EMAIL SERVICE DIAGNOSTIC START ===");
        _logger.LogError("Contact form submission received from {Email} to {RecipientEmail}", request.Email, request.RecipientEmail);

        try
        {
            var connectionString = _configuration["AzureCommunicationServices:ConnectionString"];
            var fromEmail = _configuration["AzureCommunicationServices:FromEmail"] ?? "DoNotReply@healthextent.ai";

            // DIAGNOSTIC: Log connection string status (not the actual string for security)
            _logger.LogError("Connection string is {Status}", string.IsNullOrEmpty(connectionString) ? "EMPTY/NULL" : $"LOADED ({connectionString.Length} chars)");
            _logger.LogError("From email: {FromEmail}", fromEmail);

            // Validate Azure Communication Services configuration
            if (string.IsNullOrEmpty(connectionString))
            {
                _logger.LogError("CRITICAL: Azure Communication Services connection string is not configured. Email will NOT be sent.");
                _logger.LogWarning("Azure Communication Services connection string is not configured. Email will not be sent.");
                // In development, just log the contact form details
                _logger.LogInformation("Contact Form Submission (not sent):");
                _logger.LogInformation("  From: {Name} <{Email}>", request.Name, request.Email);
                _logger.LogInformation("  Subject: {Subject}", request.Subject);
                _logger.LogInformation("  Organization: {Organization}", request.Organization);
                _logger.LogInformation("  Phone: {Phone}", request.Phone);
                _logger.LogInformation("  Message: {Message}", request.Message);
                _logger.LogInformation("  Recipient: {RecipientEmail}", request.RecipientEmail);
                return true; // Return true to avoid blocking in development
            }

            _logger.LogError("Connection string validated, proceeding to send email...");

            var emailClient = new EmailClient(connectionString);

            var emailContent = new EmailContent(subject: $"Contact Form: {request.Subject}")
            {
                Html = BuildEmailBody(request),
                PlainText = BuildPlainTextBody(request)
            };

            var emailMessage = new EmailMessage(
                senderAddress: fromEmail,
                recipientAddress: request.RecipientEmail,
                content: emailContent)
            {
                Headers =
                {
                    { "X-Priority", "3" },
                    { "X-Mailer", "HealthExtent Contact Form" }
                }
            };

            // Add reply-to header with display name
            emailMessage.ReplyTo.Add(new EmailAddress(request.Email, $"{request.Name} via HealthExtent"));

            _logger.LogInformation("Sending contact form email via Azure Communication Services to {RecipientEmail}", request.RecipientEmail);

            EmailSendOperation emailSendOperation = await emailClient.SendAsync(
                WaitUntil.Started,
                emailMessage);

            _logger.LogInformation("Contact form email sent successfully. Message ID: {MessageId}, Status: {Status}",
                emailSendOperation.Id, emailSendOperation.HasCompleted ? "Completed" : "In Progress");

            _logger.LogError("=== EMAIL SERVICE SUCCESS: Message sent with ID {MessageId} ===", emailSendOperation.Id);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "=== EMAIL SERVICE FAILED: Exception occurred ===");
            _logger.LogError(ex, "Failed to send contact form email to {RecipientEmail}", request.RecipientEmail);
            return false;
        }
    }

    private string BuildPlainTextBody(ContactFormRequest request)
    {
        var body = $@"NEW CONTACT FORM SUBMISSION

From: {request.Name} ({request.Email})
Subject: {request.Subject}";

        if (!string.IsNullOrEmpty(request.Organization))
        {
            body += $"\nOrganization: {request.Organization}";
        }

        if (!string.IsNullOrEmpty(request.Phone))
        {
            body += $"\nPhone: {request.Phone}";
        }

        body += $@"

Message:
{request.Message}

---
This message was sent via the HealthExtent contact form at healthextent.ai
Reply directly to this email to respond to {request.Name}";

        return body;
    }

    private string BuildEmailBody(ContactFormRequest request)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }}
        .content {{ background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }}
        .field {{ margin-bottom: 15px; }}
        .label {{ font-weight: bold; color: #667eea; }}
        .value {{ margin-top: 5px; padding: 10px; background: white; border-radius: 3px; }}
        .footer {{ margin-top: 20px; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h2 style=""margin: 0;"">New Contact Form Submission</h2>
        </div>
        <div class=""content"">
            <div class=""field"">
                <div class=""label"">From:</div>
                <div class=""value"">{request.Name} ({request.Email})</div>
            </div>
            <div class=""field"">
                <div class=""label"">Subject:</div>
                <div class=""value"">{request.Subject}</div>
            </div>
            {(string.IsNullOrEmpty(request.Organization) ? "" : $@"
            <div class=""field"">
                <div class=""label"">Organization:</div>
                <div class=""value"">{request.Organization}</div>
            </div>")}
            {(string.IsNullOrEmpty(request.Phone) ? "" : $@"
            <div class=""field"">
                <div class=""label"">Phone:</div>
                <div class=""value"">{request.Phone}</div>
            </div>")}
            <div class=""field"">
                <div class=""label"">Message:</div>
                <div class=""value"">{request.Message.Replace("\n", "<br>")}</div>
            </div>
        </div>
        <div class=""footer"">
            <p>This message was sent via the HealthExtent contact form at healthextent.ai</p>
            <p>Reply directly to this email to respond to {request.Name}</p>
        </div>
    </div>
</body>
</html>";
    }

    public async Task<bool> SendInvitationEmailAsync(InvitationRequest request)
    {
        _logger.LogInformation("Sending invitation email to {Email}", request.Email);

        try
        {
            var connectionString = _configuration["AzureCommunicationServices:ConnectionString"];
            var fromEmail = _configuration["AzureCommunicationServices:FromEmail"] ?? "DoNotReply@healthextent.ai";

            if (string.IsNullOrEmpty(connectionString))
            {
                _logger.LogWarning("Azure Communication Services connection string is not configured.");
                _logger.LogInformation("Invitation Email to: {Email}, From: {InviterName}, Org: {Org}, Role: {Role}",
                    request.Email, request.InviterName, request.OrganizationName, request.Role);
                return true;
            }

            var emailClient = new EmailClient(connectionString);

            var emailContent = new EmailContent(subject: $"{request.InviterName} invited you to join {request.OrganizationName}")
            {
                Html = BuildInvitationEmailBody(request),
                PlainText = BuildInvitationPlainTextBody(request)
            };

            var emailMessage = new EmailMessage(
                senderAddress: fromEmail,
                recipientAddress: request.Email,
                content: emailContent);

            _logger.LogInformation("Sending invitation email via Azure Communication Services to {Email}", request.Email);

            EmailSendOperation emailSendOperation = await emailClient.SendAsync(WaitUntil.Started, emailMessage);

            _logger.LogInformation("Invitation email sent. Message ID: {MessageId}", emailSendOperation.Id);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send invitation email to {Email}", request.Email);
            return false;
        }
    }

    private string BuildInvitationPlainTextBody(InvitationRequest request)
    {
        var year = DateTime.Now.Year;
        return $"You've been invited to join {request.OrganizationName}!\n\n" +
               $"{request.InviterName} has invited you to join their team on HealthExtent as a {request.Role}.\n\n" +
               "To accept this invitation and get started:\n" +
               "1. Click the link below to sign in or create an account\n" +
               $"2. You'll automatically be added to {request.OrganizationName}\n\n" +
               $"{request.InviteUrl}\n\n" +
               "About HealthExtent:\n" +
               "HealthExtent is a comprehensive transitional care management platform designed for healthcare providers, ACOs, and MCOs.\n\n" +
               $"If you have any questions, please contact {request.InviterName} or visit healthextent.ai for support.\n\n" +
               "---\n" +
               $"This invitation was sent by {request.InviterName} via HealthExtent\n" +
               $"© {year} HealthExtent. All rights reserved.";
    }

    private string BuildInvitationEmailBody(InvitationRequest request)
    {
        var year = DateTime.Now.Year;
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style='font-family: Arial, sans-serif; background-color: #0A0A0A; color: #E0E0E0; margin: 0; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #6200EA 0%, #3D5AFE 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;'>
            <h1 style='margin: 0; font-size: 28px;'>You're Invited!</h1>
        </div>
        <div style='background: #1E1E1E; padding: 40px 30px; border: 1px solid #2A2A2A;'>
            <p><strong>{request.InviterName}</strong> has invited you to join <strong>{request.OrganizationName}</strong> on HealthExtent.</p>

            <div style='background: #242832; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6200EA;'>
                <p style='margin: 0;'><strong style='color: #6200EA;'>Organization:</strong> {request.OrganizationName}</p>
                <p style='margin: 10px 0 0 0;'><strong style='color: #6200EA;'>Your Role:</strong> {request.Role}</p>
            </div>

            <div style='text-align: center; margin: 30px 0;'>
                <a href='{request.InviteUrl}' style='display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6200EA 0%, #3D5AFE 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;'>Accept Invitation</a>
            </div>

            <p style='color: #888888;'>To accept this invitation:</p>
            <ol style='color: #888888;'>
                <li>Click the button above to sign in or create an account</li>
                <li>You'll automatically be added to {request.OrganizationName}</li>
                <li>Start collaborating with your team!</li>
            </ol>
        </div>
        <div style='padding: 20px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #2A2A2A;'>
            <p>If you have questions, please contact {request.InviterName}.</p>
            <p>Or visit <a href='https://healthextent.ai' style='color: #6200EA;'>healthextent.ai</a> for support.</p>
            <p>© {year} HealthExtent. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
    }
}

