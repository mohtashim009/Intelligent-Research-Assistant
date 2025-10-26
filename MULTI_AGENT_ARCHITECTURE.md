# Multi-Agent Architecture Documentation

## Overview

This application implements a sophisticated multi-agent architecture using Mastra.ai, designed to provide context-aware research assistance with intelligent prompt enhancement and professional document export capabilities.

## Architecture Components

### 1. Master Agent (`master-agent`)

**Role**: Orchestrator and Context Manager

The Master Agent is the primary interface for user interactions. It:

- **Analyzes user intent** and identifies ambiguities
- **Enhances prompts** with conversation history and context
- **Asks clarifying questions** when needed
- **Delegates tasks** to specialized sub-agents
- **Maintains conversation memory** for context-aware interactions

**Key Features**:
- Working memory with conversation context tracking
- Semantic recall for retrieving relevant past conversations
- Intelligent prompt enhancement based on conversation history
- Seamless coordination between research and export agents

**Example Flow**:
```
User: "research on CNN"
Master Agent: "I'd be happy to help! Are you interested in:
  1. CNN (Convolutional Neural Networks) - the deep learning architecture
  2. CNN (Cable News Network) - the news media organization"

User: "convolutional neural network"
Master Agent: [Enhances prompt with context] → Delegates to Research Agent
```

### 2. Research Agent (`research-agent`)

**Role**: Deep Research Specialist

The Research Agent conducts comprehensive, multi-source research using:

- **Perplexity AI** (search, research, reasoning)
- **SerpAPI** (Google Search, Scholar, News, Shopping, Maps, YouTube, etc.)
- **Multiple search engines** (Bing, DuckDuckGo, Baidu, Yandex)

**Research Methodology**:
1. Multi-source investigation
2. Systematic research process
3. Deep analysis with citations
4. Comprehensive report generation
5. Quality assurance and fact-checking

**Output Format**:
```markdown
# [Research Topic]

## Executive Summary
[Overview of key findings]

## Key Findings
- [Finding 1] [citation]
- [Finding 2] [citation]

## Detailed Analysis
### [Aspect 1]
[Detailed information with citations]

## Conclusions
[Synthesis and implications]

## Sources
1. [Source 1 with URL]
2. [Source 2 with URL]
```

### 3. Export Agent (`export-agent`)

**Role**: Document Formatting Specialist

The Export Agent prepares research reports for professional export with:

- **Format-specific optimization** (PDF, HTML, Markdown)
- **Proper pagination and page breaks**
- **Professional styling and margins**
- **Consistent formatting throughout**
- **Accessibility considerations**

**Supported Formats**:
- **PDF**: Professional layout with proper margins, page breaks, and typography
- **HTML**: Responsive, print-friendly design with semantic structure
- **Markdown**: Clean, standard syntax for easy sharing and version control

## Memory System

### Working Memory

Tracks conversation context including:
- User information and preferences
- Current and previous research topics
- Pending questions and clarifications
- Research history

### Semantic Recall

Retrieves relevant information from past conversations using:
- Vector embeddings for similarity search
- Top-K retrieval (5 most relevant messages)
- Context window (2 messages before/after each match)

### Conversation History

Maintains the last 20 messages for immediate context.

## Usage Examples

### Basic Research Query

```typescript
import { mastra } from '@/lib/mastra';

const masterAgent = mastra.getAgent('masterAgent');

const result = await masterAgent.generate("Research quantum computing applications", {
  memory: {
    thread: "user-session-123",
    resource: "user-456"
  },
  maxSteps: 10
});

console.log(result.text);
```

### Context-Aware Follow-up

```typescript
// First query
await masterAgent.generate("Tell me about Python", {
  memory: { thread: "session-1", resource: "user-1" }
});

// Follow-up query - Master Agent uses context
await masterAgent.generate("Now research its web frameworks", {
  memory: { thread: "session-1", resource: "user-1" }
});
// Master Agent knows "its" refers to Python from previous context
```

### Export with Formatting

```typescript
import { ExportService } from '@/lib/mastra/export-service';

// Export to PDF with professional formatting
await ExportService.exportToPDF(messages, "Quantum Computing Research");

// Export to HTML
await ExportService.exportToHTML(messages, "Quantum Computing Research");

// Export to Markdown
await ExportService.exportToMarkdown(messages, "Quantum Computing Research");
```

## API Integration

### Research API Endpoint

**Endpoint**: `POST /api/research`

**Request Body**:
```json
{
  "query": "Research topic or question",
  "threadId": "unique-thread-id",
  "resourceId": "unique-user-id"
}
```

