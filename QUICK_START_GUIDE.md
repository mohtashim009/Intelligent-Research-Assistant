# Quick Start Guide: Multi-Agent Research Assistant

## Overview

This guide will help you get started with the multi-agent research assistant that features:
- **Context-aware conversations** with memory
- **Intelligent prompt enhancement** 
- **Multi-source research** capabilities
- **Professional document export**

## Prerequisites

1. Node.js 18+ installed
2. API keys for:
   - **Google Gemini API** (free tier: 1,500 requests/day) - See [GOOGLE_API_SETUP.md](GOOGLE_API_SETUP.md)
   - Perplexity API
   - SerpAPI

> **Note**: The Google API key provides access to both Gemini (language model) and text-embedding-004 (embeddings), making it cost-effective with a generous free tier.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create or update `.env.local`:

```bash
# Required API Keys
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
SERPAPI_API_KEY=your_serpapi_key_here

# Optional
DATABASE_URL=file:./mastra-memory.db
```

### 3. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Basic Usage

### Example 1: Simple Research Query

```typescript
import { mastra } from '@/lib/mastra';

const masterAgent = mastra.getAgent('masterAgent');

// Simple research query
const result = await masterAgent.generate(
  "Research the latest developments in quantum computing",
  {
    memory: {
      thread: "session-123",
      resource: "user-456"
    },
    maxSteps: 10
  }
);

console.log(result.text);
```

### Example 2: Context-Aware Conversation

```typescript
// First message
await masterAgent.generate("Tell me about Python", {
  memory: { thread: "session-1", resource: "user-1" }
});

// Follow-up - Master Agent remembers context
await masterAgent.generate("What are its main web frameworks?", {
  memory: { thread: "session-1", resource: "user-1" }
});

// Another follow-up
await masterAgent.generate("Compare Django and Flask", {
  memory: { thread: "session-1", resource: "user-1" }
});
```

### Example 3: Handling Ambiguous Queries

```typescript
// Ambiguous query
const result = await masterAgent.generate("research on CNN", {
  memory: { thread: "session-2", resource: "user-1" }
});

// Master Agent will ask for clarification:
// "Are you interested in:
//  1. CNN (Convolutional Neural Networks)
//  2. CNN (Cable News Network)"

// Clarify
await masterAgent.generate("convolutional neural network", {
  memory: { thread: "session-2", resource: "user-1" }
});
// Now it conducts focused research on CNNs
```

### Example 4: Export Research Report

```typescript
import { ExportService } from '@/lib/mastra/export-service';
import { Message } from '@/types/schema';

// Assuming you have messages from the conversation
const messages: Message[] = [...];

// Export to PDF
await ExportService.exportToPDF(
  messages, 
  "Quantum Computing Research Report"
);

// Export to HTML
await ExportService.exportToHTML(
  messages,
  "Quantum Computing Research Report"
);

// Export to Markdown
await ExportService.exportToMarkdown(
  messages,
  "Quantum Computing Research Report"
);
```

## Using the Research Service

The `ResearchService` provides a simplified interface with automatic conversation tracking:

```typescript
import { ResearchService } from '@/lib/research-service';

// First query - automatically creates a conversation
const result1 = await ResearchService.generateResearchMessage(
  "What is machine learning?"
);

// Follow-up query - uses same conversation context
const result2 = await ResearchService.generateResearchMessage(
  "What are its main applications?"
);

// Start a new conversation
ResearchService.resetConversation();

const result3 = await ResearchService.generateResearchMessage(
  "Tell me about blockchain"
);
```

## Understanding the Agent Flow

### Master Agent Workflow

```
User Input
    ↓
Master Agent (analyzes intent)
    ↓
    ├─→ Needs clarification? → Ask user
    ├─→ Research needed? → Delegate to Research Agent
    └─→ Export needed? → Delegate to Export Agent
    ↓
Enhanced Response with Context
```

### Research Agent Workflow

```
Enhanced Prompt from Master Agent
    ↓
Research Agent
    ↓
    ├─→ Perplexity Search/Research
    ├─→ Google Search (SerpAPI)
    ├─→ Google Scholar
    ├─→ Google News
    └─→ Other specialized tools
    ↓
Comprehensive Research Report
    ↓
Back to Master Agent
```

### Export Agent Workflow

```
Content + Format Request
    ↓
Export Agent
    ↓
    ├─→ Analyze content structure
    ├─→ Apply format-specific rules
    ├─→ Add pagination/styling
    └─→ Optimize for target format
    ↓
Formatted Document
    ↓
Ready for Download
```

