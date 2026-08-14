using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.API.Services;

public class AnimalService : ZooManagementSystem.Application.Services.AnimalService
{
    public AnimalService(IAnimalRepository animals, IKeeperRepository keepers, IEnclosureRepository enclosures)
        : base(animals, keepers, enclosures)
    {
    }
}
