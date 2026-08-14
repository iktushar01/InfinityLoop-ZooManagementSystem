using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Domain.Enums;

namespace ZooManagementSystem.Domain.Models;

public class Bird : Animal
{
    public double WingSpan { get; set; }
    public bool CanFly { get; set; }
    public override AnimalType AnimalType => AnimalType.Bird;

    public Bird()
    {
    }

    public Bird(string name, string species, int age, Gender gender, double weight)
        : base(name, species, age, gender, weight)
    {
    }

    public Bird(string name, string species, int age, Gender gender, double weight, double wingSpan, bool canFly)
        : base(name, species, age, gender, weight)
    {
        WingSpan = wingSpan >= 0 ? wingSpan : throw new ArgumentOutOfRangeException(nameof(wingSpan), "Wing span cannot be negative.");
        CanFly = canFly;
        FoodPerDay = CalculateFood();
    }

    public Bird(Bird other) : base(other)
    {
        WingSpan = other.WingSpan;
        CanFly = other.CanFly;
    }

    public override string Feed()
    {
        return $"{Name} the bird was fed {FoodPerDay:0.##} kg of grains, fruit, or insects.";
    }

    public override double CalculateFood()
    {
        var flightFactor = CanFly ? 0.08 : 0.05;
        return Math.Round(Weight * flightFactor, 2);
    }

    public override string DisplayInfo()
    {
        return $"{base.DisplayInfo()}, bird, wingspan: {WingSpan:0.##} m, can fly: {CanFly}";
    }
}
