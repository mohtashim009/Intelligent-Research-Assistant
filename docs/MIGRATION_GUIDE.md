# Migration Guide: From Legacy to Multi-Agent Architecture

## Overview

This guide helps you migrate from the legacy single-agent system to the new multi-agent architecture with enhanced context awareness and memory.

## What Changed

### Old Architecture
- Single research agent (`lib/mastra/mcp.ts`)
- No conversation memory
- No context awareness
- Direct tool usage
- Simple prompt handling

### New Architecture
- **Master Agent**: Orchestrates and enhances prompts
- **Research Agent**: Specialized research with multiple tools
- **Export Agent**: Professional document formatting
- **Memory System**: Conversation history and semantic recall
- **Context Awareness**: Understands follow-up questions

## Migration Steps

### Step 1: Update Imports

#### Before
```typescript
import { generateResearchMessage } from '@/lib/mastra/mcp';
```

#### After
```typescript
// Option 1: Use simplified service
import { ResearchService } from '@/lib/research-service';

// Option 2: Use Mastra instance directly
import { mastra } from '@/lib/mastra';
```

### Step 2: Update Function Calls

#### Before
```typescript
const result = await generateResearchMessage(query);
```

#### After (Option 1: Simplified Service)
```typescript
const result = await ResearchService.generateResearchMessage(query);
```

#### After (Option 2: Direct Agent Access)
```typescript
const masterAgent = mastra.getAgent('masterAgent');
const result = await masterAgent.generate(query, {
  memory: {
    thread: threadId,
    resource: resourceId
  },
  maxSteps: 10
});
```

### Step 3: Add Memory Support

#### Before (No Memory)
```typescript
const result1 = await generateResearchMessage("Tell me about Python");
const result2 = await generateResearchMessage("What are its frameworks?");
// Agent doesn't know "its" refers to Python
```

#### After (With Memory)
```typescript
const conversationIds = {
  thread: "session-123",
  resource: "user-456"
};

const result1 = await masterAgent.generate("Tell me about Python", {
  memory: conversationIds
});

const result2 = await masterAgent.generate("What are its frameworks?", {
  memory: conversationIds
});
// Agent remembers "its" refers to Python
```

### Step 4: Update Export Functions

#### Before
```typescript
import { exportToPDF, exportToHTML, exportToMarkdown } from '@/lib/export-utils';

await exportToPDF(messages, title);
await exportToHTML(messages, title);
await exportToMarkdown(messages, title);
```

#### After
```typescript
import { ExportService } from '@/lib/mastra/export-service';

await ExportService.exportToPDF(messages, title);
await ExportService.exportToHTML(messages, title);
await ExportService.exportToMarkdown(messages, title);
```

**Note**: The new export service uses the Export Agent for better formatting.

### Step 5: Update API Routes

#### Before (`app/api/research/route.ts`)
```typescript
import { generateResearchMessage } from '@/lib/mastra/mcp';

export async function POST(request: Request) {
  const { query } = await request.json();
  const result = await generateResearchMessage(query);
  return Response.json({ result });
}
```

#### After
```typescript
import { mastra } from '@/lib/mastra';

export async function POST(request: Request) {
  const { query, threadId, resourceId } = await request.json();
  
  const masterAgent = mastra.getAgent('masterAgent');
  const result = await masterAgent.generate(query, {
    memory: threadId && resourceId ? {
      thread: threadId,
      resource: resourceId
    } : undefined,
    maxSteps: 10
  });
  
  return Response.json({ 
    result: result.text,
    threadId,
    resourceId
  });
}
```

## Code Examples

### Example 1: Simple Migration

#### Before
```typescript
// Old code
import { generateResearchMessage } from '@/lib/mastra/mcp';

async function doResearch(query: string) {
  const result = await generateResearchMessage(query);
  console.log(result);
}
```

#### After
```typescript
// New code
import { ResearchService } from '@/lib/research-service';

async function doResearch(query: string) {
  const result = await ResearchService.generateResearchMessage(query);
  console.log(result);
}
```

### Example 2: With Context Tracking

#### Before
```typescript
// Old code - no context
async function multipleQueries() {
  await generateResearchMessage("What is AI?");
  await generateResearchMessage("What are its applications?");
  // Second query doesn't know "its" refers to AI
}
```

#### After
```typescript
// New code - with context
import { mastra } from '@/lib/mastra';

async function multipleQueries() {
  const masterAgent = mastra.getAgent('masterAgent');
  const ids = {
    thread: `session-${Date.now()}`,
    resource: 'user-123'
  };
  
  await masterAgent.generate("What is AI?", { memory: ids });
  await masterAgent.generate("What are its applications?", { memory: ids });
  // Second query understands "its" refers to AI
}
```

### Example 3: Export Migration

#### Before
```typescript
// Old code
import { exportToPDF } from '@/lib/export-utils';

async function exportReport(messages: Message[], title: string) {
  await exportToPDF(messages, title);
}
```

#### After
```typescript
// New code
import { ExportService } from '@/lib/mastra/export-service';

async function exportReport(messages: Message[], title: string) {
  await ExportService.exportToPDF(messages, title);
}
```

## Breaking Changes

### 1. Function Signatures

**Old**: `generateResearchMessage(query: string): Promise<string>`

**New**: 
- `ResearchService.generateResearchMessage(query: string): Promise<string>`
- `masterAgent.generate(query, options): Promise<{ text: string, ... }>`

### 2. Return Types

**Old**: Returns string directly
```typescript
const result: string = await generateResearchMessage(query);
```

