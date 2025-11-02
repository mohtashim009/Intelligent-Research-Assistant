# SerpAPI Formatting & Perplexity Removal

## Problem Identified

The Research Agent was calling Perplexity after SerpAPI because:

1. **SerpAPI tools returned raw JSON** - The agent couldn't understand the unformatted data
2. **Agent thought results were insufficient** - Seeing raw JSON objects, it called Perplexity for "synthesis"
3. **Perplexity was still available** - The agent had access to Perplexity tools as a fallback

## Solution Implemented

### 1. Formatted SerpAPI Output

Added formatting functions for the three main tools:

**googleSearch** - Now returns:
```
# Search Results for: "query"

Found 10 results

## 1. Article Title
**Source:** https://example.com
**Summary:** Article snippet here
**Date:** 2024-10-25
```

**googleScholar** - Now returns:
```
# Academic Research Results for: "query"

Found 10 academic papers

## 1. Paper Title
**Published:** Journal Name, 2024
**Source:** https://scholar.google.com/...
**Abstract:** Paper abstract here
**Citations:** 150
```

**googleNews** - Now returns:
```
# News Results for: "query"

Found 10 news articles

## 1. News Headline
**Source:** Defense News
**Link:** https://defensenews.com/...
**Summary:** Article summary here
**Date:** 10/25/2025
```

### 2. Removed Perplexity Entirely

- Removed `perplexityTools` import from research-agent.ts
- Removed Perplexity from the agent's tools object
- Updated agent description and instructions to focus on SerpAPI only
- Simplified instructions to explain the formatted output

### 3. Improved Console Logging

Changed from:
```
Using google_search
Obtained google_search results: {...}
```

To:
```
🔍 Using googleSearch...
✅ googleSearch completed
```

## Expected Behavior

Now when you ask for research:

1. ✅ Agent calls `googleSearch` → Gets formatted, readable results
2. ✅ Agent calls `googleScholar` → Gets formatted academic papers
3. ✅ Agent calls `googleNews` → Gets formatted news articles
4. ✅ Agent synthesizes the formatted results into a report
5. ❌ Agent NEVER calls Perplexity (it's not available anymore)

## Benefits

- **Faster research** - No unnecessary Perplexity calls
- **Better sources** - Direct links to original sources
- **More transparent** - Can see exactly what the agent found
- **Cost effective** - Only using SerpAPI (generous free tier)
- **Cleaner output** - Formatted markdown that renders properly

## Files Modified

1. `lib/mastra/serpapi-tool.ts` - Added formatting functions for googleSearch, googleScholar, googleNews
2. `lib/mastra/agents/research-agent.ts` - Removed Perplexity, updated instructions
