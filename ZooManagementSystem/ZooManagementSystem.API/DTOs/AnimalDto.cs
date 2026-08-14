using ZooManagementSystem.Domain.Enums;
using ZooManagementSystem.Domain.Models;

namespace ZooManagementSystem.API.DTOs;

public record AnimalDto(
    string? Id,
    string Name,
    string Species,
    int Age,
    Gender Gender,
    double Weight,
    AnimalType AnimalType,
    HealthStatus HealthStatus,
    double FoodPerDay,
    string? EnclosureId,
    string? KeeperId,
    string? FurColor,
    bool? IsCarnivore,
    double? WingSpan,
    bool? CanFly,
    IReadOnlyList<FeedingSchedule> FeedingSchedules,
    IReadOnlyList<HealthRecord> HealthRecords);

public record CreateAnimalDto(string Name, string Species, int Age, Gender Gender, double Weight, AnimalType AnimalType, string? FurColor, bool? IsCarnivore, double? WingSpan, bool? CanFly);

public record UpdateAnimalDto(string Name, string Species, int Age, Gender Gender, double Weight, HealthStatus HealthStatus, string? EnclosureId, string? KeeperId, string? FurColor, bool? IsCarnivore, double? WingSpan, bool? CanFly);
