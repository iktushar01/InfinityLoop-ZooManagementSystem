using Microsoft.AspNetCore.Mvc;
using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Interfaces;

namespace ZooManagementSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KeepersController : ControllerBase
{
    private readonly IKeeperService _keepers;

    public KeepersController(IKeeperService keepers)
    {
        _keepers = keepers;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<KeeperDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _keepers.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<KeeperDto>> GetById(string id, CancellationToken cancellationToken)
    {
        return Ok(await _keepers.GetByIdAsync(id, cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<KeeperDto>> Create(CreateKeeperDto dto, CancellationToken cancellationToken)
    {
        var keeper = await _keepers.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = keeper.Id }, keeper);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<KeeperDto>> Update(string id, UpdateKeeperDto dto, CancellationToken cancellationToken)
    {
        return Ok(await _keepers.UpdateAsync(id, dto, cancellationToken));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        await _keepers.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
