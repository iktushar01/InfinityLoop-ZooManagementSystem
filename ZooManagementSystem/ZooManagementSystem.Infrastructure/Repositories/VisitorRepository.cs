using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Repositories;

public class VisitorRepository : MongoRepository<Visitor>, IVisitorRepository
{
    public VisitorRepository(MongoDbContext context) : base(context, "Visitors")
    {
    }
}
