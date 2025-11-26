using FluentValidation;
using HealthExtent.Api.DTOs;

namespace HealthExtent.Api.Validators;

public class UpsertProviderRequestValidator : AbstractValidator<UpsertProviderRequest>
{
    public UpsertProviderRequestValidator()
    {
        RuleFor(x => x.TenantKey)
            .NotEmpty()
            .WithMessage("TenantKey is required")
            .MaximumLength(64)
            .WithMessage("TenantKey must not exceed 64 characters");

        RuleFor(x => x.NPI)
            .NotEmpty()
            .WithMessage("NPI is required")
            .MaximumLength(10)
            .WithMessage("NPI must not exceed 10 characters")
            .Matches(@"^\d{10}$")
            .WithMessage("NPI must be exactly 10 digits");

        RuleFor(x => x.FamilyName)
            .MaximumLength(100)
            .WithMessage("FamilyName must not exceed 100 characters");

        RuleFor(x => x.GivenName)
            .MaximumLength(100)
            .WithMessage("GivenName must not exceed 100 characters");

        RuleFor(x => x.Prefix)
            .MaximumLength(20)
            .WithMessage("Prefix must not exceed 20 characters");

        RuleFor(x => x.Status)
            .InclusiveBetween(0, 1)
            .WithMessage("Status must be 0 (Inactive) or 1 (Active)");
    }
}
