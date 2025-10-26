# Research Strategy Update

## Changes Made

### 1. Perplexity Model Update
**Changed from**: `llama-3.1-sonar-large-128k-online` (deprecated)  
**Changed to**: `sonar` (current model)

This fixes the "Invalid model" error and uses Perplexity's latest model.

### 2. Tool Priority Restructuring

Following the IRA (Intelligent Research Assistant) algorithm approach:

#### PRIMARY TOOLS (Use First):
- **googleSearch**: General web search, broad overview
- **googleScholar**: Academic papers, scholarly research  
- **googleNews**: Current events, recent developments
- **googleShopping**: Product research
- **youtubeSearch**: Video tutorials
- **googleMaps**: Local information

#### SECONDARY TOOLS (Use Sparingly):
- **perplexity_search**: Only when SerpAPI results are insufficient
  - Updated description: "Use for general questions when SerpAPI tools are not sufficient"
  
#### EXTREME CASES ONLY:
- **perplexity_research**: Only when ALL other tools fail
  - Updated description: "EXTREME CASES ONLY: Use only when SerpAPI tools and perplexity_search fail"
  
- **perplexity_reason**: Only for complex logical analysis
  - Updated description: "Use sparingly - prefer SerpAPI tools for factual research"

### 3. Research Agent Strategy

Updated instructions to follow systematic algorithm:

```
## Research Strategy Selection:

1. **Academic/Scholarly Topics** → Prioritize SerpAPI (googleScholar, googleSearch)
2. **General Questions** → Use googleSearch first, then Perplexity if needed
3. **Hybrid Approach** → Combine both (default for comprehensive research)

## Systematic Process:

Step 1: Multi-Provider Query (SerpAPI first)
Step 2: Normalize Results
Step 3: Aggregate Content
Step 4: Rank by Relevance (TF-IDF)
Step 5: Filter Duplicates
Step 6: Extract Top-K Context
Step 7: Generate Report
```

## Benefits

### 1. Cost Efficiency
- **SerpAPI**: More cost-effective for bulk searches
- **Perplexity**: Reserved for cases where SerpAPI insufficient
- Reduces unnecessary Perplexity API calls

### 2. Better Results
- **Academic queries**: googleScholar provides peer-reviewed sources
- **Current events**: googleNews provides latest updates
- **General search**: googleSearch provides broad coverage
- **Perplexity**: Used strategically for synthesis and gaps

### 3. Follows Best Practices
- Matches the IRA algorithm from research papers
- Prioritizes authoritative sources (Scholar, News)
- Uses AI synthesis (Perplexity) only when needed
- Reduces redundancy and improves efficiency

## Tool Usage Guidelines

### For Academic Research:
```
1. googleScholar (primary)
2. googleSearch (supplementary)
3. googleNews (recent developments)
4. perplexity_search (only if gaps remain)
```

### For General Questions:
```
1. googleSearch (primary)
2. googleNews (if current events)
3. perplexity_search (if synthesis needed)
```

### For Current Events:
```
1. googleNews (primary)
2. googleSearch (context)
3. perplexity_search (synthesis)
```

### For Products/Services:
```
1. googleShopping (primary)
2. googleSearch (reviews)
3. perplexity_search (only if needed)
```

## Expected Behavior

### Before:
- Agent would use perplexity_research for most queries
- High Perplexity API usage
- Sometimes redundant with SerpAPI results

### After:
- Agent prioritizes SerpAPI tools
- Perplexity used strategically
- More cost-effective
- Better source diversity

## Testing

To test the new strategy:

```typescript
import { mastra } from '@/lib/mastra';

const researchAgent = mastra.getAgent('researchAgent');

// Academic query - should use googleScholar primarily
await researchAgent.generate("Research quantum computing papers");

// General query - should use googleSearch primarily  
await researchAgent.generate("What is machine learning?");

// Current events - should use googleNews primarily
await researchAgent.generate("Latest AI developments");
```

## Monitoring

Watch the logs to see which tools are being called:

```
🔧 Tool Call: googleScholar  ← Good (primary for academic)
🔧 Tool Call: googleSearch   ← Good (primary for general)
🔧 Tool Call: googleNews      ← Good (primary for news)
🔧 Tool Call: perplexity_search ← Should be rare
🔧 Tool Call: perplexity_research ← Should be very rare
```

## Rollback

If needed, revert by:
1. Change Perplexity model back to previous
2. Update tool descriptions
3. Restore original research agent instructions

## Summary

✅ **Fixed**: Perplexity model error (now using "sonar")  
✅ **Optimized**: Tool selection strategy (SerpAPI first)  
✅ **Reduced**: Perplexity API usage (cost savings)  
✅ **Improved**: Research quality (better source diversity)  
✅ **Aligned**: With IRA algorithm best practices

---

**Status**: ✅ Complete  
**Impact**: High (fixes errors + improves efficiency)  
**Risk**: Low (can easily rollback if needed)
