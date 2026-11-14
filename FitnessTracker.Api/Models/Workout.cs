using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace FitnessTracker.Api.Models;

public class Workout
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("date")]
    [JsonPropertyName("date")]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [BsonElement("durationMinutes")]
    [JsonPropertyName("durationMinutes")]
    public int DurationMinutes { get; set; }

    [BsonElement("caloriesBurned")]
    [JsonPropertyName("caloriesBurned")]
    public int CaloriesBurned { get; set; }

    [BsonElement("notes")]
    [JsonPropertyName("notes")]
    public string Notes { get; set; } = string.Empty;

    [BsonElement("exercises")]
    [JsonPropertyName("exercises")]
    public List<ExerciseEntry> Exercises { get; set; } = new();

    [BsonElement("createdAt")]
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class ExerciseEntry
{
    [BsonElement("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("muscleGroup")]
    [JsonPropertyName("muscleGroup")]
    public string MuscleGroup { get; set; } = string.Empty;

    [BsonElement("sets")]
    [JsonPropertyName("sets")]
    public List<SetEntry> Sets { get; set; } = new();
}

public class SetEntry
{
    [BsonElement("reps")]
    [JsonPropertyName("reps")]
    public int Reps { get; set; }

    [BsonElement("weightKg")]
    [JsonPropertyName("weightKg")]
    public double WeightKg { get; set; }

    [BsonElement("restSeconds")]
    [JsonPropertyName("restSeconds")]
    public int RestSeconds { get; set; }
}

public class WorkoutCreateRequest
{
    [JsonPropertyName("userId")]
    public string UserId { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("durationMinutes")]
    public int DurationMinutes { get; set; }

    [JsonPropertyName("caloriesBurned")]
    public int CaloriesBurned { get; set; }

    [JsonPropertyName("notes")]
    public string Notes { get; set; } = string.Empty;

    [JsonPropertyName("exercises")]
    public List<ExerciseEntry> Exercises { get; set; } = new();
}

public class WorkoutUpdateRequest
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public DateTime Date { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("durationMinutes")]
    public int DurationMinutes { get; set; }

    [JsonPropertyName("caloriesBurned")]
    public int CaloriesBurned { get; set; }

    [JsonPropertyName("notes")]
    public string Notes { get; set; } = string.Empty;

    [JsonPropertyName("exercises")]
    public List<ExerciseEntry> Exercises { get; set; } = new();
}