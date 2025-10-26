# Draft Agent Quick Reference

## 🚀 Quick Start

```typescript
// 1. Provide your report
await masterAgent.generate(
  `Here's my report:\n\n${reportContent}`,
  { memory: { thread: "session-1", resource: "user-1" } }
);

// 2. Request modifications
await masterAgent.generate(
  "Convert to IEEE format",
  { memory: { thread: "session-1", resource: "user-1" }, maxSteps: 10 }
);
```

## 📋 Common Commands

### Format Conversion

| Command | Result |
|---------|--------|
| `"Convert to IEEE format"` | IEEE-style with numbered sections and citations |
| `"Convert to APA format"` | APA-style with (Author, Year) citations |
| `"Convert to MLA format"` | MLA-style with (Author Page#) citations |
| `"Convert to Chicago format"` | Chicago-style with footnotes |

### Adding Content

| Command | Result |
|---------|--------|
| `"Add a System Design section"` | Adds new section (will ask for content) |
| `"Add a Future Work section before Conclusion"` | Adds section at specific location |
| `"Add an Acknowledgments section at the end"` | Adds section at end |

### Modifying Content

| Command | Result |
|---------|--------|
| `"Make the abstract more detailed"` | Expands abstract |
| `"Make the Methodology section more concise"` | Condenses section |
| `"Enhance the conclusion"` | Improves conclusion |

### Restructuring

| Command | Result |
|---------|--------|
| `"Move the Results section before Methodology"` | Reorders sections |
| `"Combine Results and Discussion"` | Merges sections |
| `"Split the Introduction into Background and Motivation"` | Splits section |

## 🎯 Format Templates

### IEEE Format
```markdown
# TITLE IN UPPERCASE

**Authors**: Name1, Name2

## ABSTRACT
Brief summary...

## I. INTRODUCTION
Content...

## II. METHODOLOGY
Content...

## REFERENCES
[1] Citation format...
```

### APA Format
```markdown
# Title of Paper

**Running head**: SHORT TITLE

## Abstract
150-250 words...

## Introduction
Content (no heading)...

## Method
Content...

## References
Author, A. A. (Year). Title...
```

### MLA Format
```markdown
Name
Instructor
Course
Date

# Title

Content with (Author Page#) citations...

## Works Cited
Author. "Title." Journal...
```

## 💡 Pro Tips

### 1. Be Specific
✅ "Convert to IEEE format with numbered sections and IEEE-style citations"
❌ "Make it better"

### 2. Iterate Gradually
```
Step 1: Convert format
Step 2: Add sections
Step 3: Enhance content
```

### 3. Use Same Thread
```typescript
const ids = { thread: "session-1", resource: "user-1" };
// Use same ids for all modifications
```

### 4. Provide Context
✅ "Add a System Design section after Introduction, describing microservices"
❌ "Add a section"

## 🔧 Configuration

### Memory Settings
```typescript
const conversationIds = {
  thread: 'unique-session-id',  // One per editing session
  resource: 'user-id',           // One per user
};
```

### Max Steps
```typescript
{ maxSteps: 10 }  // Simple modifications
{ maxSteps: 15 }  // Complex modifications
```

## 📊 Performance

| Operation | Time |
|-----------|------|
| Format conversion | 10-20s |
| Add section | 15-30s |
| Multiple mods | 30-60s |
| Restructure | 30-45s |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent doesn't remember report | Use consistent thread ID |
| Modifications incomplete | Increase maxSteps |
| Format incorrect | Be more specific about requirements |
| New section doesn't match style | Provide more details about content |

## 📖 Examples

### Example 1: Simple Conversion
```typescript
// Provide report
await masterAgent.generate(
  `Here's my report:\n\n${report}`,
  { memory: ids }
);

// Convert
const result = await masterAgent.generate(
  "Convert to IEEE format",
  { memory: ids, maxSteps: 10 }
);
```

### Example 2: Add Section
```typescript
// After providing report
const result = await masterAgent.generate(
  `Add a System Design section with:
  - Microservices architecture
  - Database design
  - API structure`,
  { memory: ids, maxSteps: 10 }
);
```

### Example 3: Multiple Changes
```typescript
// Step 1
await masterAgent.generate(
  "Convert to IEEE format",
  { memory: ids, maxSteps: 10 }
);

// Step 2
await masterAgent.generate(
  "Add Future Work section",
  { memory: ids, maxSteps: 10 }
);

// Step 3
const result = await masterAgent.generate(
  "Enhance the abstract",
  { memory: ids, maxSteps: 10 }
);
```

## 🎨 Chat Interface Usage

### Natural Conversation
```
User: Research quantum computing

AI: [Returns comprehensive research report]
# Quantum Computing Research
[Full report stored in memory]

User: Convert this report to IEEE format

AI: [Retrieves report from memory, returns IEEE version]
# QUANTUM COMPUTING RESEARCH
[IEEE formatted report...]

User: Now add a System Design section

AI: I'll add a System Design section. What specific aspects 
    should I cover?

User: Include microservices architecture and database design

AI: [Retrieves IEEE report, returns with new section]
## II. SYSTEM DESIGN
[New section added...]
```

**Key Point**: You don't need to paste the report - it's already in memory from the research step!

## 🔗 Related Documentation

- **[Full Guide](../DRAFT_AGENT_GUIDE.md)** - Complete documentation
- **[Examples](../examples/draft-agent-usage.ts)** - Code examples
- **[Flow Diagrams](./draft-agent-flow.md)** - Visual guides
- **[Main README](../AGENTS_README.md)** - System overview

## 📞 Quick Help

**Need help?**
1. Check examples: `examples/draft-agent-usage.ts`
2. Read full guide: `DRAFT_AGENT_GUIDE.md`
3. Review flow diagrams: `docs/draft-agent-flow.md`

**Test it:**
```bash
npm run dev
# Open chat, paste report, request modifications
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-26
