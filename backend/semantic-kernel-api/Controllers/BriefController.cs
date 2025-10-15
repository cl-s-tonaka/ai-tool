using Microsoft.AspNetCore.Mvc;
using SemanticKernelApi.Models;
using SemanticKernelApi.Services;

namespace SemanticKernelApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BriefController : ControllerBase
{
    private readonly SemanticKernelService _sk;
    public BriefController(SemanticKernelService sk) => _sk = sk;

    [HttpPost("ideas")]
    public async Task<ActionResult<IdeaResponse>> GenerateIdeas([FromBody] BriefInput input, CancellationToken ct)
    {
        // Placeholder: use SK to produce ideas from brief summary
        var summary = await _sk.SummarizeAsync($"Domain:{input.Domain}; Target:{input.Target}; Strength:{input.Strength}; Hint:{input.Hint}", ct);
        var ideas = new List<IdeaCandidate>
        {
            new("idea-1", "Idea A", $"From summary: {summary}"),
            new("idea-2", "Idea B", $"From summary: {summary}"),
        };
        var hash = string.Join('-', new[]{input.Domain, input.Target, input.Strength, input.Hint ?? string.Empty}).Replace(' ', '-').ToLowerInvariant();
        return Ok(new IdeaResponse(hash, ideas));
    }
}
