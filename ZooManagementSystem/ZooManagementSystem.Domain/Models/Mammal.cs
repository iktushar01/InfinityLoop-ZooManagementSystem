using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Domain.Enums;

namespace ZooManagementSystem.Domain.Models;

public class Mammal : Animal
{
    public string FurColor { get; set; } = string.Empty;
    public bool IsCarnivore { get; set; }
    public override AnimalType AnimalType => AnimalType.Mammal;

    public Mammal()
    {
    }

    public Mammal(string name, string species, int age, Gender gender, double weight)
        : base(name, species, age, gender, weight)
    {
    }

    public Mammal(string name, string species, int age, Gender gender, double weight, string furColor, bool isCarnivore)
        : base(name, species, age, gender, weight)
    {
        FurColor = furColor;
        IsCarnivore = isCarnivore;
        FoodPerDay = CalculateFood();
    }

    public Mammal(Mammal other) : base(other)
    {
        FurColor = other.FurColor;
        IsCarnivore = other.IsCarnivore;
    }

    public override string Feed()
    {
        var food = IsCarnivore ? "meat" : "mixed vegetation";
        return $"{Name} the mammal was fed {FoodPerDay:0.##} kg of {food}.";
    }

    public override double CalculateFood()
    {
        var multiplier = IsCarnivore ? 0.06 : 0.04;
        return Math.Round(Weight * multiplier, 2);
    }

    public override string DisplayInfo()
    {
        return $"{base.DisplayInfo()}, mammal, fur: {FurColor}, carnivore: {IsCarnivore}";
    }
}
