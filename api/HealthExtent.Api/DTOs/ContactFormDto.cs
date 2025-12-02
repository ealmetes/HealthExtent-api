namespace HealthExtent.Api.DTOs;

public class ContactFormRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = "ealmetes@gmail.com";
}

public class ContactFormResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
}
