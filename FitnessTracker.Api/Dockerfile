# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["FitnessTracker.Api/FitnessTracker.Api.csproj", "FitnessTracker.Api/"]
RUN dotnet restore "FitnessTracker.Api/FitnessTracker.Api.csproj"
COPY . .
WORKDIR /src/FitnessTracker.Api
RUN dotnet publish "FitnessTracker.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS="http://+:8080"
ENV ASPNETCORE_ENVIRONMENT="Production"
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FitnessTracker.Api.dll"]