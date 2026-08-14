using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Helpers;
using ZooManagementSystem.Application.Interfaces;
using ZooManagementSystem.Domain.Enums;
using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.Application.Services;

public class ZooService : IZooService
{
    private readonly IAnimalRepository _animals;
    private readonly IEnclosureRepository _enclosures;
    private readonly ITicketRepository _tickets;

    public ZooService(IAnimalRepository animals, IEnclosureRepository enclosures, ITicketRepository tickets)
    {
        _animals = animals;
        _enclosures = enclosures;
        _tickets = tickets;
    }

    public async Task<AnimalReportDto> GenerateAnimalReportAsync(CancellationToken cancellationToken = default)
    {
        var animals = await _animals.GetAllAsync(cancellationToken);
        var enclosures = await _enclosures.GetAllAsync(cancellationToken);
        return new AnimalReportDto(
            animals.Count,
            animals.GroupBy(animal => animal.AnimalType.ToString()).ToDictionary(group => group.Key, group => group.Count()),
            enclosures.ToDictionary(enclosure => enclosure.Name, enclosure => enclosure.Animals.Count),
            animals.Where(animal => animal.HealthStatus != HealthStatus.Healthy).Select(AnimalService.ToDto).ToList());
    }

    public async Task<RevenueReportDto> GenerateRevenueReportAsync(CancellationToken cancellationToken = default)
    {
        var tickets = await _tickets.GetAllAsync(cancellationToken);
        var total = Zoo.GetTotalRevenue(tickets);
        return new RevenueReportDto(total, tickets.Count, tickets.Count == 0 ? 0 : Math.Round(total / tickets.Count, 2));
    }

    public async Task<VisitorReportDto> GenerateVisitorReportAsync(CancellationToken cancellationToken = default)
    {
        var tickets = await _tickets.GetAllAsync(cancellationToken);
        return new VisitorReportDto(
            tickets.Count,
            tickets.GroupBy(ticket => ticket.VisitDate.ToString("yyyy-MM-dd")).ToDictionary(group => group.Key, group => group.Count()));
    }

    public async Task<FoodRequirementReportDto> GenerateFoodRequirementReportAsync(CancellationToken cancellationToken = default)
    {
        var animals = await _animals.GetAllAsync(cancellationToken);
        return new FoodRequirementReportDto(
            FoodCalculator.CalculateDailyFood(animals),
            FoodCalculator.CalculateWeeklyFood(animals),
            FoodCalculator.CalculateMonthlyFood(animals));
    }
}
