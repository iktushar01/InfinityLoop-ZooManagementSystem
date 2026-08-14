namespace ZooManagementSystem.Application.DTOs;

public record RevenueReportDto(decimal TotalRevenue, int TicketCount, decimal AverageTicketPrice);

public record AnimalReportDto(
    int TotalAnimals,
    IReadOnlyDictionary<string, int> AnimalsByCategory,
    IReadOnlyDictionary<string, int> AnimalsPerEnclosure,
    IReadOnlyList<AnimalDto> SickAnimals);

public record VisitorReportDto(int TotalVisitors, IReadOnlyDictionary<string, int> VisitorsByDate);

public record FoodRequirementReportDto(double DailyFood, double WeeklyFood, double MonthlyFood);
