using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Interfaces;

public interface IKeeperRepository : IMongoRepository<Keeper>
{
}
