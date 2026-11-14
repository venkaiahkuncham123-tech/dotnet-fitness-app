using MongoDB.Driver;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Data;

namespace FitnessTracker.Api.Services;

public class WorkoutService : IWorkoutService
{
    private readonly IMongoCollection<Workout> _workouts;

    public WorkoutService(MongoDbContext context)
    {
        _workouts = context.Workouts;
    }

    public async Task<List<Workout>> GetAllAsync() =>
        await _workouts.Find(_ => true).SortByDescending(w => w.Date).ToListAsync();

    public async Task<Workout?> GetByIdAsync(string id) =>
        await _workouts.Find(w => w.Id == id).FirstOrDefaultAsync();

    public async Task<List<Workout>> GetByUserIdAsync(string userId) =>
        await _workouts.Find(w => w.UserId == userId)
            .SortByDescending(w => w.Date)
            .ToListAsync();

    public async Task<Workout> CreateAsync(WorkoutCreateRequest request)
    {
        var workout = new Workout
        {
            UserId = request.UserId,
            Name = request.Name,
            Date = request.Date,
            DurationMinutes = request.DurationMinutes,
            CaloriesBurned = request.CaloriesBurned,
            Notes = request.Notes,
            Exercises = request.Exercises,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _workouts.InsertOneAsync(workout);
        return workout;
    }

    public async Task<bool> UpdateAsync(string id, WorkoutUpdateRequest request)
    {
        var update = Builders<Workout>.Update
            .Set(w => w.Name, request.Name)
            .Set(w => w.Date, request.Date)
            .Set(w => w.DurationMinutes, request.DurationMinutes)
            .Set(w => w.CaloriesBurned, request.CaloriesBurned)
            .Set(w => w.Notes, request.Notes)
            .Set(w => w.Exercises, request.Exercises)
            .Set(w => w.UpdatedAt, DateTime.UtcNow);

        var result = await _workouts.UpdateOneAsync(w => w.Id == id, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _workouts.DeleteOneAsync(w => w.Id == id);
        return result.DeletedCount > 0;
    }
}