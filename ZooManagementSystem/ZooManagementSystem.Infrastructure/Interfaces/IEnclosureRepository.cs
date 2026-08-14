using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Interfaces;

public interface IEnclosureRepository : IMongoRepository<Enclosure>
{
}
