using Microsoft.AspNetCore.Mvc;
using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Interfaces;

namespace ZooManagementSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnimalsController : ControllerBase
{
    private readonly IAnimalService _animals;

    public AnimalsController(IAnimalService animals)
    {
        _animals = animals;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AnimalDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _animals.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AnimalDto>> GetById(string id, CancellationToken cancellationToken)
    {
        return Ok(await _animals.GetByIdAsync(id, cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<AnimalDto>> Create(CreateAnimalDto dto, CancellationToken cancellationToken)
    {
        var animal = await _animals.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = animal.Id }, animal);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AnimalDto>> Update(string id, UpdateAnimalDto dto, CancellationToken cancellationToken)
    {
        return Ok(await _animals.UpdateAsync(id, dto, cancellationToken));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        await _animals.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPost("{animalId}/keeper/{keeperId}")]
    public async Task<ActionResult<AnimalDto>> AssignKeeper(string animalId, string keeperId, CancellationToken cancellationToken)
    {
        return Ok(await _animals.AssignKeeperAsync(animalId, keeperId, cancellationToken));
    }

    [HttpPost("{animalId}/enclosure/{enclosureId}")]
    public async Task<ActionResult<AnimalDto>> AssignEnclosure(string animalId, string enclosureId, CancellationToken cancellationToken)
    {
        return Ok(await _animals.AssignEnclosureAsync(animalId, enclosureId, cancellationToken));
    }

    [HttpPost("{id}/feed")]
    public async Task<ActionResult<object>> Feed(string id, FeedingScheduleDto dto, CancellationToken cancellationToken)
    {
        return Ok(new { message = await _animals.FeedAsync(id, dto, cancellationToken) });
    }

    [HttpPost("{id}/health-check")]
    public async Task<ActionResult<object>> HealthCheck(string id, HealthRecordDto dto, CancellationToken cancellationToken)
    {
        return Ok(new { message = await _animals.CheckHealthAsync(id, dto, cancellationToken) });
    }
}
