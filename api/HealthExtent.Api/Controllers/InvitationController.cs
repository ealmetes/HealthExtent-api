using Microsoft.AspNetCore.Mvc;
using HealthExtent.Api.DTOs;
using HealthExtent.Api.Services;

namespace HealthExtent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvitationController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<InvitationController> _logger;

    public InvitationController(IEmailService emailService, ILogger<InvitationController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost("send")]
    public async Task<ActionResult<InvitationResponse>> SendInvitation([FromBody] InvitationRequest request)
    {
        try
        {
            _logger.LogInformation("Processing invitation request for {Email}", request.Email);

            // Validate request
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new InvitationResponse
                {
                    Success = false,
                    Message = "Email address is required"
                });
            }

            if (string.IsNullOrEmpty(request.InviterName))
            {
                return BadRequest(new InvitationResponse
                {
                    Success = false,
                    Message = "Inviter name is required"
                });
            }

            if (string.IsNullOrEmpty(request.OrganizationName))
            {
                return BadRequest(new InvitationResponse
                {
                    Success = false,
                    Message = "Organization name is required"
                });
            }

            // Send invitation email
            var success = await _emailService.SendInvitationEmailAsync(request);

            if (success)
            {
                return Ok(new InvitationResponse
                {
                    Success = true,
                    Message = $"Invitation sent successfully to {request.Email}"
                });
            }
            else
            {
                return StatusCode(500, new InvitationResponse
                {
                    Success = false,
                    Message = "Failed to send invitation email. Please try again later."
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending invitation to {Email}", request.Email);
            return StatusCode(500, new InvitationResponse
            {
                Success = false,
                Message = "An error occurred while sending the invitation"
            });
        }
    }
}
