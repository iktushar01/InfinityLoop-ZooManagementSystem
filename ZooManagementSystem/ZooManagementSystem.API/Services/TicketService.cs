using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.API.Services;

public class TicketService : ZooManagementSystem.Application.Services.TicketService
{
    public TicketService(ITicketRepository tickets) : base(tickets)
    {
    }
}
