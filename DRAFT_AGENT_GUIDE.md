# Draft Agent Guide

The Draft Agent is a specialized AI agent that allows users to customize and modify research reports according to their specific requirements. It provides powerful tools for format conversion, content addition, and report restructuring.

## 🎯 Features

### Format Conversions
- **IEEE Format**: Numbered sections, numbered citations [1], [2], professional academic style
- **APA Format**: In-text citations (Author, Year), References section, proper structure
- **MLA Format**: In-text citations (Author Page#), Works Cited, academic formatting
- **Chicago/Turabian**: Footnotes/endnotes, Bibliography, formal structure
- **Custom Formats**: Any specific formatting requirements you need

### Content Modifications
- **Add Sections**: Insert new sections with custom content
- **Remove Sections**: Delete unnecessary parts
- **Restructure**: Reorder sections for better flow
- **Enhance Content**: Expand or condense existing sections
- **Merge Sections**: Combine related sections

### Smart Features
- **Context Awareness**: Remembers your report and previous modifications
- **Iterative Editing**: Make multiple changes in sequence
- **Structure Analysis**: Understands your report's current organization
- **Style Matching**: Maintains consistent tone and writing style

## 🚀 Quick Start

### Basic Usage

```typescript
import { mastra } from '@/lib/mastra';

const masterAgent = mastra.getAgent('masterAgent');
const conversationIds = {
  thread: 'my-research-session',
  resource: 'user-123',
};

// 1. Generate a research report
const researchResult = await masterAgent.generate(
  'Research quantum computing applications',
  { memory: conversationIds, maxSteps: 15 }
);
// Report is now in memory

// 2. Request modifications (agent retrieves report from memory)
const draftResult = await masterAgent.generate(
  'Convert this report to IEEE format',
  { memory: conversationIds, maxSteps: 10 }
);

console.log(draftResult.text); // Your modified report

// 3. Make more changes (agent retrieves latest version from memory)
const finalResult = await masterAgent.generate(
  'Add a System Design section',
  { memory: conversationIds, maxSteps: 10 }
);
```

### In the Chat Interface

The draft agent works seamlessly with research reports:

1. **Get a research report**: Ask the research agent to generate a report
2. **Request modifications**: Tell the agent what changes you want
3. **Iterate**: Make additional changes as needed

Example conversation:
```
User: Research quantum computing

AI: [Returns comprehensive research report]
# Quantum Computing Research
[Full report...]

User: Convert this report to IEEE format

AI: [Returns IEEE-formatted version]
# QUANTUM COMPUTING RESEARCH
**Authors**: ...
## I. INTRODUCTION
[IEEE formatted report...]

User: Now add a System Design section

AI: [Returns report with new section]
## III. SYSTEM DESIGN
[New section added...]

User: Make the abstract more detailed

AI: [Returns report with enhanced abstract]
```

**Key Point**: You don't need to paste the report! The agent remembers it from the research step.

## 📚 Common Use Cases

### 1. Format Conversion

**Convert to IEEE Format:**
```
"Convert this report to IEEE format with numbered sections and IEEE-style citations"
```

**Convert to APA Format:**
```
"Convert this to APA format with proper in-text citations and References section"
```

### 2. Adding Content

**Add a New Section:**
```
"Add a 'System Design' section after the Methodology. Include information about:
- Microservices architecture
- Database design
- API structure"
```

**Add Multiple Sections:**
```
"Add these sections:
1. Literature Review (after Introduction)
2. Future Work (before Conclusion)
3. Acknowledgments (after Conclusion)"
```

### 3. Restructuring

**Reorder Sections:**
```
"Restructure the report to follow this order:
1. Abstract
2. Introduction
3. Literature Review
4. Methodology
5. Results and Discussion (combine these)
6. Conclusion
7. References"
```

**Merge Sections:**
```
"Combine the Results and Discussion sections into a single 'Results and Discussion' section"
```

### 4. Content Enhancement

**Expand a Section:**
```
"Make the abstract more detailed, expanding it to 200-250 words"
```

**Condense Content:**
```
"Make the Methodology section more concise, reducing it to 2-3 paragraphs"
```

### 5. Multiple Modifications

You can make several changes in sequence:

```typescript
// Step 1: Convert format
await masterAgent.generate(
  'Convert to IEEE format',
  { memory: conversationIds, maxSteps: 10 }
);

// Step 2: Add section
await masterAgent.generate(
  'Add a Future Work section',
  { memory: conversationIds, maxSteps: 10 }
);

// Step 3: Enhance content
await masterAgent.generate(
  'Make the conclusion more impactful',
  { memory: conversationIds, maxSteps: 10 }
);
```

## 🧠 Memory and Context

### How Memory Works

The Draft Agent uses Mastra's memory system to:

1. **Remember Your Report**: Stores the report content in the conversation thread
2. **Track Modifications**: Keeps track of changes you've requested
3. **Maintain Context**: Understands references like "the report", "this section", "the abstract"
4. **Enable Iteration**: Allows you to build on previous modifications

### Memory Configuration

Memory is automatically configured when you use conversation IDs:

```typescript
const conversationIds = {
  thread: 'unique-session-id',    // Identifies this conversation
  resource: 'user-id',             // Identifies the user
};
```

**Best Practices:**
- Use consistent IDs within a session for context continuity
- Use different thread IDs for different reports
- The same resource ID can be used across multiple reports

### Memory Scope

- **Thread-level**: Each report modification session has its own thread
- **Cross-session**: The agent can remember preferences across sessions (same resource ID)
- **Semantic Recall**: Retrieves relevant past modifications when needed

## 🎨 Format Specifications

### IEEE Format

```markdown
# TITLE IN UPPERCASE

**Authors**: Name1, Name2, Name3

## ABSTRACT
Brief summary of the paper...

## I. INTRODUCTION
Introduction content...

## II. METHODOLOGY
Methodology content...

## III. RESULTS
Results content...

## IV. CONCLUSION
Conclusion content...

## REFERENCES
[1] Author, "Title," Journal, vol. X, no. Y, pp. Z, Year.
[2] Author, "Title," Conference, Year.
```

### APA Format

```markdown
# Title of Paper

**Running head**: SHORT TITLE

## Abstract
Abstract content (150-250 words)...

## Introduction
Introduction content (no heading)...

## Method
### Participants
### Materials
### Procedure

## Results
Results content...

## Discussion
Discussion content...

## References
Author, A. A. (Year). Title of work. Publisher.
Author, B. B., & Author, C. C. (Year). Title of article. Journal Name, volume(issue), pages.
```

### MLA Format

```markdown
Name
Instructor
Course
Date

# Title of Paper

Introduction paragraph...

Body paragraphs with in-text citations (Author Page#)...

## Works Cited
Author. "Title of Article." Journal Name, vol. X, no. Y, Year, pp. Z-ZZ.
Author. Title of Book. Publisher, Year.
```

## 🔧 Advanced Usage

### Direct Draft Agent Access

For more control, you can use the draft-agent directly:

```typescript
const draftAgent = mastra.getAgent('draftAgent');

// Analyze report structure
const analysis = await draftAgent.generate(
  `Analyze this report:\n\n${reportContent}`,
  { memory: conversationIds }
);

// Make modifications
const modified = await draftAgent.generate(
  'Convert to IEEE format',
  { memory: conversationIds, maxSteps: 10 }
);
```

### Custom Format Requirements

You can specify any custom formatting:

```
"Format this report according to these requirements:
- Use numbered sections (1, 1.1, 1.2, etc.)
- Citations should be in footnotes
- Include a table of contents
- Add page numbers
- Use Times New Roman, 12pt font (mention in output)"
```

### Batch Modifications

Process multiple reports:

```typescript
const reports = [report1, report2, report3];

for (const report of reports) {
  const threadId = `draft-${Date.now()}`;
  
  await masterAgent.generate(
    `Here's a report:\n\n${report}`,
    { memory: { thread: threadId, resource: 'user-123' } }
  );
  
  const result = await masterAgent.generate(
    'Convert to IEEE format',
    { memory: { thread: threadId, resource: 'user-123' }, maxSteps: 10 }
  );
  
  console.log(result.text);
}
```

## 💡 Tips and Best Practices

### 1. Be Specific
❌ "Make it better"
✅ "Expand the Methodology section to include more details about data collection and analysis procedures"

### 2. Provide Context
❌ "Add a section"
✅ "Add a 'System Architecture' section after the Introduction, describing the microservices design"

### 3. Iterate Gradually
Instead of requesting many changes at once, make them step by step:
1. Convert format
2. Add sections
3. Enhance content
4. Final polish

### 4. Use Consistent Sessions
Keep the same thread ID for related modifications to maintain context.

### 5. Review Changes
Always review the modified report to ensure it meets your requirements.

### 6. Ask for Clarification
If the agent asks questions, provide clear answers to get better results.

## 🐛 Troubleshooting

### Issue: Agent doesn't remember the report
**Solution**: Ensure you're using consistent conversation IDs and that you've provided the report in the same thread.

### Issue: Modifications are incomplete
**Solution**: Increase the `maxSteps` parameter to allow more processing time:
```typescript
{ memory: conversationIds, maxSteps: 15 }
```

### Issue: Format conversion is incorrect
**Solution**: Be more specific about the format requirements. Provide examples if needed.

### Issue: New sections don't match the style
**Solution**: Provide more details about the content and style you want for the new section.

## 📊 Performance

- **Simple format conversion**: 10-20 seconds
- **Adding sections**: 15-30 seconds (depending on content complexity)
- **Multiple modifications**: 30-60 seconds
- **Complex restructuring**: 30-45 seconds

## 🔐 Security and Privacy

- Reports are stored in memory only for the duration of the conversation
- Use unique thread IDs for sensitive documents
- Memory can be cleared by starting a new thread
- No reports are permanently stored unless you explicitly save them

## 📖 Examples

See `examples/draft-agent-usage.ts` for complete working examples:

1. Convert to IEEE format
2. Add new sections
3. Multiple sequential modifications
4. Convert to APA format
5. Restructure report
6. Direct draft agent usage

Run examples:
```bash
npm run examples:draft
```

## 🚀 Integration with UI

The draft agent works seamlessly with your chat interface. Users can:

1. Paste their report in the chat
2. Request modifications naturally
3. See the modified report immediately
4. Make additional changes iteratively
5. Export the final version

No special UI changes needed - it works through the existing chat interface!

## 🎯 Future Enhancements

Potential additions:
- [ ] Version history (track all modifications)
- [ ] Side-by-side comparison view
- [ ] Template library for common formats
- [ ] Batch processing UI
- [ ] Export to Word/LaTeX
- [ ] Citation management integration
- [ ] Collaborative editing

## 📞 Support

For issues or questions:
- Check the examples in `examples/draft-agent-usage.ts`
- Review the agent instructions in `lib/mastra/agents/draft-agent.ts`
- See the main documentation in `AGENTS_README.md`

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2025-10-26

Made with ❤️ using Mastra.ai
