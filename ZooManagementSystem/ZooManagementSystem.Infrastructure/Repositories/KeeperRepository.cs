using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Repositories;

public class KeeperRepository : MongoRepository<Keeper>, IKeeperRepository
{
    public KeeperRepository(MongoDbContext context) : base(context, "Keepers")
    {
    }
}
