using ZooManagementSystem.Domain.Abstract;

namespace ZooManagementSystem.Domain.Models;

public class Visitor : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public List<string> TicketIds { get; set; } = [];
}
