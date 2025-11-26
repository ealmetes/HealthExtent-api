using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HealthExtent.Api.DTOs;
using HealthExtent.Api.Services;
using FluentValidation;

namespace HealthExtent.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProvidersController : ControllerBase
{
    private readonly IHealthExtentService _service;
    private readonly ILogger<ProvidersController> _logger;
    private readonly IValidator<UpsertProviderRequest> _validator;

    public ProvidersController(
        IHealthExtentService service,
        ILogger<ProvidersController> logger,
        IValidator<UpsertProviderRequest> validator)
    {
        _service = service;
        _logger = logger;
        _validator = validator;
    }

    /// <summary>
    /// Upsert (create or update) a provider by NPI
    /// </summary>
    [HttpPost("upsert")]
    [ProducesResponseType(typeof(UpsertProviderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UpsertProviderResponse>> UpsertProvider([FromBody] UpsertProviderRequest request)
    {
        var validationResult = await _validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        var result = await _service.UpsertProviderAsync(request);

        if (result.Success == 0)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Get provider by key
    /// </summary>
    [HttpGet("{providerKey}")]
    [ProducesResponseType(typeof(ProviderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProviderDto>> GetProvider(long providerKey, [FromQuery] string tenantKey)
    {
        var provider = await _service.GetProviderByKeyAsync(providerKey, tenantKey);

        if (provider == null)
            return NotFound();

        return Ok(provider);
    }

    /// <summary>
    /// Get provider by NPI
    /// </summary>
    [HttpGet("npi/{npi}")]
    [ProducesResponseType(typeof(ProviderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProviderDto>> GetProviderByNPI(string npi, [FromQuery] string tenantKey)
    {
        var provider = await _service.GetProviderByNPIAsync(npi, tenantKey);

        if (provider == null)
            return NotFound();

        return Ok(provider);
    }

    /// <summary>
    /// Get all providers for a tenant with pagination
    /// </summary>
    [HttpGet("tenant/{tenantKey}")]
    [ProducesResponseType(typeof(IEnumerable<ProviderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProviderDto>>> GetProvidersByTenant(
        string tenantKey,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100)
    {
        var providers = await _service.GetProvidersByTenantAsync(tenantKey, skip, take);
        return Ok(providers);
    }
}
