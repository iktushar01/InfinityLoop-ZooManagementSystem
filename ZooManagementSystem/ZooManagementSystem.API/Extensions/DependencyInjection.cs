using Microsoft.OpenApi;
using ZooManagementSystem.Application.Interfaces;
using ZooManagementSystem.Application.Services;
using ZooManagementSystem.Infrastructure.Interfaces;
using ZooManagementSystem.Infrastructure.MongoDb;
using ZooManagementSystem.Infrastructure.Repositories;

namespace ZooManagementSystem.API.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddZooManagement(this IServiceCollection services, IConfiguration configuration)
    {
        var settings = new MongoDbSettings
        {
            ConnectionString = configuration["MongoDb:ConnectionString"] ?? Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") ?? "mongodb://localhost:27017",
            DatabaseName = configuration["MongoDb:DatabaseName"] ?? Environment.GetEnvironmentVariable("MONGODB_DATABASE") ?? "ZooManagementSystem"
        };

        services.AddSingleton(settings);
        services.AddSingleton<MongoDbContext>();
        services.AddScoped<IAnimalRepository, AnimalRepository>();
        services.AddScoped<IKeeperRepository, KeeperRepository>();
        services.AddScoped<IEnclosureRepository, EnclosureRepository>();
        services.AddScoped<ITicketRepository, TicketRepository>();
        services.AddScoped<IVisitorRepository, VisitorRepository>();
        services.AddScoped<IAnimalService, AnimalService>();
        services.AddScoped<IKeeperService, KeeperService>();
        services.AddScoped<IEnclosureService, EnclosureService>();
        services.AddScoped<ITicketService, TicketService>();
        services.AddScoped<IZooService, ZooService>();
        return services;
    }
}
