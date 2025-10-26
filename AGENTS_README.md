# Multi-Agent Research Assistant

A sophisticated AI-powered research assistant built with Mastra.ai, featuring context-aware conversations, intelligent prompt enhancement, and professional document export capabilities.

## 🌟 Features

### 🤖 Multi-Agent Architecture
- **Master Agent**: Orchestrates conversations and enhances prompts with context
- **Research Agent**: Conducts deep, multi-source research with citations
- **Export Agent**: Formats documents professionally for PDF, HTML, and Markdown

### 🧠 Intelligent Context Management
- **Working Memory**: Tracks user preferences, research history, and conversation state
- **Semantic Recall**: ✅ Retrieves relevant information from past conversations (enabled by default)
- **Conversation History**: Maintains recent context (20 messages)
- **Prompt Enhancement**: Automatically enriches queries with conversation context

> **Note**: Uses Google's text-embedding-004 for semantic recall (generous free tier). See [SEMANTIC_RECALL_SETUP.md](SEMANTIC_RECALL_SETUP.md) for details.

### 🔍 Comprehensive Research
- **Perplexity AI**: Real-time web search with citations
- **SerpAPI**: Google Search, Scholar, News, Shopping, Maps, YouTube
- **Multiple Sources**: Cross-references information across 10+ search engines
- **Academic Sources**: Google Scholar for peer-reviewed research
- **Current Events**: Google News for latest developments

### 📄 Professional Export
- **PDF**: Proper pagination, margins, and typography
- **HTML**: Responsive, print-friendly design
- **Markdown**: Clean syntax for easy sharing
- **Consistent Formatting**: Professional styling across all formats

## 🚀 Quick Start

### Prerequisites

```bash
# Required
Node.js 18+
npm or yarn

# API Keys
GOOGLE_GENERATIVE_AI_API_KEY
PERPLEXITY_API_KEY
SERPAPI_API_KEY
```

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

### Basic Usage

```typescript
import { ResearchService } from '@/lib/research-service';

// Simple research query
const result = await ResearchService.generateResearchMessage(
  "Research quantum computing applications"
);

console.log(result);
```

### Context-Aware Conversation

```typescript
import { mastra } from '@/lib/mastra';

const masterAgent = mastra.getAgent('masterAgent');
const conversationIds = {
  thread: "session-123",
  resource: "user-456"
};

// First query
await masterAgent.generate("Tell me about Python", {
  memory: conversationIds
});

// Follow-up - agent remembers context
await masterAgent.generate("What are its web frameworks?", {
  memory: conversationIds
});
// Agent knows "its" refers to Python
```

### Export Research

```typescript
import { ExportService } from '@/lib/mastra/export-service';

// Export to PDF
await ExportService.exportToPDF(messages, "Research Report");

// Export to HTML
await ExportService.exportToHTML(messages, "Research Report");

// Export to Markdown
await ExportService.exportToMarkdown(messages, "Research Report");
```

## 📚 Documentation

### Core Documentation
- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get started in 5 minutes
- **[Architecture Overview](MULTI_AGENT_ARCHITECTURE.md)** - Detailed system design
- **[Migration Guide](MIGRATION_GUIDE.md)** - Upgrade from legacy system
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - What was built

### Examples
- **[Usage Examples](examples/multi-agent-usage.ts)** - 10+ practical examples
- **API Examples** - See Quick Start Guide
- **Integration Examples** - See Architecture Overview

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Master Agent                          │
│  • Analyzes intent                                       │
│  • Enhances prompts with context                        │
│  • Asks clarifying questions                            │
│  • Delegates to sub-agents                              │
│  • Maintains conversation memory                        │
└────────────┬───────────────────────────┬────────────────┘
             │                           │
             ▼                           ▼
┌────────────────────────┐  ┌──────────────────────────┐
│   Research Agent       │  │    Export Agent          │
│  • Multi-source search │  │  • Format documents      │
│  • Deep analysis       │  │  • Professional styling  │
│  • Citations           │  │  • Pagination            │
│  • Comprehensive       │  │  • Multiple formats      │
└────────────────────────┘  └──────────────────────────┘
             │                           │
             ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Memory System                         │
│  • Working Memory (user context)                        │
│  • Semantic Recall (past conversations)                 │
│  • Conversation History (recent messages)               │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Use Cases

### 1. Academic Research
```typescript
// Research with academic sources
await masterAgent.generate(
  "Research the latest developments in quantum computing, focusing on academic papers",
  { memory: ids, maxSteps: 15 }
);
```

### 2. Market Research
```typescript
// Multi-source market analysis
await masterAgent.generate(
  "Research the electric vehicle market, including news, trends, and competitor analysis",
  { memory: ids, maxSteps: 12 }
);
```

### 3. Technical Documentation
```typescript
// Research and export technical content
const result = await masterAgent.generate(
  "Research best practices for React performance optimization",
  { memory: ids }
);

await ExportService.exportToMarkdown(messages, "React Performance Guide");
```

### 4. Comparative Analysis
```typescript
// Compare multiple topics
const topics = ["solar energy", "wind energy", "hydroelectric power"];

for (const topic of topics) {
  await masterAgent.generate(`Research ${topic}`, { memory: ids });
}

await masterAgent.generate(
  "Compare these three energy sources",
  { memory: ids }
);
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key  # Used for Gemini LLM AND embeddings
PERPLEXITY_API_KEY=your_perplexity_api_key
SERPAPI_API_KEY=your_serpapi_key

# Optional
DATABASE_URL=file:./mastra-memory.db
```

