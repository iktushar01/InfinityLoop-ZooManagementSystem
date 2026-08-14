namespace ZooManagementSystem.Application.DTOs;

public record KeeperDto(string? Id, string Name, int Age, string Phone, string Email, IReadOnlyList<string> AssignedAnimals);

public record CreateKeeperDto(string Name, int Age, string Phone, string Email);

public record UpdateKeeperDto(string Name, int Age, string Phone, string Email);
