using FluentValidation;
using HealthExtent.Api.DTOs;

namespace HealthExtent.Api.Validators;

public class UpsertPatientRequestValidator : AbstractValidator<UpsertPatientRequest>
{
    public UpsertPatientRequestValidator()
    {
        RuleFor(x => x.TenantKey)
            .NotEmpty()
            .WithMessage("TenantKey is required")
            .MaximumLength(64)
            .WithMessage("TenantKey cannot exceed 64 characters");

        RuleFor(x => x.PatientIdExternal)
            .NotEmpty()
            .WithMessage("PatientIdExternal is required")
            .MaximumLength(128)
            .WithMessage("PatientIdExternal cannot exceed 128 characters");

        RuleFor(x => x.AssigningAuthority)
            .MaximumLength(128)
            .WithMessage("AssigningAuthority cannot exceed 128 characters")
            .When(x => !string.IsNullOrEmpty(x.AssigningAuthority));

        RuleFor(x => x.MRN)
            .MaximumLength(64)
            .WithMessage("MRN cannot exceed 64 characters")
            .When(x => !string.IsNullOrEmpty(x.MRN));

        RuleFor(x => x.SSN)
            .MaximumLength(11)
            .WithMessage("SSN cannot exceed 11 characters")
            .When(x => !string.IsNullOrEmpty(x.SSN));

        RuleFor(x => x.CustodianName)
            .MaximumLength(200)
            .WithMessage("CustodianName cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.CustodianName));

        RuleFor(x => x.CustodianPhone)
            .MaximumLength(50)
            .WithMessage("CustodianPhone cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.CustodianPhone));

        RuleFor(x => x.FamilyName)
            .MaximumLength(128)
            .WithMessage("FamilyName cannot exceed 128 characters")
            .When(x => !string.IsNullOrEmpty(x.FamilyName));

        RuleFor(x => x.GivenName)
            .MaximumLength(128)
            .WithMessage("GivenName cannot exceed 128 characters")
            .When(x => !string.IsNullOrEmpty(x.GivenName));

        RuleFor(x => x.Sex)
            .MaximumLength(1)
            .WithMessage("Sex must be a single character")
            .When(x => !string.IsNullOrEmpty(x.Sex));

        RuleFor(x => x.Phone)
            .MaximumLength(32)
            .WithMessage("Phone cannot exceed 32 characters")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.PostalCode)
            .MaximumLength(16)
            .WithMessage("PostalCode cannot exceed 16 characters")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));
    }
}
