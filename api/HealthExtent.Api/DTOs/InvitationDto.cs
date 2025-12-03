namespace HealthExtent.Api.DTOs;

public class InvitationRequest
{
    public string Email { get; set; } = string.Empty;
    public string InviterName { get; set; } = string.Empty;
    public string OrganizationName { get; set; } = string.Empty;
    public string Role { get; set; } = "Member";
    public string InviteUrl { get; set; } = "https://healthextent.ai/login";
}

public class InvitationResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
}
