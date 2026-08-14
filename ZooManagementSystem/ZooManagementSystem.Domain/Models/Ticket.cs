using ZooManagementSystem.Domain.Abstract;
using ZooManagementSystem.Domain.Enums;

namespace ZooManagementSystem.Domain.Models;

public class Ticket : BaseEntity
{
    private decimal _price;

    public string VisitorName { get; set; } = string.Empty;
    public TicketType TicketType { get; set; }
    public decimal Price
    {
        get => _price;
        set => _price = value >= 0 ? value : throw new ArgumentOutOfRangeException(nameof(value), "Ticket price cannot be negative.");
    }

    public DateOnly VisitDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);

    public Ticket()
    {
    }

    public Ticket(string visitorName, TicketType ticketType, decimal price, DateOnly visitDate)
    {
        VisitorName = string.IsNullOrWhiteSpace(visitorName) ? throw new ArgumentException("Visitor name is required.", nameof(visitorName)) : visitorName;
        TicketType = ticketType;
        Price = price;
        VisitDate = visitDate;
    }
}
