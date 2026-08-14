namespace ZooManagementSystem.Domain.Models;

public class FeedingSchedule
{
    public string? AnimalId { get; set; }
    public TimeOnly Time { get; set; }
    public string FoodType { get; set; } = string.Empty;
    public double Quantity { get; set; }

    public FeedingSchedule()
    {
    }

    public FeedingSchedule(string foodType, double quantity, TimeOnly time)
    {
        FoodType = string.IsNullOrWhiteSpace(foodType) ? throw new ArgumentException("Food type is required.", nameof(foodType)) : foodType;
        Quantity = quantity > 0 ? quantity : throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be positive.");
        Time = time;
    }
}
