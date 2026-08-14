using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Domain.Enums;

namespace ZooManagementSystem.Domain.Models;

public class Zoo
{
    public static int TotalAnimals;
    public static int TotalVisitors;

    public List<Animal> Animals { get; set; } = [];
    public List<Keeper> Keepers { get; set; } = [];
    public List<Enclosure> Enclosures { get; set; } = [];
    public List<Ticket> Tickets { get; set; } = [];

    public Zoo()
    {
    }

    public Zoo(IEnumerable<Animal> animals, IEnumerable<Keeper> keepers, IEnumerable<Enclosure> enclosures, IEnumerable<Ticket> tickets)
    {
        Animals = animals.ToList();
        Keepers = keepers.ToList();
        Enclosures = enclosures.ToList();
        Tickets = tickets.ToList();
        TotalAnimals = Animals.Count;
        TotalVisitors = Tickets.Count;
    }

    public void AddAnimal()
    {
        AddAnimal(new Mammal("Unnamed", "Unknown", 0, Gender.Male, 1));
    }

    public void AddAnimal(Animal animal)
    {
        ArgumentNullException.ThrowIfNull(animal);
        Animals.Add(animal);
        TotalAnimals = Animals.Count;
    }

    public void AddAnimal(string name, int age)
    {
        AddAnimal(new Mammal(name, "Unknown", age, Gender.Male, 1));
    }

    public void AddAnimal(string name, string species, double weight)
    {
        AddAnimal(new Mammal(name, species, 0, Gender.Male, weight));
    }

    public void RemoveAnimal(string id)
    {
        Animals.RemoveAll(animal => animal.Id == id);
        TotalAnimals = Animals.Count;
    }

    public decimal GenerateRevenue() => Tickets.Sum(ticket => ticket.Price);

    public object GenerateAnimalReport() => new
    {
        TotalAnimals = Animals.Count,
        AnimalsByCategory = Animals.GroupBy(animal => animal.AnimalType).ToDictionary(group => group.Key.ToString(), group => group.Count()),
        SickAnimals = Animals.Where(animal => animal.HealthStatus != HealthStatus.Healthy).Select(animal => animal.Name).ToList()
    };

    public object GenerateVisitorReport() => new
    {
        TotalVisitors = Tickets.Count,
        VisitorsByDate = Tickets.GroupBy(ticket => ticket.VisitDate).ToDictionary(group => group.Key.ToString("yyyy-MM-dd"), group => group.Count())
    };

    public static int GetTotalAnimals() => TotalAnimals;

    public static decimal GetTotalRevenue(IEnumerable<Ticket> tickets) => tickets.Sum(ticket => ticket.Price);

    public static Zoo operator +(Zoo zoo, Animal animal)
    {
        zoo.AddAnimal(animal);
        return zoo;
    }

    public static Zoo operator +(Zoo zoo, Keeper keeper)
    {
        zoo.Keepers.Add(keeper);
        return zoo;
    }
}
