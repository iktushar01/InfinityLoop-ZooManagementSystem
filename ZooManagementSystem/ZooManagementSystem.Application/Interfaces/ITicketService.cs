using ZooManagementSystem.Application.DTOs;

namespace ZooManagementSystem.Application.Interfaces;

public interface ITicketService
{
    Task<IReadOnlyList<TicketDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TicketDto> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<TicketDto> CreateAsync(CreateTicketDto dto, CancellationToken cancellationToken = default);
    Task<TicketDto> UpdateAsync(string id, UpdateTicketDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(string id, CancellationToken cancellationToken = default);
}
