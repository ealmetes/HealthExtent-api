using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace HealthExtent.Api.Models;

[Table("CareTransition", Schema = "he")]
[Index(nameof(TenantKey), nameof(EncounterKey), IsUnique = true, Name = "UQ_CareTransition_Encounter")]
[Index(nameof(TenantKey), nameof(PatientKey), Name = "IX_CareTransition_Patient")]
[Index(nameof(TenantKey), nameof(Status), Name = "IX_CareTransition_Status")]
public class CareTransition
{
    [Key]
    public int CareTransitionKey { get; set; }

    [Required]
    [MaxLength(64)]
    public string TenantKey { get; set; } = string.Empty;

    [Required]
    public int EncounterKey { get; set; }

    [Required]
    public int PatientKey { get; set; }

    [Required]
    public int HospitalKey { get; set; }

    [Required]
    [MaxLength(64)]
    public string VisitNumber { get; set; } = string.Empty;

    [MaxLength(64)]
    public string? CareManagerUserKey { get; set; }

    [MaxLength(64)]
    public string? AssignedToUserKey { get; set; }

    [MaxLength(100)]
    public string? AssignedTeam { get; set; }

    public long? FollowUpProviderKey { get; set; }

    [Column(TypeName = "datetime2(3)")]
    public DateTime? FollowUpApptDateTime { get; set; }

    [Column(TypeName = "datetime2(3)")]
    public DateTime? CommunicationSentDate { get; set; }

    [Column(TypeName = "datetime2(3)")]
    public DateTime? OutreachDate { get; set; }

    [MaxLength(50)]
    public string? OutreachMethod { get; set; }

    [Column(TypeName = "datetime2(3)")]
    public DateTime? TcmSchedule1 { get; set; }

    [Column(TypeName = "datetime2(3)")]
    public DateTime? TcmSchedule2 { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "New";

    [MaxLength(20)]
    public string? Priority { get; set; }

    [MaxLength(20)]
    public string? RiskTier { get; set; }

    public int? ReadmissionRiskScore { get; set; }

    public bool? ConsentConfirmed { get; set; }

    [MaxLength(50)]
    public string? PreferredLanguage { get; set; }

    public int OutreachAttempts { get; set; } = 0;

    [Column(TypeName = "datetime2(3)")]
    public DateTime? LastOutreachDate { get; set; }

    [Column(TypeName = "datetime2(3)")]
    public DateTime? NextOutreachDate { get; set; }

    [MaxLength(100)]
    public string? ContactOutcome { get; set; }

    [MaxLength(200)]
    public string? CloseReason { get; set; }

    [MaxLength(64)]
    public string? ClosedByUserKey { get; set; }

    [Column(TypeName = "datetime2(3)")]
    public DateTime? ClosedUtc { get; set; }

    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;

    [Required]
    [Column(TypeName = "datetime2(3)")]
    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    [Required]
    [Column(TypeName = "datetime2(3)")]
    public DateTime LastUpdatedUtc { get; set; } = DateTime.UtcNow;

    // Navigation properties removed due to type mismatch between C areTransition keys (int) and related entity keys (long)
    // The database has INT columns for EncounterKey, PatientKey, but Encounter/Patient tables use BIGINT
}
