using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Exceptions;
using ZooManagementSystem.Application.Interfaces;
using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Domain.Enums;
using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.Application.Services;

public class AnimalService : IAnimalService
{
    private readonly IAnimalRepository _animals;
    private readonly IKeeperRepository _keepers;
    private readonly IEnclosureRepository _enclosures;

    public AnimalService(IAnimalRepository animals, IKeeperRepository keepers, IEnclosureRepository enclosures)
    {
        _animals = animals;
        _keepers = keepers;
        _enclosures = enclosures;
    }

    public async Task<IReadOnlyList<AnimalDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return (await _animals.GetAllAsync(cancellationToken)).Select(ToDto).ToList();
    }

    public async Task<AnimalDto> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return ToDto(await GetAnimalAsync(id, cancellationToken));
    }

    public async Task<AnimalDto> CreateAsync(CreateAnimalDto dto, CancellationToken cancellationToken = default)
    {
        var animal = FromCreateDto(dto);
        animal.FoodPerDay = animal.CalculateFood();
        await _animals.CreateAsync(animal, cancellationToken);
        return ToDto(animal);
    }

    public async Task<AnimalDto> UpdateAsync(string id, UpdateAnimalDto dto, CancellationToken cancellationToken = default)
    {
        var animal = await GetAnimalAsync(id, cancellationToken);
        animal.Name = Required(dto.Name, nameof(dto.Name));
        animal.Species = Required(dto.Species, nameof(dto.Species));
        animal.Age = dto.Age;
        animal.Gender = dto.Gender;
        animal.Weight = dto.Weight;
        animal.HealthStatus = dto.HealthStatus;
        animal.EnclosureId = dto.EnclosureId;
        animal.KeeperId = dto.KeeperId;

        if (animal is Mammal mammal)
        {
            mammal.FurColor = dto.FurColor ?? mammal.FurColor;
            mammal.IsCarnivore = dto.IsCarnivore ?? mammal.IsCarnivore;
        }
        else if (animal is Bird bird)
        {
            bird.WingSpan = dto.WingSpan ?? bird.WingSpan;
            bird.CanFly = dto.CanFly ?? bird.CanFly;
        }

        animal.FoodPerDay = animal.CalculateFood();
        await _animals.UpdateAsync(id, animal, cancellationToken);
        return ToDto(animal);
    }

    public async Task DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (!await _animals.DeleteAsync(id, cancellationToken))
        {
            throw new NotFoundException($"Animal '{id}' was not found.");
        }
    }

    public async Task<AnimalDto> AssignKeeperAsync(string animalId, string keeperId, CancellationToken cancellationToken = default)
    {
        var animal = await GetAnimalAsync(animalId, cancellationToken);
        var keeper = await _keepers.GetByIdAsync(keeperId, cancellationToken) ?? throw new NotFoundException($"Keeper '{keeperId}' was not found.");
        keeper.AssignAnimal(animal);
        animal.KeeperId = keeper.Id;
        await _keepers.UpdateAsync(keeperId, keeper, cancellationToken);
        await _animals.UpdateAsync(animalId, animal, cancellationToken);
        return ToDto(animal);
    }

    public async Task<AnimalDto> AssignEnclosureAsync(string animalId, string enclosureId, CancellationToken cancellationToken = default)
    {
        var animal = await GetAnimalAsync(animalId, cancellationToken);
        var enclosure = await _enclosures.GetByIdAsync(enclosureId, cancellationToken) ?? throw new NotFoundException($"Enclosure '{enclosureId}' was not found.");
        enclosure.AddAnimal(animal);
        animal.EnclosureId = enclosure.Id;
        await _enclosures.UpdateAsync(enclosureId, enclosure, cancellationToken);
        await _animals.UpdateAsync(animalId, animal, cancellationToken);
        return ToDto(animal);
    }

    public async Task<string> FeedAsync(string animalId, FeedingScheduleDto dto, CancellationToken cancellationToken = default)
    {
        var animal = await GetAnimalAsync(animalId, cancellationToken);
        animal.FoodPerDay = animal.CalculateFood();
        animal.FeedingSchedules.Add(new FeedingSchedule(dto.FoodType, dto.Quantity, dto.Time) { AnimalId = animal.Id });
        await _animals.UpdateAsync(animalId, animal, cancellationToken);
        return animal.Feed();
    }

    public async Task<string> CheckHealthAsync(string animalId, HealthRecordDto dto, CancellationToken cancellationToken = default)
    {
        var animal = await GetAnimalAsync(animalId, cancellationToken);
        animal.AddHealthRecord(new HealthRecord(dto.Description, dto.VetName, dto.Status));
        await _animals.UpdateAsync(animalId, animal, cancellationToken);
        return animal.CheckHealth();
    }

    private async Task<Animal> GetAnimalAsync(string id, CancellationToken cancellationToken)
    {
        return await _animals.GetByIdAsync(id, cancellationToken) ?? throw new NotFoundException($"Animal '{id}' was not found.");
    }

    public static AnimalDto ToDto(Animal animal)
    {
        return new AnimalDto(
            animal.Id,
            animal.Name,
            animal.Species,
            animal.Age,
            animal.Gender,
            animal.Weight,
            animal.AnimalType,
            animal.HealthStatus,
            animal.FoodPerDay,
            animal.EnclosureId,
            animal.KeeperId,
            animal is Mammal mammal ? mammal.FurColor : null,
            animal is Mammal mammal2 ? mammal2.IsCarnivore : null,
            animal is Bird bird ? bird.WingSpan : null,
            animal is Bird bird2 ? bird2.CanFly : null,
            animal.FeedingSchedules,
            animal.HealthRecords);
    }

    private static Animal FromCreateDto(CreateAnimalDto dto)
    {
        return dto.AnimalType switch
        {
            AnimalType.Bird => new Bird(Required(dto.Name, nameof(dto.Name)), Required(dto.Species, nameof(dto.Species)), dto.Age, dto.Gender, dto.Weight, dto.WingSpan ?? 0, dto.CanFly ?? true),
            _ => new Mammal(Required(dto.Name, nameof(dto.Name)), Required(dto.Species, nameof(dto.Species)), dto.Age, dto.Gender, dto.Weight, dto.FurColor ?? string.Empty, dto.IsCarnivore ?? false)
        };
    }

    private static string Required(string value, string name)
    {
        return string.IsNullOrWhiteSpace(value) ? throw new ArgumentException($"{name} is required.", name) : value;
    }
}
