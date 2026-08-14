using ZooManagementSystem.Domain.Abstract;

namespace ZooManagementSystem.Domain.Models;

public class Keeper : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<string> AssignedAnimals { get; set; } = [];

    public Keeper()
    {
    }

    public Keeper(string name, int age, string phone, string email)
    {
        Name = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Name is required.", nameof(name)) : name;
        Age = age > 17 ? age : throw new ArgumentOutOfRangeException(nameof(age), "Keeper must be an adult.");
        Phone = phone;
        Email = email;
    }

    public void AssignAnimal(Animal animal)
    {
        ArgumentNullException.ThrowIfNull(animal);
        if (!string.IsNullOrWhiteSpace(animal.Id) && !AssignedAnimals.Contains(animal.Id))
        {
            AssignedAnimals.Add(animal.Id);
            animal.KeeperId = Id;
        }
    }

    public void RemoveAnimal(string animalId)
    {
        AssignedAnimals.Remove(animalId);
    }

    public string DisplayAnimals()
    {
        return AssignedAnimals.Count == 0 ? $"{Name} has no assigned animals." : $"{Name} manages {AssignedAnimals.Count} animals.";
    }
}
