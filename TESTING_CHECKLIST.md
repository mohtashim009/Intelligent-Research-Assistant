# Testing Checklist: Multi-Agent Research Assistant

## Pre-Testing Setup

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured in `.env.local`
  - [ ] `GOOGLE_GENERATIVE_AI_API_KEY`
  - [ ] `PERPLEXITY_API_KEY`
  - [ ] `SERPAPI_API_KEY`
- [ ] Development server running (`npm run dev`)
- [ ] No TypeScript errors (`npm run build` or check IDE)

## Unit Tests

### Master Agent Tests

- [ ] **Test 1: Basic Initialization**
  ```typescript
  const masterAgent = mastra.getAgent('masterAgent');
  expect(masterAgent).toBeDefined();
  expect(masterAgent.name).toBe('master-agent');
  ```

- [ ] **Test 2: Simple Query**
  ```typescript
  const result = await masterAgent.generate("What is AI?");
  expect(result.text).toBeTruthy();
  expect(result.text.length).toBeGreaterThan(100);
  ```

- [ ] **Test 3: Ambiguous Query Handling**
  ```typescript
  const result = await masterAgent.generate("research on CNN");
  expect(result.text).toContain("Convolutional Neural Networks" || "Cable News Network");
  ```

- [ ] **Test 4: Context Awareness**
  ```typescript
  const ids = { thread: "test-1", resource: "test-user" };
  await masterAgent.generate("Tell me about Python", { memory: ids });
  const result = await masterAgent.generate("What are its frameworks?", { memory: ids });
  expect(result.text).toContain("Django" || "Flask" || "Python");
  ```

### Research Agent Tests

- [ ] **Test 5: Direct Research Query**
  ```typescript
  const researchAgent = mastra.getAgent('researchAgent');
  const result = await researchAgent.generate("Research quantum computing");
  expect(result.text).toBeTruthy();
  expect(result.text).toContain("quantum" || "qubit");
  ```

- [ ] **Test 6: Citation Presence**
  ```typescript
  const result = await researchAgent.generate("Research AI ethics");
  expect(result.text).toMatch(/\[.*\]\(http.*\)/ || /\[\d+\]/);
  ```

- [ ] **Test 7: Multiple Sources**
  ```typescript
  const result = await researchAgent.generate("Research climate change", { maxSteps: 10 });
  // Should use multiple tools
  expect(result.text.length).toBeGreaterThan(1000);
  ```

### Export Agent Tests

- [ ] **Test 8: PDF Formatting**
  ```typescript
  const exportAgent = mastra.getAgent('exportAgent');
  const result = await exportAgent.generate(
    "Format this for PDF: # Title\n\n## Section\n\nContent here"
  );
  expect(result.text).toContain("#" || "Title");
  ```

- [ ] **Test 9: HTML Formatting**
  ```typescript
  const result = await exportAgent.generate(
    "Format this for HTML: # Title\n\nContent"
  );
  expect(result.text).toBeTruthy();
  ```

- [ ] **Test 10: Markdown Formatting**
  ```typescript
  const result = await exportAgent.generate(
    "Format this for Markdown: Title and content"
  );
  expect(result.text).toBeTruthy();
  ```

## Integration Tests

### Research Service Tests

- [ ] **Test 11: Basic Research**
  ```typescript
  const result = await ResearchService.generateResearchMessage("What is machine learning?");
  expect(result).toBeTruthy();
  expect(typeof result).toBe('string');
  ```

- [ ] **Test 12: Context Tracking**
  ```typescript
  await ResearchService.generateResearchMessage("Tell me about Python");
  const result = await ResearchService.generateResearchMessage("What are its applications?");
  expect(result).toContain("Python" || "application");
  ```

- [ ] **Test 13: Conversation Reset**
  ```typescript
  await ResearchService.generateResearchMessage("Topic A");
  ResearchService.resetConversation();
  const result = await ResearchService.generateResearchMessage("Topic B");
  // Should not reference Topic A
  expect(result).toBeTruthy();
  ```

### Export Service Tests

- [ ] **Test 14: PDF Export**
  ```typescript
  const messages = [/* test messages */];
  await ExportService.exportToPDF(messages, "Test Report");
  // Check if file is downloaded
  ```