## Common Patterns

### Pattern 1: Multi-Turn Research

```typescript
const threadId = "research-session-1";
const resourceId = "user-123";

// Initial broad query
await masterAgent.generate("Research artificial intelligence", {
  memory: { thread: threadId, resource: resourceId }
});

// Narrow down
await masterAgent.generate("Focus on natural language processing", {
  memory: { thread: threadId, resource: resourceId }
});

// Specific application
await masterAgent.generate("How is it used in chatbots?", {
  memory: { thread: threadId, resource: resourceId }
});
```

### Pattern 2: Research and Export

```typescript
const messages: Message[] = [];

// Conduct research
const result = await masterAgent.generate(
  "Research renewable energy technologies",
  { memory: { thread: "session-1", resource: "user-1" } }
);

// Add to messages array
messages.push({
  type: MessageType.AI,
  content: result.text,
  timestamp: new Date()
});

// Export when ready
await ExportService.exportToPDF(messages, "Renewable Energy Report");
```

### Pattern 3: Comparative Research

```typescript
// Research multiple topics in sequence
const topics = [
  "solar energy",
  "wind energy", 
  "hydroelectric power"
];

for (const topic of topics) {
  await masterAgent.generate(`Research ${topic}`, {
    memory: { thread: "comparison-study", resource: "user-1" }
  });
}

// Master Agent maintains context across all queries
await masterAgent.generate(
  "Compare these three energy sources",
  { memory: { thread: "comparison-study", resource: "user-1" } }
);
```

## Tips and Best Practices

### 1. Use Consistent Thread and Resource IDs

```typescript
// Good - consistent IDs
const threadId = `session-${Date.now()}`;
const resourceId = `user-${userId}`;

// Use these throughout the conversation
```

### 2. Provide Clear Context in Initial Queries

```typescript
// Better
"Research the environmental impact of electric vehicles in urban areas"

// vs. Less clear
"Research EVs"
```

### 3. Let the Master Agent Clarify

```typescript
// Don't over-specify if you're unsure
"Research neural networks"

// Let Master Agent ask:
// "Are you interested in:
//  1. Biological neural networks
//  2. Artificial neural networks"
```

### 4. Use maxSteps Appropriately

```typescript
// Simple query
maxSteps: 5

// Complex research requiring multiple tools
maxSteps: 10

// Very comprehensive research
maxSteps: 15
```

### 5. Reset Conversations When Changing Topics

```typescript
// Finish one topic
await ResearchService.generateResearchMessage("Research topic A");

// Start a new, unrelated topic
ResearchService.resetConversation();
await ResearchService.generateResearchMessage("Research topic B");
```

## Troubleshooting

### Issue: Agent not remembering context

**Solution**: Ensure you're using the same `threadId` and `resourceId`:

```typescript
// Correct
const ids = { thread: "session-1", resource: "user-1" };
await agent.generate("First query", { memory: ids });
await agent.generate("Follow-up", { memory: ids }); // Same IDs

// Incorrect
await agent.generate("First query", { 
  memory: { thread: "session-1", resource: "user-1" } 
});
await agent.generate("Follow-up", { 
  memory: { thread: "session-2", resource: "user-1" } // Different thread!
});
```

### Issue: Research quality is poor

**Solution**: Increase `maxSteps` to allow more tool interactions:

```typescript
await masterAgent.generate(query, {
  memory: ids,
  maxSteps: 15 // Allow more research iterations
});
```

### Issue: Export formatting issues

**Solution**: Ensure messages are properly formatted:

```typescript
const messages: Message[] = [
  {
    type: MessageType.AI,
    content: "Research content here...",
    timestamp: new Date()
  }
];
```

## Next Steps

1. **Explore the full documentation**: See `MULTI_AGENT_ARCHITECTURE.md`
2. **Customize agents**: Modify instructions in `lib/mastra/agents/`
3. **Add new tools**: Extend agent capabilities
4. **Implement caching**: Optimize for repeated queries
5. **Add authentication**: Secure your application

## Support

- Documentation: `MULTI_AGENT_ARCHITECTURE.md`
- Issues: [GitHub Issues]
- Examples: See `examples/` directory

## What's Next?

Now that you understand the basics, you can:

1. Customize agent instructions for your specific use case
2. Add new specialized agents (e.g., citation agent, summary agent)
3. Integrate with your existing application
4. Implement advanced features like real-time collaboration
5. Deploy to production

Happy researching! 🚀
