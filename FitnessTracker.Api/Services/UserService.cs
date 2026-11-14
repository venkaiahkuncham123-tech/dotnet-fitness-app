using MongoDB.Driver;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Data;

namespace FitnessTracker.Api.Services;

public class UserService : IUserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(MongoDbContext context)
    {
        _users = context.Users;
    }

    public async Task<List<User>> GetAllAsync() =>
        await _users.Find(_ => true).ToListAsync();

    public async Task<User?> GetByIdAsync(string id) =>
        await _users.Find(u => u.Id == id).FirstOrDefaultAsync();

    public async Task<User> CreateAsync(UserCreateRequest request)
    {
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task<bool> UpdateAsync(string id, UserUpdateRequest request)
    {
        var update = Builders<User>.Update
            .Set(u => u.Name, request.Name)
            .Set(u => u.Email, request.Email)
            .Set(u => u.UpdatedAt, DateTime.UtcNow);

        var result = await _users.UpdateOneAsync(u => u.Id == id, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _users.DeleteOneAsync(u => u.Id == id);
        return result.DeletedCount > 0;
    }
}