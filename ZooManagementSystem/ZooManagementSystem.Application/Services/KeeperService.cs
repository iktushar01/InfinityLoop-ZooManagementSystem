using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Exceptions;
using ZooManagementSystem.Application.Interfaces;
using ZooManagementSystem.Domain.Models;
using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.Application.Services;

public class KeeperService : IKeeperService
{
    private readonly IKeeperRepository _keepers;

    public KeeperService(IKeeperRepository keepers)
    {
        _keepers = keepers;
    }

    public async Task<IReadOnlyList<KeeperDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return (await _keepers.GetAllAsync(cancellationToken)).Select(ToDto).ToList();
    }

    public async Task<KeeperDto> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return ToDto(await GetKeeperAsync(id, cancellationToken));
    }

    public async Task<KeeperDto> CreateAsync(CreateKeeperDto dto, CancellationToken cancellationToken = default)
    {
        var keeper = new Keeper(dto.Name, dto.Age, dto.Phone, dto.Email);
        await _keepers.CreateAsync(keeper, cancellationToken);
        return ToDto(keeper);
    }

    public async Task<KeeperDto> UpdateAsync(string id, UpdateKeeperDto dto, CancellationToken cancellationToken = default)
    {
        var keeper = await GetKeeperAsync(id, cancellationToken);
        keeper.Name = dto.Name;
        keeper.Age = dto.Age;
        keeper.Phone = dto.Phone;
        keeper.Email = dto.Email;
        await _keepers.UpdateAsync(id, keeper, cancellationToken);
        return ToDto(keeper);
    }

    public async Task DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        if (!await _keepers.DeleteAsync(id, cancellationToken))
        {
            throw new NotFoundException($"Keeper '{id}' was not found.");
        }
    }

    private async Task<Keeper> GetKeeperAsync(string id, CancellationToken cancellationToken)
    {
        return await _keepers.GetByIdAsync(id, cancellationToken) ?? throw new NotFoundException($"Keeper '{id}' was not found.");
    }

    private static KeeperDto ToDto(Keeper keeper)
    {
        return new KeeperDto(keeper.Id, keeper.Name, keeper.Age, keeper.Phone, keeper.Email, keeper.AssignedAnimals);
    }
}
