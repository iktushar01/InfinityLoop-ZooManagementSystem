using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.API.Services;

public class EnclosureService : ZooManagementSystem.Application.Services.EnclosureService
{
    public EnclosureService(IEnclosureRepository enclosures) : base(enclosures)
    {
    }
}
