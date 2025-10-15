using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace SemanticKernelApi.Services;

public class SemanticKernelService
{
    private readonly Kernel _kernel;
    private readonly IChatCompletionService _chat;

    public SemanticKernelService()
    {
        var builder = Kernel.CreateBuilder();
        var modelId = Environment.GetEnvironmentVariable("OPENAI_MODEL") ?? "gpt-4o-mini";
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            builder.AddOpenAIChatCompletion(modelId, apiKey);
        }
        _kernel = builder.Build();
        _chat = _kernel.GetRequiredService<IChatCompletionService>();
    }

    public async Task<string> SummarizeAsync(string input, CancellationToken ct = default)
    {
        var history = new ChatHistory();
        history.AddSystemMessage("You summarize product briefs succinctly.");
        history.AddUserMessage(input);
        var result = await _chat.GetChatMessageContentsAsync(history, kernel: _kernel, cancellationToken: ct);
        return result.LastOrDefault()?.Content ?? string.Empty;
    }
}
