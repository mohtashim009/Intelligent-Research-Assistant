# Conversation History Fix - Draft Agent Context Issue

## Problem

When reloading a chat session from history and asking to "convert it to IEEE format", the master-agent would ask for the content instead of using the previous research report. This happened because:

1. The master-agent didn't have access to previous messages in the conversation
2. The memory system (threadId/resourceId) wasn't sufficient for context
3. When you reload the page, a new threadId is created, losing the connection to previous context

## Root Cause

The research API was only receiving:
- Current query: "convert it to IEEE format"
- ThreadId and ResourceId (for memory)

But it was NOT receiving:
- Previous messages in the conversation
- The research report that was just generated

So the master-agent had no way to know what "it" referred to.

## Solution

Pass conversation history explicitly to the master-agent so it can see previous messages and understand context.

### Changes Made

#### 1. Updated ResearchService (`lib/research-service.ts`)

```typescript
// Added conversationHistory parameter
static async generateResearchMessage(
  query: string, 
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string>
```

Now accepts an optional array of previous messages.

#### 2. Updated Research API (`app/api/research/route.ts`)

```typescript
// Accept conversation history
const { query, threadId, resourceId, conversationHistory } = body;

// Build messages array with history
const messages: any[] = [];

// Add last 5 messages for context
if (conversationHistory && conversationHistory.length > 0) {
  const recentHistory = conversationHistory.slice(-5);
  messages.push(...recentHistory.map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  })));
}

// Add current query
messages.push({
  role: 'user',
  content: query,
});

// Pass messages array to master-agent
const result = await masterAgent.generate(messages, { ... });
```

Now includes the last 5 messages as context before the current query.

#### 3. Updated ChatInterfaceWithPersistence (`components/chat/ChatInterfaceWithPersistence.tsx`)

```typescript
// Prepare conversation history (last 10 messages)
const conversationHistory = messages.slice(-10).map(msg => ({
  role: msg.type === MessageType.USER ? 'user' as const : 'assistant' as const,
  content: msg.content,
}));

// Pass history to research service
const aiResponse = await ResearchService.generateResearchMessage(
  content, 
  conversationHistory
);
```

Now sends the last 10 messages from the current chat session.

## How It Works Now

### Scenario: Convert Report to IEEE Format

```
1. User: "Research LPWAN efficiency"
   ↓
2. AI generates full research report
   ↓
3. Both messages saved to MongoDB
   ↓
4. User reloads page and opens chat from history
   ↓
5. Messages loaded from MongoDB into UI
   ↓
6. User: "convert it to IEEE format"
   ↓
7. ChatInterface prepares conversation history:
   [
     { role: 'user', content: 'Research LPWAN efficiency' },
     { role: 'assistant', content: '# Research Report...' }
   ]
   ↓
8. ResearchService sends query + history to API
   ↓
9. API builds messages array:
   [
     { role: 'user', content: 'Research LPWAN efficiency' },
     { role: 'assistant', content: '# Research Report...' },
     { role: 'user', content: 'convert it to IEEE format' }
   ]
   ↓
10. Master-agent sees full context
    ↓
11. Master-agent detects "convert" → calls draft-agent
    ↓
12. Draft-agent receives report from history
    ↓
13. Draft-agent converts to IEEE format
    ↓
14. Converted report returned to user ✅
```

## Benefits

1. **Context Awareness**: Master-agent can see previous messages
2. **Works After Reload**: History loaded from MongoDB is used
3. **Better Understanding**: Agent knows what "it" refers to
4. **Proper Routing**: Master-agent can correctly route to draft-agent
5. **Memory Efficient**: Only sends last 5-10 messages (not entire history)

## Testing

1. Start a new chat
2. Ask: "Research quantum computing"
3. Wait for full report
4. Ask: "convert it to IEEE format"
   - ✅ Should convert without asking for content
5. Reload the page
6. Open the same chat from sidebar
7. Ask: "add a security section"
   - ✅ Should add section to existing report
8. Ask: "convert to APA format"
   - ✅ Should convert the IEEE report to APA

## Configuration

- **History sent to API**: Last 10 messages from chat
- **History used by agent**: Last 5 messages (API filters)
- **Reason for limit**: Balance between context and token usage

## Files Modified

1. `lib/research-service.ts` - Added conversationHistory parameter
2. `app/api/research/route.ts` - Accept and process history
3. `components/chat/ChatInterfaceWithPersistence.tsx` - Send history

---

**Status**: ✅ Fixed - Draft agent now has full conversation context