**Response**:
```json
{
  "result": "Research findings...",
  "threadId": "unique-thread-id",
  "resourceId": "unique-user-id"
}
```

### Research Service

```typescript
import { ResearchService } from '@/lib/research-service';

// Automatic conversation tracking
const result = await ResearchService.generateResearchMessage("Research AI ethics");

// Reset conversation (start fresh)
ResearchService.resetConversation();
```

## Configuration

### Environment Variables

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
SERPAPI_API_KEY=your_serpapi_key

# Optional
DATABASE_URL=file:./mastra-memory.db
```

### Memory Configuration

Located in `lib/mastra/agents/master-agent.ts`:

```typescript
memory: new Memory({
  options: {
    lastMessages: 20,              // Recent conversation history
    workingMemory: {
      enabled: true,
      template: `...`              // Context tracking template
    },
    semanticRecall: {
      topK: 5,                     // Number of relevant messages
      messageRange: 2,             // Context window size
    }
  }
})
```

## Benefits of This Architecture

### 1. Context-Aware Interactions
- Remembers previous conversations
- Understands follow-up questions
- Builds upon earlier discussions
- Reduces need for repetition

### 2. Intelligent Prompt Enhancement
- Clarifies ambiguous requests
- Adds relevant context automatically
- Improves research quality
- Reduces misunderstandings

### 3. Specialized Expertise
- Research Agent focuses on gathering information
- Export Agent ensures professional presentation
- Master Agent coordinates seamlessly
- Each agent optimized for its task

### 4. Professional Output
- Properly formatted documents
- Consistent styling
- Appropriate pagination
- Multiple export formats

### 5. Scalability
- Easy to add new agents
- Modular architecture
- Independent agent development
- Clear separation of concerns

## Future Enhancements

### Potential Additions

1. **Citation Agent**: Specialized in formatting and validating citations
2. **Summary Agent**: Creates executive summaries and abstracts
3. **Translation Agent**: Multi-language support
4. **Visualization Agent**: Generates charts and diagrams
5. **Fact-Checking Agent**: Verifies claims across sources

### Advanced Features

1. **Multi-user collaboration**: Shared research sessions
2. **Version control**: Track research iterations
3. **Custom templates**: User-defined export formats
4. **API integrations**: Connect to more data sources
5. **Real-time collaboration**: Live research sessions

## Troubleshooting

### Common Issues

**Issue**: Agent not using context from previous messages
**Solution**: Ensure `threadId` and `resourceId` are consistent across requests

**Issue**: Export formatting issues
**Solution**: Check that the Export Agent has access to the full conversation history

**Issue**: Memory not persisting
**Solution**: Verify LibSQL database file permissions and path

**Issue**: Research quality inconsistent
**Solution**: Increase `maxSteps` parameter to allow more tool interactions

## Performance Considerations

### Optimization Tips

1. **Limit conversation history**: Adjust `lastMessages` based on needs
2. **Use semantic recall wisely**: Balance between context and performance
3. **Cache common queries**: Implement caching layer for frequent requests
4. **Batch operations**: Group multiple research queries when possible
5. **Monitor token usage**: Track and optimize LLM token consumption

## Security Considerations

1. **API Key Management**: Store keys securely in environment variables
2. **Input Validation**: Sanitize user inputs before processing
3. **Rate Limiting**: Implement rate limits on API endpoints
4. **Data Privacy**: Handle user data according to privacy regulations
5. **Access Control**: Implement proper authentication and authorization

## Testing

### Unit Tests

```typescript
// Test Master Agent prompt enhancement
test('Master Agent enhances ambiguous prompts', async () => {
  const result = await masterAgent.generate("research on CNN");
  expect(result.text).toContain("Convolutional Neural Networks");
  expect(result.text).toContain("Cable News Network");
});

// Test Research Agent
test('Research Agent provides citations', async () => {
  const result = await researchAgent.generate("quantum computing");
  expect(result.text).toMatch(/\[.*\]\(http.*\)/); // Check for citations
});

// Test Export Agent
test('Export Agent formats properly', async () => {
  const result = await exportAgent.generate("Format this content...");
  expect(result.text).toContain("# "); // Check for headings
});
```

## Contributing

When adding new agents or features:

1. Follow the existing agent structure
2. Document the agent's role and capabilities
3. Add appropriate tools and instructions
4. Update this documentation
5. Add tests for new functionality
6. Consider memory and context requirements

## License

[Your License Here]

## Support

For issues or questions:
- GitHub Issues: [Your Repo]
- Documentation: [Your Docs]
- Email: [Your Email]
