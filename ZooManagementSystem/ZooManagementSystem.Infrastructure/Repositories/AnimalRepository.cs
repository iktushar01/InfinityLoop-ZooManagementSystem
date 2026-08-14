using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Infrastructure.Interfaces;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Repositories;

public class AnimalRepository : MongoRepository<Animal>, IAnimalRepository
{
    public AnimalRepository(MongoDbContext context) : base(context, "Animals")
    {
    }
}
