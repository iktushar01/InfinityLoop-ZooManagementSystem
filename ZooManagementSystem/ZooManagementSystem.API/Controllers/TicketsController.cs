using Microsoft.AspNetCore.Mvc;
using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Interfaces;

namespace ZooManagementSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _tickets;

    public TicketsController(ITicketService tickets)
    {
        _tickets = tickets;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TicketDto>>> GetAll(CancellationToken cancellationToken)
    {
        return Ok(await _tickets.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketDto>> GetById(string id, CancellationToken cancellationToken)
    {
        return Ok(await _tickets.GetByIdAsync(id, cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<TicketDto>> Create(CreateTicketDto dto, CancellationToken cancellationToken)
    {
        var ticket = await _tickets.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, ticket);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TicketDto>> Update(string id, UpdateTicketDto dto, CancellationToken cancellationToken)
    {
        return Ok(await _tickets.UpdateAsync(id, dto, cancellationToken));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        await _tickets.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
