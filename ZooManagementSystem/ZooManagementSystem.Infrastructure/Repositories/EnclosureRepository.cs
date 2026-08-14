using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Repositories;

public class EnclosureRepository : MongoRepository<Enclosure>, IEnclosureRepository
{
    public EnclosureRepository(MongoDbContext context) : base(context, "Enclosures")
    {
    }
}
