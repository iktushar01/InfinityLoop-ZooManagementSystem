using ZooManagementSystem.Application.DTOs;

namespace ZooManagementSystem.Application.Interfaces;

public interface IEnclosureService
{
    Task<IReadOnlyList<EnclosureDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<EnclosureDto> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<EnclosureDto> CreateAsync(CreateEnclosureDto dto, CancellationToken cancellationToken = default);
    Task<EnclosureDto> UpdateAsync(string id, UpdateEnclosureDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(string id, CancellationToken cancellationToken = default);
}
