# Environment setup

Create a .env.local file in the project root with any real provider keys:

SERPAPI_KEY=your_serpapi_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

# Optional MCP configuration for Perplexity
# If not set, falls back to npx server-perplexity-ask
PERPLEXITY_MCP_URL=
# OR
PERPLEXITY_MCP_COMMAND=
PERPLEXITY_MCP_ARGS=

Notes:
- If no keys are set, the app falls back to a mock search adapter.
- The search API will auto-select the first configured provider (Mastra Perplexity MCP, then SerpAPI, then Perplexity REST, then Mastra SerpAPI, else mock).
- Do NOT commit real keys. Use .env.local locally and Vercel project env vars in deployment.