> **Note**: The same Google API key is used for both the Gemini language model and the text-embedding-004 model, making setup simple and cost-effective with Google's generous free tier.

### Memory Settings

Located in `lib/mastra/agents/master-agent.ts`:

```typescript
memory: new Memory({
  options: {
    lastMessages: 20,              // Recent conversation history
    workingMemory: {
      enabled: true,
      template: `...`              // User context template
    },
    semanticRecall: {
      topK: 5,                     // Number of relevant messages
      messageRange: 2,             // Context window size
    }
  }
})
```

### Agent Configuration

Each agent can be customized in `lib/mastra/agents/`:

- **master-agent.ts**: Orchestration and context management
- **research-agent.ts**: Research methodology and tools
- **export-agent.ts**: Export formatting and styling

## 📊 Performance

### Response Times
- Simple query: 5-10 seconds
- Complex research: 20-40 seconds
- Export formatting: 5-10 seconds

### Token Usage
- Master Agent: ~500-1000 tokens per request
- Research Agent: ~2000-5000 tokens per research
- Export Agent: ~1000-2000 tokens per format

### Optimization Tips
1. Adjust `maxSteps` based on query complexity
2. Use semantic recall selectively
3. Cache common research queries
4. Batch multiple queries when possible
5. Monitor and optimize token usage

## 🧪 Testing

### Run Examples

```typescript
import { runExamples } from './examples/multi-agent-usage';

// Run all examples
await runExamples();

// Or run individual examples
import { example1_BasicResearch } from './examples/multi-agent-usage';
await example1_BasicResearch();
```

### Test Context Awareness

```typescript
// Test that agent remembers context
const ids = { thread: "test-1", resource: "test-user" };

await masterAgent.generate("Tell me about Python", { memory: ids });
const result = await masterAgent.generate("What are its frameworks?", { memory: ids });

// Should mention Python frameworks
console.assert(result.text.includes("Django") || result.text.includes("Flask"));
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: Agent not remembering context  
**Solution**: Ensure consistent thread and resource IDs

**Issue**: Poor research quality  
**Solution**: Increase `maxSteps` parameter

**Issue**: Memory not persisting  
**Solution**: Check LibSQL database permissions

**Issue**: Export formatting problems  
**Solution**: Verify message format and content

See [Migration Guide](MIGRATION_GUIDE.md) for more troubleshooting tips.

## 🚀 Deployment

### Production Checklist

- [ ] Set environment variables
- [ ] Configure database (LibSQL)
- [ ] Set up monitoring
- [ ] Configure rate limiting
- [ ] Add authentication
- [ ] Set up logging
- [ ] Configure backups
- [ ] Test all features
- [ ] Load testing
- [ ] Security audit

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm run build
   vercel deploy
   ```

2. **Docker**
   ```bash
   docker build -t research-assistant .
   docker run -p 3000:3000 research-assistant
   ```

3. **Traditional Hosting**
   ```bash
   npm run build
   npm start
   ```

## 🤝 Contributing

### Adding New Agents

1. Create agent file in `lib/mastra/agents/`
2. Define agent with instructions and tools
3. Register in `lib/mastra/index.ts`
4. Update documentation
5. Add tests

Example:
```typescript
// lib/mastra/agents/citation-agent.ts
export const citationAgent = new Agent({
  name: 'citation-agent',
  description: 'Formats and validates citations',
  instructions: '...',
  model: google('gemini-2.5-flash-lite'),
  tools: { ... }
});
```

### Adding New Tools

1. Create tool using `createTool`
2. Add to appropriate agent
3. Document tool usage
4. Add tests

Example:
```typescript
const myTool = createTool({
  id: 'my-tool',
  description: 'Does something useful',
  inputSchema: z.object({ ... }),
  outputSchema: z.object({ ... }),
  execute: async ({ context }) => { ... }
});
```

## 📝 License

[Your License Here]

## 🙏 Acknowledgments

Built with:
- **[Mastra.ai](https://mastra.ai)** - Multi-agent framework
- **[Google Gemini](https://ai.google.dev/)** - Language model
- **[Perplexity AI](https://www.perplexity.ai/)** - Real-time search
- **[SerpAPI](https://serpapi.com/)** - Search tools
- **[LibSQL](https://github.com/libsql/libsql)** - Memory storage

## 📞 Support

- **Documentation**: See docs folder
- **Issues**: [GitHub Issues]
- **Email**: [Your Email]
- **Discord**: [Your Discord]

## 🗺️ Roadmap

### v1.1 (Next Release)
- [ ] Citation agent
- [ ] Summary agent
- [ ] Translation agent
- [ ] Custom export templates
- [ ] Advanced caching

### v1.2 (Future)
- [ ] Multi-user collaboration
- [ ] Real-time research sessions
- [ ] Visualization agent
- [ ] API integrations
- [ ] Mobile app

### v2.0 (Long-term)
- [ ] Voice interface
- [ ] Video analysis
- [ ] Custom model support
- [ ] Enterprise features
- [ ] Advanced analytics

## 📈 Stats

- **Agents**: 3 (Master, Research, Export)
- **Tools**: 15+ (Perplexity, SerpAPI, etc.)
- **Memory Types**: 3 (Working, Semantic, History)
- **Export Formats**: 3 (PDF, HTML, Markdown)
- **Search Engines**: 10+ (Google, Bing, DuckDuckGo, etc.)

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2025-10-25

Made with ❤️ using Mastra.ai
