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
        try
        {
            var connectionString = _configuration["AzureCommunicationServices:ConnectionString"];
            var fromEmail = _configuration["AzureCommunicationServices:FromEmail"] ?? "DoNotReply@healthextent.ai";

            // Validate Azure Communication Services configuration
            if (string.IsNullOrEmpty(connectionString))
            {
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

            return true;
        }
        catch (Exception ex)
        {
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
}
