using Microsoft.AspNetCore.Mvc;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Services;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class WorkoutsController : ControllerBase
{
    private readonly IWorkoutService _workoutService;

    public WorkoutsController(IWorkoutService workoutService)
    {
        _workoutService = workoutService;
    }

    /// <summary>
    /// Get all workouts.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<Workout>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<Workout>>> GetAll()
    {
        var workouts = await _workoutService.GetAllAsync();
        return Ok(workouts);
    }

    /// <summary>
    /// Get a workout by ID.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Workout), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Workout>> GetById(string id)
    {
        var workout = await _workoutService.GetByIdAsync(id);
        if (workout is null)
            return NotFound();

        return Ok(workout);
    }

    /// <summary>
    /// Get all workouts for a specific user.
    /// </summary>
    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(List<Workout>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<Workout>>> GetByUserId(string userId)
    {
        var workouts = await _workoutService.GetByUserIdAsync(userId);
        return Ok(workouts);
    }

    /// <summary>
    /// Create a new workout.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(Workout), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Workout>> Create(WorkoutCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var workout = await _workoutService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = workout.Id }, workout);
    }

    /// <summary>
    /// Update an existing workout.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(string id, WorkoutUpdateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _workoutService.UpdateAsync(id, request);
        if (!updated)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Delete a workout by ID.
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _workoutService.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }
}