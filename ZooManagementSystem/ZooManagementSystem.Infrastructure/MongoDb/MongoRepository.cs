using System.Linq.Expressions;
using MongoDB.Driver;
using ZooManagementSystem.Domain.Abstract;

namespace ZooManagementSystem.Infrastructure.MongoDb;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";
    public string DatabaseName { get; set; } = "ZooManagementSystem";
}

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(MongoDbSettings settings)
    {
        var client = new MongoClient(string.IsNullOrWhiteSpace(settings.ConnectionString) ? "mongodb://localhost:27017" : settings.ConnectionString);
        _database = client.GetDatabase(string.IsNullOrWhiteSpace(settings.DatabaseName) ? "ZooManagementSystem" : settings.DatabaseName);
    }

    public IMongoCollection<T> Collection<T>(string name) => _database.GetCollection<T>(name);
}

public interface IMongoRepository<T> where T : BaseEntity
{
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<T?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
    Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(string id, T entity, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}

public class MongoRepository<T> : IMongoRepository<T> where T : BaseEntity
{
    protected readonly IMongoCollection<T> Collection;

    public MongoRepository(MongoDbContext context, string collectionName)
    {
        Collection = context.Collection<T>(collectionName);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await Collection.Find(_ => true).ToListAsync(cancellationToken);
    }

    public async Task<T?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await Collection.Find(entity => entity.Id == id).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await Collection.Find(predicate).ToListAsync(cancellationToken);
    }

    public async Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default)
    {
        await Collection.InsertOneAsync(entity, cancellationToken: cancellationToken);
        return entity;
    }

    public async Task<bool> UpdateAsync(string id, T entity, CancellationToken cancellationToken = default)
    {
        entity.Id = id;
        var result = await Collection.ReplaceOneAsync(item => item.Id == id, entity, cancellationToken: cancellationToken);
        return result.ModifiedCount > 0 || result.MatchedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var result = await Collection.DeleteOneAsync(entity => entity.Id == id, cancellationToken);
        return result.DeletedCount > 0;
    }
}