- [ ] **Test 15: HTML Export**
  ```typescript
  const messages = [/* test messages */];
  await ExportService.exportToHTML(messages, "Test Report");
  // Check if file is downloaded
  ```

- [ ] **Test 16: Markdown Export**
  ```typescript
  const messages = [/* test messages */];
  await ExportService.exportToMarkdown(messages, "Test Report");
  // Check if file is downloaded
  ```

### API Tests

- [ ] **Test 17: Research API Endpoint**
  ```typescript
  const response = await fetch('/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: "Test query" })
  });
  expect(response.ok).toBe(true);
  const data = await response.json();
  expect(data.result).toBeTruthy();
  ```

- [ ] **Test 18: API with Memory**
  ```typescript
  const response = await fetch('/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: "Test query",
      threadId: "test-thread",
      resourceId: "test-user"
    })
  });
  expect(response.ok).toBe(true);
  ```

- [ ] **Test 19: API Error Handling**
  ```typescript
  const response = await fetch('/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}) // Missing query
  });
  expect(response.status).toBe(400);
  ```

## Memory Tests

- [ ] **Test 20: Working Memory**
  ```typescript
  const ids = { thread: "memory-test", resource: "test-user" };
  await masterAgent.generate("My name is John", { memory: ids });
  const result = await masterAgent.generate("What's my name?", { memory: ids });
  expect(result.text).toContain("John");
  ```

- [ ] **Test 21: Semantic Recall**
  ```typescript
  const ids = { thread: "recall-test", resource: "test-user" };
  // Create multiple messages
  for (let i = 0; i < 25; i++) {
    await masterAgent.generate(`Message ${i}`, { memory: ids });
  }
  // Query should recall relevant messages
  const result = await masterAgent.generate("What did we discuss?", { memory: ids });
  expect(result.text).toBeTruthy();
  ```

- [ ] **Test 22: Conversation History**
  ```typescript
  const ids = { thread: "history-test", resource: "test-user" };
  await masterAgent.generate("First message", { memory: ids });
  await masterAgent.generate("Second message", { memory: ids });
  const result = await masterAgent.generate("What did I say first?", { memory: ids });
  expect(result.text).toContain("First" || "first");
  ```

## End-to-End Tests

- [ ] **Test 23: Complete Research Flow**
  ```typescript
  // 1. Start research
  const result1 = await ResearchService.generateResearchMessage("Research AI");
  expect(result1).toBeTruthy();
  
  // 2. Follow-up question
  const result2 = await ResearchService.generateResearchMessage("What are its applications?");
  expect(result2).toBeTruthy();
  
  // 3. Export results
  const messages = [/* create from results */];
  await ExportService.exportToPDF(messages, "AI Research");
  ```

- [ ] **Test 24: Multi-Turn Conversation**
  ```typescript
  const ids = { thread: "e2e-test", resource: "test-user" };
  
  const queries = [
    "Tell me about Python",
    "What are its web frameworks?",
    "Compare Django and Flask",
    "Which one is better for beginners?"
  ];
  
  for (const query of queries) {
    const result = await masterAgent.generate(query, { memory: ids });
    expect(result.text).toBeTruthy();
  }
  ```

- [ ] **Test 25: Comparative Research**
  ```typescript
  const ids = { thread: "compare-test", resource: "test-user" };
  
  await masterAgent.generate("Research solar energy", { memory: ids });
  await masterAgent.generate("Research wind energy", { memory: ids });
  const result = await masterAgent.generate("Compare these two", { memory: ids });
  
  expect(result.text).toContain("solar" && "wind");
  ```

## Performance Tests

- [ ] **Test 26: Response Time**
  ```typescript
  const start = Date.now();
  await ResearchService.generateResearchMessage("Quick test");
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(30000); // 30 seconds
  ```

- [ ] **Test 27: Token Usage**
  ```typescript
  const result = await masterAgent.generate("Short query");
  // Check token usage in result metadata
  console.log('Token usage:', result.usage);
  ```

- [ ] **Test 28: Concurrent Requests**
  ```typescript
  const promises = Array(5).fill(null).map((_, i) =>
    ResearchService.generateResearchMessage(`Query ${i}`)
  );
  const results = await Promise.all(promises);
  expect(results.length).toBe(5);
  results.forEach(r => expect(r).toBeTruthy());
  ```

