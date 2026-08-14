using ZooManagementSystem.Domain.Abstract;

namespace ZooManagementSystem.Domain.Models;

public class Enclosure : BaseEntity
{
    private int _capacity;

    public string Name { get; set; } = string.Empty;
    public int Capacity
    {
        get => _capacity;
        set => _capacity = value > 0 ? value : throw new ArgumentOutOfRangeException(nameof(value), "Capacity must be positive.");
    }

    public string HabitatType { get; set; } = string.Empty;
    public List<string> Animals { get; set; } = [];

    public Enclosure()
    {
    }

    public Enclosure(string name, int capacity, string habitatType)
    {
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Name is required.", nameof(name)) : name;
        Capacity = capacity;
        HabitatType = string.IsNullOrWhiteSpace(habitatType) ? throw new ArgumentException("Habitat type is required.", nameof(habitatType)) : habitatType;
    }

    public bool IsFull() => Animals.Count >= Capacity;

    public void AddAnimal(Animal animal)
    {
        ArgumentNullException.ThrowIfNull(animal);
        if (IsFull())
        {
            throw new InvalidOperationException($"{Name} is already full.");
        }

        if (!string.IsNullOrWhiteSpace(animal.Id) && !Animals.Contains(animal.Id))
        {
            Animals.Add(animal.Id);
            animal.EnclosureId = Id;
        }
    }

    public void RemoveAnimal(string animalId)
    {
        Animals.Remove(animalId);
    }
}
