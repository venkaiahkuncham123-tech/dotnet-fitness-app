using MongoDB.Driver;
using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(MongoDbSettings settings)
    {
        var client = new MongoClient(settings.ConnectionString);
        _database = client.GetDatabase(settings.DatabaseName);
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public IMongoCollection<Workout> Workouts => _database.GetCollection<Workout>("workouts");
}