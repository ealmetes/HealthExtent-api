using FluentValidation;
using HealthExtent.Api.DTOs;

namespace HealthExtent.Api.Validators;

public class UpdateCareTransitionRequestValidator : AbstractValidator<UpdateCareTransitionRequest>
{
    public UpdateCareTransitionRequestValidator()
    {
        RuleFor(x => x.TenantKey)
            .NotEmpty()
            .WithMessage("TenantKey is required")
            .MaximumLength(64)
            .WithMessage("TenantKey cannot exceed 64 characters");

        RuleFor(x => x.CareTransitionKey)
            .GreaterThan(0)
            .WithMessage("CareTransitionKey must be greater than 0");

        RuleFor(x => x.AssignedTeam)
            .MaximumLength(100)
            .WithMessage("AssignedTeam cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.AssignedTeam));

        RuleFor(x => x.OutreachMethod)
            .MaximumLength(50)
            .WithMessage("OutreachMethod cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.OutreachMethod));

        RuleFor(x => x.Status)
            .MaximumLength(50)
            .WithMessage("Status cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Status));

        RuleFor(x => x.Priority)
            .MaximumLength(20)
            .WithMessage("Priority cannot exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.Priority));

        RuleFor(x => x.RiskTier)
            .MaximumLength(20)
            .WithMessage("RiskTier cannot exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.RiskTier));

        RuleFor(x => x.ReadmissionRiskScore)
            .InclusiveBetween(0, 100)
            .WithMessage("ReadmissionRiskScore must be between 0 and 100")
            .When(x => x.ReadmissionRiskScore.HasValue);

        RuleFor(x => x.PreferredLanguage)
            .MaximumLength(50)
            .WithMessage("PreferredLanguage cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.PreferredLanguage));

        RuleFor(x => x.OutreachAttempts)
            .GreaterThanOrEqualTo(0)
            .WithMessage("OutreachAttempts cannot be negative")
            .When(x => x.OutreachAttempts.HasValue);

        RuleFor(x => x.ContactOutcome)
            .MaximumLength(500)
            .WithMessage("ContactOutcome cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.ContactOutcome));

        RuleFor(x => x.Notes)
            .MaximumLength(2000)
            .WithMessage("Notes cannot exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Notes));

        // Validate HL7 timestamp formats
        RuleFor(x => x.FollowUpApptDateTime_TS)
            .Must(BeValidHL7Timestamp)
            .WithMessage("FollowUpApptDateTime_TS must be in HL7 format (YYYYMMDDHHmmss)")
            .When(x => !string.IsNullOrEmpty(x.FollowUpApptDateTime_TS));

        RuleFor(x => x.CommunicationSentDate_TS)
            .Must(BeValidHL7Timestamp)
            .WithMessage("CommunicationSentDate_TS must be in HL7 format (YYYYMMDDHHmmss)")
            .When(x => !string.IsNullOrEmpty(x.CommunicationSentDate_TS));

        RuleFor(x => x.OutreachDate_TS)
            .Must(BeValidHL7Timestamp)
            .WithMessage("OutreachDate_TS must be in HL7 format (YYYYMMDDHHmmss)")
            .When(x => !string.IsNullOrEmpty(x.OutreachDate_TS));

        RuleFor(x => x.TcmSchedule1_TS)
            .Must(BeValidHL7Timestamp)
            .WithMessage("TcmSchedule1_TS must be in HL7 format (YYYYMMDDHHmmss)")
            .When(x => !string.IsNullOrEmpty(x.TcmSchedule1_TS));

        RuleFor(x => x.TcmSchedule2_TS)
            .Must(BeValidHL7Timestamp)
            .WithMessage("TcmSchedule2_TS must be in HL7 format (YYYYMMDDHHmmss)")
            .When(x => !string.IsNullOrEmpty(x.TcmSchedule2_TS));

        RuleFor(x => x.LastOutreachDate_TS)
            .Must(BeValidHL7Timestamp)
            .WithMessage("LastOutreachDate_TS must be in HL7 format (YYYYMMDDHHmmss)")
            .When(x => !string.IsNullOrEmpty(x.LastOutreachDate_TS));

        RuleFor(x => x.NextOutreachDate_TS)
            .Must(BeValidHL7Timestamp)
            .WithMessage("NextOutreachDate_TS must be in HL7 format (YYYYMMDDHHmmss)")
            .When(x => !string.IsNullOrEmpty(x.NextOutreachDate_TS));
    }

    private bool BeValidHL7Timestamp(string? timestamp)
    {
        if (string.IsNullOrWhiteSpace(timestamp))
            return true; // null/empty is valid (optional field)

        // Must be at least 8 characters (YYYYMMDD)
        if (timestamp.Length < 8)
            return false;

        // Can be 8 (date only), 12 (date + hour/min), or 14 (full timestamp)
        if (timestamp.Length != 8 && timestamp.Length != 12 && timestamp.Length != 14)
            return false;

        // Must be all digits
        return timestamp.All(char.IsDigit);
    }
}
