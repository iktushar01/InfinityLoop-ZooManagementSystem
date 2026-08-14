namespace ZooManagementSystem.API.Helpers;

public static class FoodCalculator
{
    public static double CalculateDailyFood(IEnumerable<ZooManagementSystem.Domain.Abstract.Animal> animals)
    {
        return ZooManagementSystem.Application.Helpers.FoodCalculator.CalculateDailyFood(animals);
    }

    public static double CalculateWeeklyFood(IEnumerable<ZooManagementSystem.Domain.Abstract.Animal> animals)
    {
        return ZooManagementSystem.Application.Helpers.FoodCalculator.CalculateWeeklyFood(animals);
    }

    public static double CalculateMonthlyFood(IEnumerable<ZooManagementSystem.Domain.Abstract.Animal> animals)
    {
        return ZooManagementSystem.Application.Helpers.FoodCalculator.CalculateMonthlyFood(animals);
    }
}
