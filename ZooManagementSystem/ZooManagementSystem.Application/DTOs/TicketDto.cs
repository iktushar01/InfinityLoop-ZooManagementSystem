using ZooManagementSystem.Domain.Enums;

namespace ZooManagementSystem.Application.DTOs;

public record TicketDto(string? Id, string VisitorName, TicketType TicketType, decimal Price, DateOnly VisitDate);

public record CreateTicketDto(string VisitorName, TicketType TicketType, decimal Price, DateOnly VisitDate);

public record UpdateTicketDto(string VisitorName, TicketType TicketType, decimal Price, DateOnly VisitDate);
