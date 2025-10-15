# Semantic Kernel API (C# / .NET 8)

## Prerequisites
- .NET SDK 8.x
- OPENAI_API_KEY (or Azure OpenAI)

## Run
```bash
cd backend/semantic-kernel-api
 dotnet restore
 dotnet run
```
- Swagger: shown in console (or https://localhost:5001/swagger)

## Env
- OPENAI_API_KEY=your-key
- OPENAI_MODEL=gpt-4o-mini (default)

## Endpoints
- POST /api/brief/ideas : Generate ideas from brief

## Notes
- Semantic Kernel is initialized if OPENAI_API_KEY is present; otherwise returns placeholders.
