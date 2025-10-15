namespace SemanticKernelApi.Models;

public record BriefInput(string Domain, string Target, string Strength, string? Hint);
public record IdeaCandidate(string Id, string Title, string Pitch);
public record IdeaResponse(string BriefHash, List<IdeaCandidate> Ideas);
