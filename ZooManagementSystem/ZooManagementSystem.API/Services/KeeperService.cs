using ZooManagementSystem.Infrastructure.Interfaces;

namespace ZooManagementSystem.API.Services;

public class KeeperService : ZooManagementSystem.Application.Services.KeeperService
{
    public KeeperService(IKeeperRepository keepers) : base(keepers)
    {
    }
}