**New**: Returns object with text property (when using agent directly)
```typescript
const result = await masterAgent.generate(query);
const text: string = result.text;
```

**Note**: `ResearchService` still returns string directly for backward compatibility.

### 3. Memory Required for Context

**Old**: No memory support

**New**: Memory required for context-aware conversations
```typescript
// Without memory - no context
await masterAgent.generate(query);

// With memory - context-aware
await masterAgent.generate(query, {
  memory: { thread: threadId, resource: resourceId }
});
```

## Feature Comparison

| Feature | Old System | New System |
|---------|-----------|------------|
| Context Awareness | ❌ No | ✅ Yes |
| Memory | ❌ No | ✅ Yes (Working + Semantic) |
| Prompt Enhancement | ❌ No | ✅ Yes |
| Clarifying Questions | ❌ No | ✅ Yes |
| Multi-Agent | ❌ No | ✅ Yes (Master, Research, Export) |
| Export Formatting | ⚠️ Basic | ✅ Advanced |
| Follow-up Questions | ❌ No | ✅ Yes |
| Conversation History | ❌ No | ✅ Yes (20 messages) |
| Semantic Recall | ❌ No | ✅ Yes (Top 5) |

## Backward Compatibility

### ResearchService API

The `ResearchService` provides a backward-compatible API:

```typescript
// Works like the old system
const result = await ResearchService.generateResearchMessage(query);

// But with automatic context tracking
const result2 = await ResearchService.generateResearchMessage(followUpQuery);
// Remembers context from first query

// Reset when needed
ResearchService.resetConversation();
```

### Export Functions

Export functions maintain the same signature:

```typescript
// Old and new both work
await ExportService.exportToPDF(messages, title);
await ExportService.exportToHTML(messages, title);
await ExportService.exportToMarkdown(messages, title);
```

## Testing Your Migration

### 1. Test Basic Functionality

```typescript
import { ResearchService } from '@/lib/research-service';

// Should work like before
const result = await ResearchService.generateResearchMessage(
  "What is quantum computing?"
);
console.log(result);
```

### 2. Test Context Awareness

```typescript
// First query
await ResearchService.generateResearchMessage("Tell me about Python");

// Follow-up - should understand context
await ResearchService.generateResearchMessage("What are its web frameworks?");
```

### 3. Test Export

```typescript
import { ExportService } from '@/lib/mastra/export-service';

await ExportService.exportToPDF(messages, "Test Report");
// Check if PDF is generated correctly
```

## Common Migration Issues

### Issue 1: Type Errors

**Problem**: `result.text` doesn't exist

**Solution**: 
```typescript
// If using agent directly
const result = await masterAgent.generate(query);
const text = result.text; // ✅ Correct

// If using ResearchService
const text = await ResearchService.generateResearchMessage(query); // ✅ Returns string
```

### Issue 2: Context Not Working

**Problem**: Agent doesn't remember previous messages

**Solution**: Ensure consistent thread and resource IDs
```typescript
// ❌ Wrong - different thread IDs
await agent.generate(query1, { memory: { thread: "1", resource: "user" } });
await agent.generate(query2, { memory: { thread: "2", resource: "user" } });

// ✅ Correct - same thread ID
const ids = { thread: "session-1", resource: "user" };
await agent.generate(query1, { memory: ids });
await agent.generate(query2, { memory: ids });
```

### Issue 3: Export Not Working

**Problem**: Export functions fail

**Solution**: Check message format
```typescript
// ✅ Correct message format
const messages: Message[] = [
  {
    id: 'msg-1',
    type: MessageType.AI,
    status: MessageStatus.SENT,
    content: 'Research content...',
    timestamp: new Date()
  }
];
```

## Rollback Plan

If you need to rollback to the old system:

1. Keep the old `lib/mastra/mcp.ts` file
2. Revert imports:
   ```typescript
   import { generateResearchMessage } from '@/lib/mastra/mcp';
   ```
3. Revert function calls:
   ```typescript
   const result = await generateResearchMessage(query);
   ```

## Performance Considerations

### Old System
- Single agent call
- No memory overhead
- Faster for simple queries

### New System
- Master agent + sub-agent calls
- Memory storage/retrieval
- Slightly slower but more intelligent

**Optimization Tips**:
1. Use `ResearchService` for simple queries
2. Use direct agent access for complex conversations
3. Adjust `maxSteps` based on query complexity
4. Reset conversations when changing topics

## Next Steps

After migration:

1. ✅ Test all research functionality
2. ✅ Test export functionality
3. ✅ Test context-aware conversations
4. ✅ Monitor performance
5. ✅ Adjust memory settings if needed
6. ✅ Train users on new features

## Support

If you encounter issues:

1. Check this migration guide
2. Review `QUICK_START_GUIDE.md`
3. See `MULTI_AGENT_ARCHITECTURE.md` for details
4. Check `examples/multi-agent-usage.ts` for examples

## Conclusion

The new multi-agent architecture provides:
- ✅ Better context awareness
- ✅ Intelligent prompt enhancement
- ✅ Professional export formatting
- ✅ Conversation memory
- ✅ Scalable architecture

While requiring some code changes, the benefits far outweigh the migration effort.

---

**Migration Checklist**:
- [ ] Update imports
- [ ] Update function calls
- [ ] Add memory support (if needed)
- [ ] Update export functions
- [ ] Test basic functionality
- [ ] Test context awareness
- [ ] Test export functionality
- [ ] Update documentation
- [ ] Train team members
- [ ] Monitor performance

**Status**: Ready for Migration ✅
