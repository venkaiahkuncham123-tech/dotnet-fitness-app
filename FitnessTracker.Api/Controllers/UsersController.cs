using Microsoft.AspNetCore.Mvc;
using FitnessTracker.Api.Models;
using FitnessTracker.Api.Services;

namespace FitnessTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get all users.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<User>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<User>>> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    /// <summary>
    /// Get a user by ID.
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<User>> GetById(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user is null)
            return NotFound();

        return Ok(user);
    }

    /// <summary>
    /// Create a new user.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(User), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<User>> Create(UserCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    /// <summary>
    /// Update an existing user.
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(string id, UserUpdateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _userService.UpdateAsync(id, request);
        if (!updated)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Delete a user by ID.
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _userService.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }
}