## Error Handling Tests

- [ ] **Test 29: Invalid Query**
  ```typescript
  try {
    await ResearchService.generateResearchMessage("");
    fail("Should throw error");
  } catch (error) {
    expect(error).toBeDefined();
  }
  ```

- [ ] **Test 30: Network Error**
  ```typescript
  // Simulate network error
  // Test retry logic
  ```

- [ ] **Test 31: API Key Missing**
  ```typescript
  // Temporarily remove API key
  // Test error handling
  ```

## UI Tests (if applicable)

- [ ] **Test 32: Chat Interface**
  - [ ] Send message
  - [ ] Receive response
  - [ ] Display properly formatted

- [ ] **Test 33: Export Buttons**
  - [ ] PDF export button works
  - [ ] HTML export button works
  - [ ] Markdown export button works

- [ ] **Test 34: Conversation History**
  - [ ] Previous messages displayed
  - [ ] Scroll works correctly
  - [ ] Messages formatted properly

## Security Tests

- [ ] **Test 35: Input Sanitization**
  ```typescript
  const maliciousInput = "<script>alert('xss')</script>";
  const result = await ResearchService.generateResearchMessage(maliciousInput);
  expect(result).not.toContain("<script>");
  ```

- [ ] **Test 36: API Key Protection**
  - [ ] API keys not exposed in client
  - [ ] API keys not in error messages
  - [ ] API keys not in logs

- [ ] **Test 37: Rate Limiting**
  - [ ] Multiple rapid requests handled
  - [ ] Rate limit errors handled gracefully

## Accessibility Tests

- [ ] **Test 38: Export Accessibility**
  - [ ] PDF has proper structure
  - [ ] HTML has semantic tags
  - [ ] Proper heading hierarchy

- [ ] **Test 39: UI Accessibility** (if applicable)
  - [ ] Keyboard navigation works
  - [ ] Screen reader compatible
  - [ ] Proper ARIA labels

## Browser Compatibility (if applicable)

- [ ] **Test 40: Chrome**
  - [ ] All features work
  - [ ] Export works
  - [ ] No console errors

- [ ] **Test 41: Firefox**
  - [ ] All features work
  - [ ] Export works
  - [ ] No console errors

- [ ] **Test 42: Safari**
  - [ ] All features work
  - [ ] Export works
  - [ ] No console errors

## Documentation Tests

- [ ] **Test 43: README Accuracy**
  - [ ] All examples work
  - [ ] Links are valid
  - [ ] Instructions are clear

- [ ] **Test 44: API Documentation**
  - [ ] All endpoints documented
  - [ ] Examples are correct
  - [ ] Types are accurate

- [ ] **Test 45: Code Comments**
  - [ ] All agents documented
  - [ ] All tools documented
  - [ ] Complex logic explained

## Deployment Tests

- [ ] **Test 46: Build Process**
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] **Test 47: Production Mode**
  ```bash
  npm start
  # Should run without errors
  ```

- [ ] **Test 48: Environment Variables**
  - [ ] All required vars documented
  - [ ] Default values work
  - [ ] Missing vars handled gracefully

## Final Checklist

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All end-to-end tests passing
- [ ] Performance acceptable
- [ ] Error handling robust
- [ ] Security measures in place
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Ready for deployment

## Test Results Summary

| Category | Tests | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| Unit Tests | 10 | | | |
| Integration Tests | 9 | | | |
| Memory Tests | 3 | | | |
| E2E Tests | 3 | | | |
| Performance Tests | 3 | | | |
| Error Handling | 3 | | | |
| UI Tests | 3 | | | |
| Security Tests | 3 | | | |
| Accessibility | 2 | | | |
| Browser Tests | 3 | | | |
| Documentation | 3 | | | |
| Deployment | 3 | | | |
| **Total** | **48** | | | |

## Notes

- Add any issues found during testing
- Document workarounds or known limitations
- Note any performance concerns
- List any follow-up tasks

---

**Testing Date**: _____________  
**Tester**: _____________  
**Version**: 1.0.0  
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete | ⬜ Failed
