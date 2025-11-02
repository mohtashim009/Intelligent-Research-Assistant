# Agent Routing Guide

## How Requests Are Routed

The master-agent analyzes user requests and routes them to the appropriate sub-agent:

### Research Requests → Research Agent
**Triggers:**
- "Research [topic]"
- "Tell me about [topic]"
- "What is [topic]"
- "Investigate [topic]"
- "Find information on [topic]"

**Example:**
```
User: "Research quantum computing"
Master → Research Agent → [Full research report]
```

### Modification Requests → Draft Agent
**Triggers:**
- "Convert to [format]"
- "Add a section about [topic]"
- "Restructure [section]"
- "Change the format to [format]"
- "Modify [aspect]"
- "Enhance [section]"

**Example:**
```
User: "Convert this to IEEE format"
Master → Draft Agent (with report from memory) → [Modified report]
```

### Export Requests → Export Agent
**Triggers:**
- "Export as [format]"
- "Download as [format]"
- "Save as [format]"
- "Generate [format] file"

**Example:**
```
User: "Export as PDF"
Master → Export Agent → [Formatted export]
```

## Master Agent Responsibilities

1. **Context Enhancement**
   - Reviews conversation history
   - Identifies ambiguities
   - Asks clarifying questions when needed

2. **Task Delegation**
   - Routes to appropriate sub-agent
   - Passes necessary context and data
   - Waits for results

3. **Quality Assurance**
   - Verifies task completion
   - Returns complete results
   - Offers refinements

## Memory System

### Thread & Resource IDs
- **Thread ID**: Unique per conversation session
- **Resource ID**: Unique per user
- **Purpose**: Maintains context across multiple requests

### What's Stored
- Last 20 messages
- Working memory (user preferences, current topic, etc.)
- Semantic embeddings for recall

### How It's Used
- Draft agent retrieves previous reports
- Master agent enhances prompts with context
- Export agent accesses conversation history

## Common Patterns

### Pattern 1: Research → Modify
```
1. User: "Research AI ethics"
   → Research Agent generates report
   → Report stored in memory

2. User: "Convert to IEEE format"
   → Master retrieves report from memory
   → Draft Agent modifies format
   → Modified report returned
```

### Pattern 2: Research → Add Content → Export
```
1. User: "Research blockchain"
   → Research Agent generates report

2. User: "Add a section on smart contracts"
   → Draft Agent adds section

3. User: "Export as PDF"
   → Export Agent formats for PDF
```

### Pattern 3: Iterative Modifications
```
1. User: "Research machine learning"
   → Research Agent generates report

2. User: "Convert to IEEE format"
   → Draft Agent converts format

3. User: "Add a methodology section"
   → Draft Agent adds section to IEEE report

4. User: "Enhance the abstract"
   → Draft Agent modifies abstract in IEEE report
```

## Debugging Tips

### Check Agent Routing
Look for these logs in the console:
```
Research API route called
Research query received: [query]
🔧 Using [tool-name]...
✅ [tool-name] completed
```

### Verify Memory
Check that thread/resource IDs are consistent:
```javascript
// In ResearchService
threadId: "thread-1234567890-abc123"
resourceId: "user-xyz789"
```

### Test Agent Responses
1. **Research Agent**: Should return full markdown report
2. **Draft Agent**: Should modify existing report
3. **Master Agent**: Should route correctly and return complete results

## Troubleshooting

### Issue: Draft agent asks for report content
**Cause**: Master agent not passing report from memory
**Fix**: Ensure API uses masterAgent, not researchAgent

### Issue: Modifications don't persist
**Cause**: Memory not working or thread IDs changing
**Fix**: Check thread/resource ID consistency

### Issue: Agent doesn't understand request
**Cause**: Ambiguous prompt or missing context
**Solution**: Master agent should ask clarifying questions

### Issue: No response or timeout
**Cause**: Tool execution failure or API error
**Fix**: Check console logs for tool errors
