using ZooManagementSystem.Domain.Enums;

namespace ZooManagementSystem.Domain.Models;

public class HealthRecord
{
    public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public string Description { get; set; } = string.Empty;
    public string VetName { get; set; } = string.Empty;
    public HealthStatus Status { get; set; } = HealthStatus.Healthy;

    public HealthRecord()
    {
    }

    public HealthRecord(string description, string vetName, HealthStatus status)
    {
        Description = string.IsNullOrWhiteSpace(description) ? throw new ArgumentException("Description is required.", nameof(description)) : description;
        VetName = string.IsNullOrWhiteSpace(vetName) ? throw new ArgumentException("Vet name is required.", nameof(vetName)) : vetName;
        Status = status;
    }
}
