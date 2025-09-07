# Search integration

The app exposes a unified search endpoint and a chat command to quickly research topics.

## Providers
- serpapi (Google via SerpAPI)
- perplexity (Perplexity API chat/completions)
- mastra-serp (SerpAPI via Mastra tool)
- mastra-perplexity (Perplexity via Mastra MCP client)
- mock (built-in fallback)

Auto selection order: Mastra Perplexity MCP → SerpAPI → Perplexity → Mastra SerpAPI → Mock.

Env vars:
- SERPAPI_KEY
- PERPLEXITY_API_KEY

MCP configuration:
- PERPLEXITY_MCP_URL (HTTP URL for Perplexity MCP server)
- PERPLEXITY_MCP_COMMAND (command to start Perplexity MCP server, defaults to "npx")
- PERPLEXITY_MCP_ARGS (JSON array of arguments, defaults to ["-y", "server-perplexity-ask"])

## API
- GET /api/search?q=<query>&provider=auto|serpapi|perplexity|mock
- POST /api/search { "query": "...", "provider": "auto" }

Response shape:
```json
{
  "provider": "serpapi|perplexity|mastra-serp|mastra-perplexity|mock",
  "results": [
    { "title": "...", "url": "...", "snippet": "...", "source": "serpapi|perplexity|mastra-serp|mastra-perplexity|mock", "position": 1 }
  ],
  "tookMs": 123,
  "error": "optional"
}
```

## Troubleshooting

If you encounter issues with the Mastra Perplexity MCP adapter:
- Ensure PERPLEXITY_API_KEY is set in your environment
- Verify the MCP server is accessible via the configured URL or command
- Check that the Perplexity MCP server exposes a search tool (typically named "search" or "perplexity_search")
- The adapter will automatically try different parameter formats (query vs q) if the first attempt fails

## UI trigger
- In `components/chat/chat-interface.tsx`, typing `/search <query>` sends a request to `/api/search` and renders results as markdown in the chat via `MarkdownRenderer`.
- Non-/search messages continue to use the demo simulated AI response.
