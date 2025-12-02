using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HealthExtent.Api.DTOs;
using HealthExtent.Api.Services;

namespace HealthExtent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ContactController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(IEmailService emailService, ILogger<ContactController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Submit a contact form
    /// </summary>
    /// <remarks>
    /// Sends the contact form information to the specified recipient email.
    ///
    /// Example request:
    ///
    ///     POST /api/contact/submit
    ///     {
    ///         "name": "John Doe",
    ///         "email": "john@example.com",
    ///         "organization": "Healthcare Inc",
    ///         "phone": "(555) 123-4567",
    ///         "subject": "sales",
    ///         "message": "I'm interested in learning more about HealthExtent.",
    ///         "recipientEmail": "edwin@healthextent.co"
    ///     }
    ///
    /// </remarks>
    [AllowAnonymous]
    [HttpPost("submit")]
    [ProducesResponseType(typeof(ContactFormResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SubmitContactForm([FromBody] ContactFormRequest request)
    {
        _logger.LogInformation("Contact form submission received from: {Email}", request.Email);

        // Validate required fields
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new ContactFormResponse
            {
                Success = false,
                Message = "Name is required"
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new ContactFormResponse
            {
                Success = false,
                Message = "Email is required"
            });
        }

        if (string.IsNullOrWhiteSpace(request.Subject))
        {
            return BadRequest(new ContactFormResponse
            {
                Success = false,
                Message = "Subject is required"
            });
        }

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new ContactFormResponse
            {
                Success = false,
                Message = "Message is required"
            });
        }

        try
        {
            var success = await _emailService.SendContactFormEmailAsync(request);

            if (success)
            {
                return Ok(new ContactFormResponse
                {
                    Success = true,
                    Message = "Contact form submitted successfully"
                });
            }
            else
            {
                return StatusCode(500, new ContactFormResponse
                {
                    Success = false,
                    Message = "Failed to send email. Please try again later."
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing contact form submission from {Email}", request.Email);
            return StatusCode(500, new ContactFormResponse
            {
                Success = false,
                Message = "An error occurred while processing your request"
            });
        }
    }
}
