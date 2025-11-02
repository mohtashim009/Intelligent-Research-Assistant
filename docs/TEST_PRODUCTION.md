# Test Production Build

## Quick Test Steps

### 1. Build
```bash
npm run build
```
**Expected**: Clean build, no MCP errors ✅

### 2. Start Production Server
```bash
npm start
```
**Expected**: Server starts on http://localhost:3000

### 3. Make a Research Query
1. Open http://localhost:3000 in browser
2. Type a research query (e.g., "network intrusion detection using ML")
3. Send the query

**Expected Console Output**:
```
Research API route called
Research query received: network intrusion detection using ML
🔄 Research agent not initialized, initializing now...
🚀 Initializing MCP client...
⏳ Waiting for MCP server to start...
� Fetching MCP tools...
✅ MCP Tools loaded: [perplexity_perplexity_search, perplexity_perplexity_ask, ...]
✅ SerpAPI Tools loaded: [googleSearch, googleScholar, googleNews, ...]
✅ Research agent initialized successfully
🔬 Starting Deep Research...
📝 Query: network intrusion detection using ML
⏰ Started at: [timestamp]
🔧 Tool Call #1: [tool name]
✅ Tool Result #1: [results]
💭 Agent Thinking: [response]
✨ Research Complete!
```

### 4. Make Another Query
Send another research query

**Expected**: Should be fast (no initialization), uses cached agent

## What Fixed It

**Before**:
```typescript
// ❌ Blocked runtime initialization in production
if (process.env.NODE_ENV === 'production' && !process.env.RUNTIME_INIT) {
  return;
}
```

**After**:
```typescript
// ✅ Only blocks during build, allows runtime initialization
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return;
}
```

## Troubleshooting

### If you still see "Skipping MCP initialization during build" at runtime:

1. **Check environment variables**:
   ```bash
   echo $NEXT_PHASE
   # Should be empty/undefined at runtime
   ```

2. **Rebuild**:
   ```bash
   rm -rf .next
   npm run build
   npm start
   ```

3. **Check API keys are set**:
   ```bash
   # In .env.local
   PERPLEXITY_API_KEY=xxx
   SERPAPI_KEY=xxx
   GOOGLE_GENERATIVE_AI_API_KEY=xxx
   ```

### If MCP initialization fails:

Check the error message:
- **"PERPLEXITY_API_KEY not found"**: Set the API key in .env.local
- **"Connection refused"**: Check network/firewall
- **"Module not found"**: Run `npm install`

## Success Criteria

- ✅ Build completes without errors
- ✅ No MCP logs during build
- ✅ First request initializes MCP successfully
- ✅ Subsequent requests are fast
- ✅ Research queries return results
- ✅ Export buttons work

## Ready for Deployment

Once all tests pass, you can deploy to:
- Vercel: `vercel --prod`
- Netlify: `netlify deploy --prod`
- Docker: Build and run container
- Any Node.js hosting platform

The system will automatically:
1. Build cleanly (no MCP during build)
2. Initialize MCP on first request (at runtime)
3. Reuse the agent for all subsequent requests
