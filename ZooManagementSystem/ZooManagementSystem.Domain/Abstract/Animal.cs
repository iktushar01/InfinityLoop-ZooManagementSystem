using MongoDB.Bson.Serialization.Attributes;
using ZooManagementSystem.Domain.Enums;
using ZooManagementSystem.Domain.Interfaces;
using ZooManagementSystem.Domain.Models;

namespace ZooManagementSystem.Domain.Abstract;

[BsonDiscriminator(RootClass = true)]
[BsonKnownTypes(typeof(Mammal), typeof(Bird))]
public abstract class Animal : BaseEntity, IFeedable, IHealthCheck
{
    private int _age;
    private double _weight;
    private double _foodPerDay;

    public string Name { get; set; } = string.Empty;
    public string Species { get; set; } = string.Empty;
    public int Age
    {
        get => _age;
        set => _age = value >= 0 ? value : throw new ArgumentOutOfRangeException(nameof(value), "Age cannot be negative.");
    }

    public Gender Gender { get; set; }
    public double Weight
    {
        get => _weight;
        set => _weight = value > 0 ? value : throw new ArgumentOutOfRangeException(nameof(value), "Weight must be positive.");
    }

    public abstract AnimalType AnimalType { get; }
    public HealthStatus HealthStatus { get; set; } = HealthStatus.Healthy;
    public double FoodPerDay
    {
        get => _foodPerDay;
        set => _foodPerDay = value >= 0 ? value : throw new ArgumentOutOfRangeException(nameof(value), "Food per day cannot be negative.");
    }

    public string? EnclosureId { get; set; }
    public string? KeeperId { get; set; }
    public List<FeedingSchedule> FeedingSchedules { get; set; } = [];
    public List<HealthRecord> HealthRecords { get; set; } = [];

    protected Animal()
    {
    }

    protected Animal(string name, string species, int age, Gender gender, double weight)
    {
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Name is required.", nameof(name)) : name;
        Species = string.IsNullOrWhiteSpace(species) ? throw new ArgumentException("Species is required.", nameof(species)) : species;
        Age = age;
        Gender = gender;
        Weight = weight;
        FoodPerDay = CalculateFood();
    }

    protected Animal(Animal other)
    {
        Id = other.Id;
        Name = other.Name;
        Species = other.Species;
        Age = other.Age;
        Gender = other.Gender;
        Weight = other.Weight;
        HealthStatus = other.HealthStatus;
        FoodPerDay = other.FoodPerDay;
        EnclosureId = other.EnclosureId;
        KeeperId = other.KeeperId;
        FeedingSchedules = other.FeedingSchedules.Select(schedule => new FeedingSchedule
        {
            AnimalId = schedule.AnimalId,
            Time = schedule.Time,
            FoodType = schedule.FoodType,
            Quantity = schedule.Quantity
        }).ToList();
        HealthRecords = other.HealthRecords.Select(record => new HealthRecord
        {
            Date = record.Date,
            Description = record.Description,
            VetName = record.VetName,
            Status = record.Status
        }).ToList();
    }

    public virtual string Feed()
    {
        return $"{Name} was fed {FoodPerDay:0.##} kg of food.";
    }

    public virtual string CheckHealth()
    {
        return $"{Name} is currently {HealthStatus}.";
    }

    public virtual void AddHealthRecord(HealthRecord record)
    {
        ArgumentNullException.ThrowIfNull(record);
        HealthRecords.Add(record);
        HealthStatus = record.Status;
    }

    public abstract double CalculateFood();

    public virtual string DisplayInfo()
    {
        return $"{Name} ({Species}), {Age} years old, {Weight:0.##} kg, {HealthStatus}";
    }

    public static bool operator ==(Animal? left, Animal? right)
    {
        if (ReferenceEquals(left, right))
        {
            return true;
        }

        if (left is null || right is null)
        {
            return false;
        }

        return !string.IsNullOrWhiteSpace(left.Id) && left.Id == right.Id;
    }

    public static bool operator !=(Animal? left, Animal? right) => !(left == right);

    public override bool Equals(object? obj) => obj is Animal animal && this == animal;

    public override int GetHashCode() => Id?.GetHashCode(StringComparison.Ordinal) ?? base.GetHashCode();
}
