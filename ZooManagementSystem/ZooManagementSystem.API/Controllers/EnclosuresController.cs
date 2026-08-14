using Microsoft.AspNetCore.Mvc;
using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Interfaces;

namespace ZooManagementSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnclosuresController : ControllerBase
{
    private readonly IEnclosureService _enclosures;

    public EnclosuresController(IEnclosureService enclosures)
    {
        _enclosures = enclosures;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EnclosureDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _enclosures.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EnclosureDto>> GetById(string id, CancellationToken cancellationToken)
    {
        return Ok(await _enclosures.GetByIdAsync(id, cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<EnclosureDto>> Create(CreateEnclosureDto dto, CancellationToken cancellationToken)
    {
        var enclosure = await _enclosures.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = enclosure.Id }, enclosure);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<EnclosureDto>> Update(string id, UpdateEnclosureDto dto, CancellationToken cancellationToken)
    {
        return Ok(await _enclosures.UpdateAsync(id, dto, cancellationToken));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        await _enclosures.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
