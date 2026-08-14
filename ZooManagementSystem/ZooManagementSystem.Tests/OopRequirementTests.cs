using Xunit;
using ZooManagementSystem.Application.Helpers;
using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Domain.Enums;
using ZooManagementSystem.Domain.Interfaces;
using ZooManagementSystem.Domain.Models;

namespace ZooManagementSystem.Tests;

public class OopRequirementTests
{
    [Fact]
    public void Test_AbstractClass_And_Inheritance()
    {
        // Animal is abstract; Mammal and Bird inherit from Animal
        Animal lion = new Mammal("Simba", "Panthera leo", 5, Gender.Male, 190.0, "Golden", true);
        Animal eagle = new Bird("Aquila", "Aquila chrysaetos", 3, Gender.Female, 4.5, 2.2, true);

        Assert.IsAssignableFrom<Animal>(lion);
        Assert.IsAssignableFrom<Animal>(eagle);
        Assert.Equal(AnimalType.Mammal, lion.AnimalType);
        Assert.Equal(AnimalType.Bird, eagle.AnimalType);
    }

    [Fact]
    public void Test_MethodOverriding_And_Polymorphism()
    {
        Animal lion = new Mammal("Simba", "Panthera leo", 5, Gender.Male, 190.0, "Golden", true);
        Animal eagle = new Bird("Aquila", "Aquila chrysaetos", 3, Gender.Female, 4.5, 2.2, true);

        // Feed() and CalculateFood() are overridden polymorphically
        string lionFeedMsg = lion.Feed();
        string eagleFeedMsg = eagle.Feed();

        Assert.Contains("Simba the mammal was fed", lionFeedMsg);
        Assert.Contains("meat", lionFeedMsg);
        Assert.Contains("Aquila the bird was fed", eagleFeedMsg);

        // Daily food calculation checks
        Assert.Equal(11.4, lion.CalculateFood()); // 190 * 0.06 = 11.4
        Assert.Equal(0.36, eagle.CalculateFood()); // 4.5 * 0.08 = 0.36
    }

    [Fact]
    public void Test_Interfaces_IFeedable_And_IHealthCheck()
    {
        Animal panda = new Mammal("Po", "Ailuropoda melanoleuca", 4, Gender.Male, 100.0, "Black and White", false);

        IFeedable feedable = panda;
        IHealthCheck healthCheckable = panda;

        Assert.Equal(4.0, feedable.CalculateFood()); // 100 * 0.04 = 4.0
        Assert.Contains("Po is currently Healthy.", healthCheckable.CheckHealth());

        panda.AddHealthRecord(new HealthRecord
        {
            Date = DateOnly.FromDateTime(DateTime.UtcNow),
            Description = "Routine checkup",
            VetName = "Dr. Smith",
            Status = HealthStatus.Sick
        });

        Assert.Equal(HealthStatus.Sick, panda.HealthStatus);
        Assert.Contains("Po is currently Sick.", healthCheckable.CheckHealth());
    }

    [Fact]
    public void Test_ConstructorOverloading_And_CopyConstructor()
    {
        // Constructor overloading in Mammal
        Mammal original = new Mammal("Leo", "Panthera leo", 6, Gender.Male, 180.0, "Yellow", true);
        original.Id = "lion-001";
        original.EnclosureId = "enc-101";

        // Copy constructor
        Mammal copy = new Mammal(original);

        Assert.Equal(original.Id, copy.Id);
        Assert.Equal(original.Name, copy.Name);
        Assert.Equal(original.FurColor, copy.FurColor);
        Assert.Equal(original.IsCarnivore, copy.IsCarnivore);
        Assert.Equal(original.EnclosureId, copy.EnclosureId);
    }

    [Fact]
    public void Test_OperatorOverloading()
    {
        // Animal equality operators (== and !=) based on Id
        Mammal animal1 = new Mammal("Alex", "Lion", 4, Gender.Male, 150) { Id = "anim-1" };
        Mammal animal2 = new Mammal("Alex", "Lion", 4, Gender.Male, 150) { Id = "anim-1" };
        Mammal animal3 = new Mammal("Marty", "Zebra", 3, Gender.Male, 200) { Id = "anim-2" };

        Assert.True(animal1 == animal2);
        Assert.False(animal1 == animal3);
        Assert.True(animal1 != animal3);

        // Zoo '+' operator overloading
        Zoo zoo = new Zoo();
        Keeper keeper = new Keeper("John Doe", 30, "123-456", "john@zoo.com");

        zoo = zoo + animal1;
        zoo = zoo + keeper;

        Assert.Single(zoo.Animals);
        Assert.Single(zoo.Keepers);
    }

