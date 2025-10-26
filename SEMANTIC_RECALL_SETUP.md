# Semantic Recall Setup Guide

## Current Status

Semantic recall is **ENABLED by default** using Google's `text-embedding-004` model, which has a generous free tier!

✅ **What's Configured:**
1. Vector store (LibSQLVector) - ✅ Configured
2. Embedder model (Google text-embedding-004) - ✅ Configured
3. Semantic recall settings - ✅ Enabled (topK: 5, messageRange: 2)

**Requirements:**
- `GOOGLE_GENERATIVE_AI_API_KEY` in your `.env.local` (same key used for Gemini)
- That's it! Everything else is configured.

## How to Enable Semantic Recall

### Step 1: Verify Vector Store

The vector store is already configured in `lib/mastra/index.ts`:

```typescript
export const mastra = new Mastra({
  // ...
  vectors: new LibSQLVector({
    connectionUrl: 'file:./mastra-memory.db',
  }),
});
```

✅ This is already done!

### Step 2: Configure Embedder

By default, the system uses **Google's text-embedding-004** model, which has a generous free tier. This is already configured in the Master Agent:

```typescript
import { google } from '@ai-sdk/google';

const googleEmbedding = google.textEmbeddingModel('text-embedding-004');

memory: new Memory({
  embedder: googleEmbedding,
  // ... rest of config
})
```

✅ This is already done! Just make sure you have `GOOGLE_GENERATIVE_AI_API_KEY` in your `.env.local`

**Alternative Embedders** (if you prefer):

OpenAI:
```typescript
import { openai } from '@ai-sdk/openai';

memory: new Memory({
  embedder: openai.embedding('text-embedding-3-small'),
  // ... rest of config
})
```

Or use the model router:
```typescript
memory: new Memory({
  embedder: 'google/text-embedding-004', // Google (default)
  // or
  embedder: 'openai/text-embedding-3-small', // OpenAI
  // ... rest of config
})
```

### Step 3: Semantic Recall Status

✅ **Semantic recall is now ENABLED by default** with Google embeddings!

The configuration in `lib/mastra/agents/master-agent.ts`:

```typescript
import { google } from '@ai-sdk/google';

const googleEmbedding = google.textEmbeddingModel('text-embedding-004');

memory: new Memory({
  embedder: googleEmbedding, // Google's free-tier embedding model
  options: {
    lastMessages: 20,
    workingMemory: {
      enabled: true,
      template: `...`
    },
    semanticRecall: {
      topK: 5,              // Retrieve 5 most relevant messages
      messageRange: 2,      // Include 2 messages before/after each match
      scope: 'thread',      // Search within current thread
    },
  },
})
```

