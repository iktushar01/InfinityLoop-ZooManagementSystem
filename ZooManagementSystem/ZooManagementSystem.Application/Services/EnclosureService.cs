using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Exceptions;
using ZooManagementSystem.Application.Interfaces;
using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.Application.Services;

public class EnclosureService : IEnclosureService
{
    private readonly IEnclosureRepository _enclosures;

    public EnclosureService(IEnclosureRepository enclosures)
    {
        _enclosures = enclosures;
    }

    public async Task<IReadOnlyList<EnclosureDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return (await _enclosures.GetAllAsync(cancellationToken)).Select(ToDto).ToList();
    }

    public async Task<EnclosureDto> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return ToDto(await GetEnclosureAsync(id, cancellationToken));
    }

    public async Task<EnclosureDto> CreateAsync(CreateEnclosureDto dto, CancellationToken cancellationToken = default)
    {
        var enclosure = new Enclosure(dto.Name, dto.Capacity, dto.HabitatType);
        await _enclosures.CreateAsync(enclosure, cancellationToken);
        return ToDto(enclosure);
    }

    public async Task<EnclosureDto> UpdateAsync(string id, UpdateEnclosureDto dto, CancellationToken cancellationToken = default)
    {
        var enclosure = await GetEnclosureAsync(id, cancellationToken);
        enclosure.Name = dto.Name;
        enclosure.Capacity = dto.Capacity;
        enclosure.HabitatType = dto.HabitatType;
        await _enclosures.UpdateAsync(id, enclosure, cancellationToken);
        return ToDto(enclosure);
    }

    public async Task DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (!await _enclosures.DeleteAsync(id, cancellationToken))
        {
            throw new NotFoundException($"Enclosure '{id}' was not found.");
        }
    }

    private async Task<Enclosure> GetEnclosureAsync(string id, CancellationToken cancellationToken)
    {
        return await _enclosures.GetByIdAsync(id, cancellationToken) ?? throw new NotFoundException($"Enclosure '{id}' was not found.");
    }

    private static EnclosureDto ToDto(Enclosure enclosure)
    {
        return new EnclosureDto(enclosure.Id, enclosure.Name, enclosure.Capacity, enclosure.HabitatType, enclosure.Animals, enclosure.IsFull());
    }
}
