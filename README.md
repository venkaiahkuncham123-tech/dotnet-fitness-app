# Fitness Tracker API

.NET 8 CRUD Web API with MongoDB for fitness tracking. Manage users and workouts with embedded exercises and sets.

## 📁 Project Structure

```
FitnessTracker.Api/
├── Controllers/    UsersController, WorkoutsController
├── Data/           MongoDbContext
├── Models/         User, Workout, MongoDbSettings, DTOs
├── Services/       IUserService, UserService, IWorkoutService, WorkoutService
├── appsettings.json
├── appsettings.Development.json
├── Dockerfile
├── FitnessTracker.Api.csproj
└── Program.cs
```

## 🚀 Quick Start

**Prerequisites:** .NET 8 SDK, MongoDB (local or Atlas), Docker (optional)

### Option 1: Local .NET

```powershell
cd d:\Projects\dotnet-crud\FitnessTracker.Api\
dotnet restore
dotnet build
dotnet run
```

API: `https://localhost:5001` | Swagger: `https://localhost:5001/swagger`

Update `appsettings.json` for your MongoDB connection string.

### Option 2: Docker

From `d:\Projects\dotnet-crud\`:

```powershell
docker-compose up --build          # Build and start API + MongoDB
docker-compose up -d              # Run in background
docker-compose logs -f            # View logs
docker-compose down               # Stop containers
docker-compose down -v            # Stop and delete data volume
```

API: `http://localhost:8080` | Swagger: `http://localhost:8080/swagger`

## 📡 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | List all workouts |
| GET | `/api/workouts/{id}` | Get workout by ID |
| GET | `/api/workouts/user/{userId}` | Get workouts for user |
| POST | `/api/workouts` | Create workout |
| PUT | `/api/workouts/{id}` | Update workout |
| DELETE | `/api/workouts/{id}` | Delete workout |

## 📝 Examples

**Create user:**
```bash
curl -X POST "https://localhost:5001/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Smith","email":"alice@example.com"}'
```

**Create workout:**
```bash
curl -X POST "https://localhost:5001/api/workouts" \
  -H "Content-Type: application/json" \
  -d '{"userId":"<ID>","name":"Bench Press","date":"2026-11-08","durationMinutes":45,"caloriesBurned":320,"notes":"","exercises":[{"name":"Bench Press","muscleGroup":"Chest","sets":[{"reps":10,"weightKg":60,"restSeconds":90}]}]}'
```

**Workouts by user:**
```bash
curl "https://localhost:5001/api/workouts/user/<USER_ID>"
```

## ☁️ Deployment

### Azure App Service + Cosmos DB
1. `dotnet publish -c Release -o ./publish`
2. Deploy to Azure App Service
3. Add App Settings: `MongoDbSettings__ConnectionString`, `MongoDbSettings__DatabaseName`, `ASPNETCORE_ENVIRONMENT=Production`

### Docker on Linux Server
```bash
docker-compose up -d
```

### Manual .NET Hosting
```powershell
dotnet publish -c Release -o ./publish
dotnet FitnessTracker.Api.dll
```

## 🗄️ MongoDB Collections

- `users` — user profiles
- `workouts` — workout sessions with embedded exercises/sets

## 🛠️ Development

1. Add models under `Models\` with `[BsonId]`, `[BsonElement]`, `[JsonPropertyName]` attributes
2. Add service interface + implementation under `Services\`
3. Add controller under `Controllers\`
4. Register services in `Program.cs`
5. Run tests: `dotnet test`

## 📄 License

MIT

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `dotnet` not found | Install .NET 8 SDK |
| MongoDB connection refused | Verify MongoDB is running on port 27017 |
| Docker build fails | Check Docker Desktop is running |
| 404 on endpoints | Verify route and HTTP method |
| Swagger missing | Check `ASPNETCORE_ENVIRONMENT=Development` |

*Updated: November 8, 2026*