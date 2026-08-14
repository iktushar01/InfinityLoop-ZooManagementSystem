namespace ZooManagementSystem.Application.DTOs;

public record EnclosureDto(string? Id, string Name, int Capacity, string HabitatType, IReadOnlyList<string> Animals, bool IsFull);

public record CreateEnclosureDto(string Name, int Capacity, string HabitatType);

public record UpdateEnclosureDto(string Name, int Capacity, string HabitatType);
