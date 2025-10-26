# Google API Setup Guide

## Overview

This application uses **Google's Gemini API** for both language generation and embeddings, providing a cost-effective solution with generous free limits.

## What You Need

Just **ONE** API key from Google that provides access to:
- ✅ Gemini 2.5 Flash (language model)
- ✅ text-embedding-004 (embeddings for semantic recall)

## Getting Your Google API Key

### Step 1: Visit Google AI Studio

Go to: https://aistudio.google.com/app/apikey

### Step 2: Create API Key

1. Click "Get API key" or "Create API key"
2. Select or create a Google Cloud project
3. Copy your API key

### Step 3: Add to Environment

Add to your `.env.local` file:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

That's it! This single key provides access to both Gemini and embeddings.

## Free Tier Limits

Google provides generous free limits:

### Gemini 2.5 Flash
- **Free Tier**: 15 requests per minute (RPM)
- **Rate Limit**: 1 million tokens per minute (TPM)
- **Daily Limit**: 1,500 requests per day
- **Cost**: FREE up to these limits

### text-embedding-004
- **Free Tier**: 1,500 requests per day
- **Rate Limit**: 1,500 requests per minute
- **Batch Size**: Up to 100 texts per request
- **Cost**: FREE up to these limits

### What This Means

For typical usage:
- **Research queries**: ~10-20 per day = Well within limits
- **Embeddings**: ~50-100 per day = Well within limits
- **Total cost**: $0 for most users

## Monitoring Usage

### Check Your Usage

Visit: https://aistudio.google.com/app/apikey

You can see:
- Current usage
- Remaining quota
- Rate limits
- Historical usage

### Usage Tips

1. **Stay within free tier**: Most users never exceed it
2. **Monitor regularly**: Check usage weekly
3. **Optimize queries**: Combine related questions
4. **Cache results**: Avoid duplicate queries

## Upgrading (If Needed)

If you exceed free limits:

1. **Enable billing** in Google Cloud Console
2. **Pay-as-you-go** pricing:
   - Gemini 2.5 Flash: $0.075 per 1M input tokens
   - text-embedding-004: $0.00001 per 1K characters
3. **Still very affordable**: ~$1-5/month for heavy usage

## Comparison with OpenAI

| Feature | Google (Free) | OpenAI (Paid) |
|---------|---------------|---------------|
| Language Model | Gemini 2.5 Flash | GPT-4o Mini |
| Embeddings | text-embedding-004 | text-embedding-3-small |
| Free Tier | ✅ 1,500 req/day | ❌ None |
| Cost (if paid) | $0.075/1M tokens | $0.150/1M tokens |
| Setup | 1 API key | 1 API key |
| Quality | Excellent | Excellent |

**Winner**: Google for this use case (free tier + single API key)

## Troubleshooting

### Error: "API key not valid"

**Solutions**:
1. Check API key is correct in `.env.local`
2. Ensure no extra spaces or quotes
3. Restart development server
4. Verify key at https://aistudio.google.com/app/apikey

### Error: "Quota exceeded"

**Solutions**:
1. Check usage at https://aistudio.google.com/app/apikey
2. Wait for quota to reset (daily)
3. Enable billing if needed
4. Optimize query frequency

### Error: "Rate limit exceeded"

**Solutions**:
1. Reduce request frequency
2. Add delays between requests
3. Batch multiple queries
4. Enable billing for higher limits

### Slow Response Times

**Solutions**:
1. Check internet connection
2. Verify Google API status
3. Try different time of day
4. Consider caching results

## Best Practices

### 1. Secure Your API Key

```bash
# ✅ Good - in .env.local (gitignored)
GOOGLE_GENERATIVE_AI_API_KEY=your_key

# ❌ Bad - hardcoded in code
const apiKey = "AIza..."; // Never do this!
```

### 2. Monitor Usage

- Check weekly
- Set up alerts (if using billing)
- Track patterns
- Optimize as needed

### 3. Optimize Requests

```typescript
// ✅ Good - combine related questions
"Research Python and its web frameworks"

// ❌ Less efficient - separate requests
"Research Python"
"Research Python web frameworks"
```

### 4. Cache Results

```typescript
// Cache common queries
const cache = new Map();

async function cachedResearch(query: string) {
  if (cache.has(query)) {
    return cache.get(query);
  }
  
  const result = await research(query);
  cache.set(query, result);
  return result;
}
```

## Alternative: Using OpenAI

If you prefer OpenAI, you can switch:

### 1. Install OpenAI SDK

```bash
npm install @ai-sdk/openai
```

### 2. Update Master Agent

```typescript
import { openai } from '@ai-sdk/openai';

// Change model
model: openai('gpt-4o-mini'),

// Change embedder
const openaiEmbedding = openai.embedding('text-embedding-3-small');
memory: new Memory({
  embedder: openaiEmbedding,
  // ...
})
```

### 3. Update Environment

```bash
OPENAI_API_KEY=your_openai_key
```

**Note**: OpenAI has no free tier, so you'll need billing enabled.

## Summary

- ✅ **One API key** for everything (Gemini + embeddings)
- ✅ **Generous free tier** (1,500 requests/day)
- ✅ **Easy setup** (just add to .env.local)
- ✅ **Cost-effective** (free for most users)
- ✅ **High quality** (Gemini 2.5 Flash + text-embedding-004)

Get your key at: https://aistudio.google.com/app/apikey

---

**Recommended**: ✅ Google (free tier + single API key)  
**Alternative**: OpenAI (paid, but also excellent)  
**Setup Time**: < 5 minutes
