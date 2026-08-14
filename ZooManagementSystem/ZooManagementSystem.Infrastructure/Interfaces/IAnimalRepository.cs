using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Interfaces;

public interface IAnimalRepository : IMongoRepository<Animal>
{
}
