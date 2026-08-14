using ZooManagementSystem.Application.DTOs;

namespace ZooManagementSystem.Application.Interfaces;

public interface IZooService
{
    Task<AnimalReportDto> GenerateAnimalReportAsync(CancellationToken cancellationToken = default);
    Task<RevenueReportDto> GenerateRevenueReportAsync(CancellationToken cancellationToken = default);
    Task<VisitorReportDto> GenerateVisitorReportAsync(CancellationToken cancellationToken = default);
    Task<FoodRequirementReportDto> GenerateFoodRequirementReportAsync(CancellationToken cancellationToken = default);
}