    [Fact]
    public void Test_FunctionOverloading()
    {
        Zoo zoo = new Zoo();

        // Zoo.AddAnimal overloads
        zoo.AddAnimal(); // Default overload
        zoo.AddAnimal("Melman", 5); // Overload with name and age
        zoo.AddAnimal("Gloria", "Hippo", 800.0); // Overload with name, species, weight
        zoo.AddAnimal(new Bird("Zazu", "Hornbill", 2, Gender.Male, 1.2, 0.5, true)); // Overload with Animal object

        Assert.Equal(4, zoo.Animals.Count);
        Assert.Equal(4, Zoo.TotalAnimals);
    }

    [Fact]
    public void Test_StaticFields_Methods_And_Classes()
    {
        var animals = new List<Animal>
        {
            new Mammal("Tiger", "Panthera tigris", 4, Gender.Male, 200.0, "Orange/Black", true), // 200 * 0.06 = 12.0 kg
            new Bird("Parrot", "Psittacidae", 2, Gender.Female, 1.0, 0.3, true)                 // 1.0 * 0.08 = 0.08 kg
        };

        // Static class FoodCalculator
        double dailyFood = FoodCalculator.CalculateDailyFood(animals);
        double weeklyFood = FoodCalculator.CalculateWeeklyFood(animals);
        double monthlyFood = FoodCalculator.CalculateMonthlyFood(animals);

        Assert.Equal(12.08, dailyFood);
        Assert.Equal(84.56, weeklyFood);
        Assert.Equal(362.4, monthlyFood);

        // Static method Zoo.GetTotalRevenue
        var tickets = new List<Ticket>
        {
            new Ticket("Alice", TicketType.Adult, 20.00m, DateOnly.FromDateTime(DateTime.UtcNow)),
            new Ticket("Bob", TicketType.Child, 10.00m, DateOnly.FromDateTime(DateTime.UtcNow)),
            new Ticket("Charlie", TicketType.VIP, 50.00m, DateOnly.FromDateTime(DateTime.UtcNow))
        };

        decimal totalRevenue = Zoo.GetTotalRevenue(tickets);
        Assert.Equal(80.00m, totalRevenue);
    }

    [Fact]
    public void Test_Enclosure_And_Keeper_Management()
    {
        Enclosure savanna = new Enclosure("Savanna Habitat", 2, "Grassland") { Id = "enc-1" };
        Keeper keeper = new Keeper("Sarah Connor", 35, "555-0199", "sarah@zoo.com") { Id = "keep-1" };
        Mammal lion = new Mammal("Simba", "Lion", 5, Gender.Male, 190.0) { Id = "anim-1" };
        Mammal cheetah = new Mammal("Chester", "Cheetah", 4, Gender.Male, 60.0) { Id = "anim-2" };
        Mammal hyena = new Mammal("Shenzi", "Hyena", 3, Gender.Female, 50.0) { Id = "anim-3" };

        // Capacity check
        savanna.AddAnimal(lion);
        savanna.AddAnimal(cheetah);

        Assert.True(savanna.IsFull());
        Assert.Throws<InvalidOperationException>(() => savanna.AddAnimal(hyena));

        // Keeper assignment
        keeper.AssignAnimal(lion);
        keeper.AssignAnimal(cheetah);

        Assert.Equal(2, keeper.AssignedAnimals.Count);
        Assert.Equal("keep-1", lion.KeeperId);
        Assert.Contains("manages 2 animals", keeper.DisplayAnimals());
    }

    [Fact]
    public void Test_Reporting_Features()
    {
        Zoo zoo = new Zoo();
        zoo.AddAnimal(new Mammal("Simba", "Lion", 5, Gender.Male, 190.0) { HealthStatus = HealthStatus.Healthy });
        zoo.AddAnimal(new Mammal("Kovu", "Lion", 3, Gender.Male, 160.0) { HealthStatus = HealthStatus.Sick });
        zoo.AddAnimal(new Bird("Zazu", "Hornbill", 2, Gender.Male, 1.2, 0.5, true) { HealthStatus = HealthStatus.Healthy });

        zoo.Tickets.Add(new Ticket("Visitor A", TicketType.Adult, 25.00m, new DateOnly(2026, 8, 14)));
        zoo.Tickets.Add(new Ticket("Visitor B", TicketType.Child, 15.00m, new DateOnly(2026, 8, 14)));

        decimal revenue = zoo.GenerateRevenue();
        Assert.Equal(40.00m, revenue);

        var animalReportObj = zoo.GenerateAnimalReport();
        var totalAnimalsProp = animalReportObj.GetType().GetProperty("TotalAnimals")?.GetValue(animalReportObj);
        Assert.Equal(3, totalAnimalsProp);

        var visitorReportObj = zoo.GenerateVisitorReport();
        var totalVisitorsProp = visitorReportObj.GetType().GetProperty("TotalVisitors")?.GetValue(visitorReportObj);
        Assert.Equal(2, totalVisitorsProp);
    }
}
