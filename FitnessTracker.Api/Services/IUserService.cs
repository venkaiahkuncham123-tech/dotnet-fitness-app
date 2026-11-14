using FitnessTracker.Api.Models;

namespace FitnessTracker.Api.Services;

public interface IUserService
{
    Task<List<User>> GetAllAsync();
    Task<User?> GetByIdAsync(string id);
    Task<User> CreateAsync(UserCreateRequest request);
    Task<bool> UpdateAsync(string id, UserUpdateRequest request);
    Task<bool> DeleteAsync(string id);
}