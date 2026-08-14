using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Exceptions;
using ZooManagementSystem.Application.Interfaces;
using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.Application.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _tickets;

    public TicketService(ITicketRepository tickets)
    {
        _tickets = tickets;
    }

    public async Task<IReadOnlyList<TicketDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return (await _tickets.GetAllAsync(cancellationToken)).Select(ToDto).ToList();
    }

    public async Task<TicketDto> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return ToDto(await GetTicketAsync(id, cancellationToken));
    }

    public async Task<TicketDto> CreateAsync(CreateTicketDto dto, CancellationToken cancellationToken = default)
    {
        var ticket = new Ticket(dto.VisitorName, dto.TicketType, dto.Price, dto.VisitDate);
        await _tickets.CreateAsync(ticket, cancellationToken);
        return ToDto(ticket);
    }

    public async Task<TicketDto> UpdateAsync(string id, UpdateTicketDto dto, CancellationToken cancellationToken = default)
    {
        var ticket = await GetTicketAsync(id, cancellationToken);
        ticket.VisitorName = dto.VisitorName;
        ticket.TicketType = dto.TicketType;
        ticket.Price = dto.Price;
        ticket.VisitDate = dto.VisitDate;
        await _tickets.UpdateAsync(id, ticket, cancellationToken);
        return ToDto(ticket);
    }

    public async Task DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (!await _tickets.DeleteAsync(id, cancellationToken))
        {
            throw new NotFoundException($"Ticket '{id}' was not found.");
        }
    }

    private async Task<Ticket> GetTicketAsync(string id, CancellationToken cancellationToken)
    {
        return await _tickets.GetByIdAsync(id, cancellationToken) ?? throw new NotFoundException($"Ticket '{id}' was not found.");
    }

    private static TicketDto ToDto(Ticket ticket)
    {
        return new TicketDto(ticket.Id, ticket.VisitorName, ticket.TicketType, ticket.Price, ticket.VisitDate);
    }
}
