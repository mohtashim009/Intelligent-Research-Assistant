# Perplexity as Fallback Strategy (Option 2)

## Problem Solved

Google Scholar often returns only paper titles and links without abstracts or content. The agent can't extract information from just metadata, so it needs a way to understand the academic content.

## Solution: Perplexity as Conditional Fallback

Added Perplexity back to the Research Agent, but with **very strict conditions** on when it can be used.

## Tool Priority

### PRIMARY TOOLS (Always Use First):
1. `googleSearch` - General web search
2. `googleScholar` - Academic papers
3. `googleNews` - Recent news
4. `bingSearch` - Alternative search

### FALLBACK TOOL (Use Only When Needed):
5. `perplexity_search` - AI synthesis
   - ⚠️ ONLY when Scholar returns papers WITHOUT abstracts
   - ⚠️ ONLY when you need academic content understanding
   - ⚠️ NEVER as the first tool
   - ⚠️ NEVER when Search/News already have good content

## Expected Behavior

### Scenario 1: Scholar Has Good Abstracts ✅
```
Query: "AI in fintech"

1. 🔍 googleSearch("AI fintech")
   → Gets 10 results with summaries ✓
   
2. 🔍 googleScholar("AI fintech")
   → Gets 10 papers WITH abstracts ✓
   
3. 🔍 googleNews("AI fintech 2024")
   → Gets recent articles ✓
   
4. ✅ Synthesize report
   → NO Perplexity needed!
```

### Scenario 2: Scholar Lacks Abstracts ✅
```
Query: "Quantum computing algorithms"

1. 🔍 googleScholar("quantum algorithms")
   → Gets 10 papers but NO abstracts ✗
   
2. 🔍 googleSearch("quantum algorithms")
   → Gets general context ✓
   
3. 🔍 perplexity_search("quantum computing algorithms academic")
   → Gets academic synthesis ✓
   
4. ✅ Synthesize report
   → Uses Scholar citations + Perplexity content
```

### Scenario 3: Wrong Usage ❌
```
Query: "AI trends"

1. ❌ perplexity_search("AI trends")
   → WRONG! Should start with SerpAPI!
```

## Why This Works

1. **SerpAPI First** - Gets structured data with links and metadata
2. **Evaluate Results** - Agent checks if content is sufficient
3. **Perplexity Only If Needed** - Fills gaps when Scholar lacks abstracts
4. **Best of Both Worlds** - Direct sources + AI synthesis when needed

## Cost Efficiency

- **SerpAPI**: Free tier (100 searches/month)
- **Perplexity**: Only used when necessary (~20-30% of queries)
- **Google Gemini**: Free tier (1500 requests/day)

## Files Modified

1. `lib/mastra/agents/research-agent.ts`
   - Added Perplexity back with strict conditions
   - Updated instructions with clear workflow
   - Added examples of correct/incorrect usage
   - Only exposed `perplexity_search` (not `perplexity_research`)

## Monitoring

Watch the console logs:
```
✅ Good Pattern:
🔍 Using googleSearch...
✅ googleSearch completed
🔍 Using googleScholar...
✅ googleScholar completed
🔍 Using googleNews...
✅ googleNews completed
💭 Agent: [Report with citations]

✅ Acceptable Pattern (Scholar lacks content):
🔍 Using googleScholar...
✅ googleScholar completed
🔍 Using googleSearch...
✅ googleSearch completed
🔍 Calling Perplexity API...
✅ Perplexity API response received
💭 Agent: [Report with citations]

❌ Bad Pattern (should not happen):
🔍 Calling Perplexity API...
✅ Perplexity API response received
💭 Agent: [Report]
```

## Next Steps

If you see Perplexity being called too often:
1. Check if Scholar is consistently returning no abstracts
2. Consider adding more specific instructions
3. Consider switching to Option 1 (Jina Reader) for direct content extraction
