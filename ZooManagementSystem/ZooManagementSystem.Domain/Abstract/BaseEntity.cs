using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ZooManagementSystem.Domain.Abstract;

public abstract class BaseEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
}
