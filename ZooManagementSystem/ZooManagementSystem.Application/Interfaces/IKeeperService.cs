using ZooManagementSystem.Application.DTOs;

namespace ZooManagementSystem.Application.Interfaces;

public interface IKeeperService
{
    Task<IReadOnlyList<KeeperDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<KeeperDto> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<KeeperDto> CreateAsync(CreateKeeperDto dto, CancellationToken cancellationToken = default);
    Task<KeeperDto> UpdateAsync(string id, UpdateKeeperDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(string id, CancellationToken cancellationToken = default);
}
