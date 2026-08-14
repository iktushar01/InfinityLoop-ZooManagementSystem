using ZooManagementSystem.Application.DTOs;

namespace ZooManagementSystem.Application.Interfaces;

public interface IAnimalService
{
    Task<IReadOnlyList<AnimalDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<AnimalDto> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<AnimalDto> CreateAsync(CreateAnimalDto dto, CancellationToken cancellationToken = default);
    Task<AnimalDto> UpdateAsync(string id, UpdateAnimalDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(string id, CancellationToken cancellationToken = default);
    Task<AnimalDto> AssignKeeperAsync(string animalId, string keeperId, CancellationToken cancellationToken = default);
    Task<AnimalDto> AssignEnclosureAsync(string animalId, string enclosureId, CancellationToken cancellationToken = default);
    Task<string> FeedAsync(string animalId, FeedingScheduleDto dto, CancellationToken cancellationToken = default);
    Task<string> CheckHealthAsync(string animalId, HealthRecordDto dto, CancellationToken cancellationToken = default);
}