**To disable** (if you don't need it):
```typescript
semanticRecall: false,
```

### Step 4: Test Semantic Recall

```typescript
import { mastra } from '@/lib/mastra';

const masterAgent = mastra.getAgent('masterAgent');
const ids = { thread: 'test-thread', resource: 'test-user' };

// Create multiple messages
for (let i = 0; i < 25; i++) {
  await masterAgent.generate(`Message ${i} about topic ${i % 3}`, {
    memory: ids
  });
}

// Query should recall relevant messages
const result = await masterAgent.generate(
  "What did we discuss about topic 1?",
  { memory: ids }
);

console.log(result.text);
// Should reference messages 1, 4, 7, 10, 13, 16, 19, 22
```

## Configuration Options

### Basic Configuration

```typescript
semanticRecall: {
  topK: 5,           // Number of relevant messages to retrieve
  messageRange: 2,   // Context window (messages before/after)
}
```

### Advanced Configuration

```typescript
semanticRecall: {
  topK: 10,                    // More messages
  messageRange: {
    before: 3,                 // 3 messages before
    after: 1,                  // 1 message after
  },
  scope: 'resource',           // Search across all user's threads
}
```

### With Custom Embedder

```typescript
import { openai } from '@ai-sdk/openai';

memory: new Memory({
  embedder: openai.embedding('text-embedding-3-large'), // Better quality
  options: {
    semanticRecall: {
      topK: 5,
      messageRange: 2,
    },
  },
})
```

## Performance Considerations

### Token Usage
- Embedding generation: ~100-200 tokens per message
- Vector search: Minimal overhead
- Context retrieval: Depends on `topK` and `messageRange`

### Response Time
- First message: +500-1000ms (embedding generation)
- Subsequent messages: +200-500ms (vector search)
- Overall impact: 10-20% slower responses

### Storage
- Vector embeddings: ~1-2 KB per message
- 1000 messages: ~1-2 MB
- 10,000 messages: ~10-20 MB

## When to Use Semantic Recall

### Good Use Cases ✅
- Long conversations (50+ messages)
- Multiple related topics discussed
- Need to recall specific information from past
- User asks "What did we discuss about X?"
- Research sessions spanning multiple days

### Not Needed ❌
- Short conversations (< 20 messages)
- Single-topic discussions
- Real-time chat where recent history is sufficient
- Performance-critical applications
- Limited API budget

## Troubleshooting

### Error: "Semantic recall requires a vector store"

**Solution**: Ensure vector store is configured in Mastra instance:

```typescript
export const mastra = new Mastra({
  vectors: new LibSQLVector({
    connectionUrl: 'file:./mastra-memory.db',
  }),
});
```

### Error: "Embedder not configured"

**Solution**: Add embedder to Memory configuration:

```typescript
memory: new Memory({
  embedder: 'openai/text-embedding-3-small',
  // ...
})
```

### Slow Performance

**Solutions**:
1. Reduce `topK` (fewer messages retrieved)
2. Reduce `messageRange` (less context)
3. Use faster embedder model
4. Add caching layer
5. Consider disabling for simple queries

### Poor Recall Quality

**Solutions**:
1. Increase `topK` (more messages)
2. Increase `messageRange` (more context)
3. Use better embedder (e.g., `text-embedding-3-large`)
4. Ensure messages are well-formatted
5. Check that relevant messages exist

## Alternative: Using Without Semantic Recall

The system works great without semantic recall! The Master Agent still has:

- ✅ **Working Memory**: Tracks user context and preferences
- ✅ **Conversation History**: Last 20 messages
- ✅ **Context Enhancement**: Enriches prompts with available context

For most use cases, this is sufficient. Semantic recall is an advanced feature for specific scenarios.

## Example: Current Configuration

Here's the current configuration with semantic recall enabled using Google embeddings:

```typescript
// lib/mastra/agents/master-agent.ts
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { google } from '@ai-sdk/google';
import { researchAgent } from './research-agent';
import { exportAgent } from './export-agent';

// Use Google's embedding model (generous free tier)
const googleEmbedding = google.textEmbeddingModel('text-embedding-004');

export const masterAgent = new Agent({
  name: 'master-agent',
  description: '...',
  instructions: '...',
  model: google('gemini-2.5-flash-lite'),
  agents: {
    researchAgent,
    exportAgent,
  },
  memory: new Memory({
    embedder: googleEmbedding, // ✅ Google embeddings (same API key as Gemini)
    options: {
      lastMessages: 20,
      workingMemory: {
        enabled: true,
        template: `...`
      },
      semanticRecall: {              // ✅ Enabled by default
        topK: 5,
        messageRange: 2,
        scope: 'thread',
      },
    },
  }),
});
```

**Benefits of Google Embeddings:**
- ✅ Same API key as Gemini (no additional setup)
- ✅ Generous free tier (15,000 requests/day)
- ✅ High quality embeddings (768 dimensions)
- ✅ Fast and reliable
- ✅ No additional cost for most users

## Summary

- **Current Status**: ✅ Semantic recall is ENABLED by default
- **Embedder**: Google text-embedding-004 (generous free tier)
- **Vector Store**: LibSQLVector (already configured)
- **API Key**: Uses same `GOOGLE_GENERATIVE_AI_API_KEY` as Gemini
- **Performance Impact**: 10-20% slower, but provides better context retrieval
- **Cost**: Free within Google's generous limits

The system is ready to use with semantic recall out of the box! It will automatically:
- Create vector embeddings of all messages
- Retrieve relevant past conversations
- Provide better context for follow-up questions

**To Disable** (if you don't need it):
Set `semanticRecall: false` in master-agent.ts

---

**Status**: ✅ Enabled by Default  
**Embedder**: Google text-embedding-004  
**Cost**: Free (generous limits)  
**Recommendation**: Keep it enabled for better context awareness
