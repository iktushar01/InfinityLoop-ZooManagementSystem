using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;
using ZooManagementSystem.Infrastructure.MongoDb;

namespace ZooManagementSystem.Infrastructure.Repositories;

public class TicketRepository : MongoRepository<Ticket>, ITicketRepository
{
    public TicketRepository(MongoDbContext context) : base(context, "Tickets")
    {
    }
}
