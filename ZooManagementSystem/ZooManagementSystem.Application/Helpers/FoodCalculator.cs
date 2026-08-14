using ZooManagementSystem.Domain.Abstract;

namespace ZooManagementSystem.Application.Helpers;

public static class FoodCalculator
{
    public static double CalculateDailyFood(IEnumerable<Animal> animals)
    {
        return Math.Round(animals.Sum(animal => animal.CalculateFood()), 2);
    }

    public static double CalculateWeeklyFood(IEnumerable<Animal> animals)
    {
        return Math.Round(CalculateDailyFood(animals) * 7, 2);
    }

    public static double CalculateMonthlyFood(IEnumerable<Animal> animals)
    {
        return Math.Round(CalculateDailyFood(animals) * 30, 2);
    }
}
