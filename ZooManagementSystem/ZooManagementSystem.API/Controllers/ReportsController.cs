using Microsoft.AspNetCore.Mvc;
using ZooManagementSystem.Application.DTOs;
using ZooManagementSystem.Application.Interfaces;

namespace ZooManagementSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IZooService _zoo;

    public ReportsController(IZooService zoo)
    {
        _zoo = zoo;
    }

    [HttpGet("animals")]
    public async Task<ActionResult<AnimalReportDto>> AnimalReport(CancellationToken cancellationToken)
    {
        return Ok(await _zoo.GenerateAnimalReportAsync(cancellationToken));
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<RevenueReportDto>> RevenueReport(CancellationToken cancellationToken)
    {
        return Ok(await _zoo.GenerateRevenueReportAsync(cancellationToken));
    }

    [HttpGet("visitors")]
    public async Task<ActionResult<VisitorReportDto>> VisitorReport(CancellationToken cancellationToken)
    {
        return Ok(await _zoo.GenerateVisitorReportAsync(cancellationToken));
    }

    [HttpGet("food-requirements")]
    public async Task<ActionResult<FoodRequirementReportDto>> FoodRequirementReport(CancellationToken cancellationToken)
    {
        return Ok(await _zoo.GenerateFoodRequirementReportAsync(cancellationToken));
    }
}
