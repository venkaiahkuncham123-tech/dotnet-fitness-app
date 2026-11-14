using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Services;

public interface IWorkoutService
{
    Task<List<Workout>> GetAllAsync();
    Task<Workout?> GetByIdAsync(string id);
    Task<List<Workout>> GetByUserIdAsync(string userId);
    Task<Workout> CreateAsync(WorkoutCreateRequest request);
    Task<bool> UpdateAsync(string id, WorkoutUpdateRequest request);
    Task<bool> DeleteAsync(string id);
}