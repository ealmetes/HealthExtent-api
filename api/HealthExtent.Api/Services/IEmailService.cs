using HealthExtent.Api.DTOs;

namespace HealthExtent.Api.Services;

public interface IEmailService
{
    Task<bool> SendContactFormEmailAsync(ContactFormRequest request);
}
