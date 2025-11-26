using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthExtent.Api.Models;

[Table("Provider", Schema = "he")]
public class Provider
{
    [Key]
    public long ProviderKey { get; set; }

    [Required]
    [MaxLength(64)]
    public string TenantKey { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? FamilyName { get; set; }

    [MaxLength(100)]
    public string? GivenName { get; set; }

    [MaxLength(20)]
    public string? Prefix { get; set; }

    [Required]
    public int Status { get; set; } = 1;  // 1=Active, 0=Inactive

    [MaxLength(10)]
    public string? NPI { get; set; }  // National Provider Identifier

    [Required]
    [Column(TypeName = "datetime2(3)")]
    public DateTime LastUpdatedUtc { get; set; } = DateTime.UtcNow;
}
