using ZooManagementSystem.Domain.Models;

namespace ZooManagementSystem.Domain.Interfaces;

public interface IHealthCheck
{
    string CheckHealth();
    void AddHealthRecord(HealthRecord record);
}
