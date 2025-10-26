/**
 * Multi-Agent Architecture Usage Examples
 * 
 * This file demonstrates various ways to use the multi-agent research assistant
 */

import { mastra } from '@/lib/mastra';
import { ResearchService } from '@/lib/research-service';
import { ExportService } from '@/lib/mastra/export-service';
import { Message } from '@/types/schema';
import { MessageType } from '@/types/enums';

// ============================================================================
// Example 1: Basic Research Query
// ============================================================================

async function example1_BasicResearch() {
  console.log('=== Example 1: Basic Research ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  
  const result = await masterAgent.generate(
    "Research the latest developments in quantum computing",
    {
      memory: {
        thread: "example-1-thread",
        resource: "example-user"
      },
      maxSteps: 10
    }
  );
  
  console.log('Research Result:');
  console.log(result.text);
  console.log('\n');
}

// ============================================================================
// Example 2: Context-Aware Conversation
// ============================================================================

async function example2_ContextAwareConversation() {
  console.log('=== Example 2: Context-Aware Conversation ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const conversationIds = {
    thread: "example-2-thread",
    resource: "example-user"
  };
  
  // First message
  console.log('User: Tell me about Python programming language');
  const result1 = await masterAgent.generate(
    "Tell me about Python programming language",
    { memory: conversationIds, maxSteps: 10 }
  );
  console.log('Assistant:', result1.text.substring(0, 200) + '...\n');
  
  // Follow-up - Master Agent remembers context
  console.log('User: What are its main web frameworks?');
  const result2 = await masterAgent.generate(
    "What are its main web frameworks?",
    { memory: conversationIds, maxSteps: 10 }
  );
  console.log('Assistant:', result2.text.substring(0, 200) + '...\n');
  
  // Another follow-up
  console.log('User: Compare Django and Flask');
  const result3 = await masterAgent.generate(
    "Compare Django and Flask",
    { memory: conversationIds, maxSteps: 10 }
  );
  console.log('Assistant:', result3.text.substring(0, 200) + '...\n');
}

// ============================================================================
// Example 3: Handling Ambiguous Queries
// ============================================================================

async function example3_AmbiguousQuery() {
  console.log('=== Example 3: Handling Ambiguous Queries ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const conversationIds = {
    thread: "example-3-thread",
    resource: "example-user"
  };
  
  // Ambiguous query
  console.log('User: research on CNN');
  const result1 = await masterAgent.generate(
    "research on CNN",
    { memory: conversationIds, maxSteps: 10 }
  );
  console.log('Assistant:', result1.text.substring(0, 300) + '...\n');
  
  // Clarification
  console.log('User: convolutional neural network');
  const result2 = await masterAgent.generate(
    "convolutional neural network",
    { memory: conversationIds, maxSteps: 10 }
  );
  console.log('Assistant:', result2.text.substring(0, 300) + '...\n');
}

// ============================================================================
// Example 4: Using Research Service (Simplified API)
// ============================================================================

async function example4_ResearchService() {
  console.log('=== Example 4: Using Research Service ===\n');
  
  // First query - automatically creates a conversation
  console.log('Query 1: What is machine learning?');
  const result1 = await ResearchService.generateResearchMessage(
    "What is machine learning?"
  );
  console.log('Result:', result1.substring(0, 200) + '...\n');
  
  // Follow-up query - uses same conversation context
  console.log('Query 2: What are its main applications?');
  const result2 = await ResearchService.generateResearchMessage(
    "What are its main applications?"
  );
  console.log('Result:', result2.substring(0, 200) + '...\n');
  
  // Start a new conversation
  console.log('Starting new conversation...');
  ResearchService.resetConversation();
  
  console.log('Query 3: Tell me about blockchain');
  const result3 = await ResearchService.generateResearchMessage(
    "Tell me about blockchain"
  );
  console.log('Result:', result3.substring(0, 200) + '...\n');
}

// ============================================================================
// Example 5: Direct Agent Access
// ============================================================================

async function example5_DirectAgentAccess() {
  console.log('=== Example 5: Direct Agent Access ===\n');
  
  // Access research agent directly (bypasses master agent)
  const researchAgent = mastra.getAgent('researchAgent');
  
  console.log('Direct research query to Research Agent:');
  const result = await researchAgent.generate(
    "Research the environmental impact of electric vehicles",
    { maxSteps: 10 }
  );
  console.log('Result:', result.text.substring(0, 300) + '...\n');
}

// ============================================================================
// Example 6: Export Functionality
// ============================================================================

async function example6_ExportFunctionality() {
  console.log('=== Example 6: Export Functionality ===\n');
  
  // Simulate some research messages
  const messages: Message[] = [
    {
      id: 'msg-1',
      type: MessageType.AI,
      status: 'sent' as any, // MessageStatus.SENT
      content: `# Quantum Computing Research

## Executive Summary
Quantum computing represents a paradigm shift in computational capabilities...

## Key Findings
- Quantum computers use qubits instead of classical bits
- Superposition and entanglement enable parallel processing
- Current applications include cryptography and optimization

## Detailed Analysis
### Hardware Developments
Recent advances in quantum hardware have focused on...

### Software and Algorithms
Quantum algorithms like Shor's and Grover's demonstrate...

## Conclusions
Quantum computing is rapidly evolving...

## Sources
1. Nature Physics - Quantum Computing Review
2. IBM Quantum Computing Research
3. Google Quantum AI`,
      timestamp: new Date()
    }
  ];
  
  console.log('Exporting research report...');
  
  // Export to different formats
  try {
    await ExportService.exportToPDF(messages, "Quantum Computing Research");
    console.log('✓ PDF export successful');
  } catch (error) {
    console.log('✗ PDF export failed:', error);
  }
  
  try {
    await ExportService.exportToHTML(messages, "Quantum Computing Research");
    console.log('✓ HTML export successful');
  } catch (error) {
    console.log('✗ HTML export failed:', error);
  }
  
  try {
    await ExportService.exportToMarkdown(messages, "Quantum Computing Research");
    console.log('✓ Markdown export successful');
  } catch (error) {
    console.log('✗ Markdown export failed:', error);
  }
  
  console.log('\n');
}

// ============================================================================
// Example 7: Multi-Turn Research Session
// ============================================================================

async function example7_MultiTurnResearch() {
  console.log('=== Example 7: Multi-Turn Research Session ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const sessionIds = {
    thread: `research-session-${Date.now()}`,
    resource: "researcher-user"
  };
  
  const queries = [
    "Research artificial intelligence",
    "Focus on natural language processing",
    "How is it used in chatbots?",
    "What are the ethical considerations?"
  ];
  
  for (const query of queries) {
    console.log(`\nUser: ${query}`);
    const result = await masterAgent.generate(query, {
      memory: sessionIds,
      maxSteps: 10
    });
    console.log(`Assistant: ${result.text.substring(0, 150)}...\n`);
  }
}

// ============================================================================
// Example 8: Comparative Research
// ============================================================================

async function example8_ComparativeResearch() {
  console.log('=== Example 8: Comparative Research ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const comparisonIds = {
    thread: "comparison-study",
    resource: "analyst-user"
  };
  
  // Research multiple topics
  const topics = ["solar energy", "wind energy", "hydroelectric power"];
  
  for (const topic of topics) {
    console.log(`\nResearching: ${topic}`);
    await masterAgent.generate(`Research ${topic}`, {
      memory: comparisonIds,
      maxSteps: 10
    });
    console.log(`✓ Completed research on ${topic}`);
  }
  
  // Compare all topics
  console.log('\nRequesting comparison...');
  const comparison = await masterAgent.generate(
    "Compare these three energy sources in terms of efficiency, cost, and environmental impact",
    { memory: comparisonIds, maxSteps: 10 }
  );
  
  console.log('Comparison Result:');
  console.log(comparison.text.substring(0, 400) + '...\n');
}

// ============================================================================
// Example 9: Error Handling
// ============================================================================

async function example9_ErrorHandling() {
  console.log('=== Example 9: Error Handling ===\n');
  
  try {
    const result = await ResearchService.generateResearchMessage(
      "Research quantum computing"
    );
    console.log('✓ Research successful');
  } catch (error) {
    console.error('✗ Research failed:', error);
    
    // Retry with different approach
    console.log('Retrying with direct agent access...');
    try {
      const researchAgent = mastra.getAgent('researchAgent');
      const result = await researchAgent.generate(
        "Research quantum computing",
        { maxSteps: 5 }
      );
      console.log('✓ Retry successful');
    } catch (retryError) {
      console.error('✗ Retry also failed:', retryError);
    }
  }
  
  console.log('\n');
}

// ============================================================================
// Example 10: Custom Memory Configuration
// ============================================================================

async function example10_CustomMemoryConfig() {
  console.log('=== Example 10: Custom Memory Configuration ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  
  // Use custom memory configuration
  const result = await masterAgent.generate(
    "Research blockchain technology",
    {
      memory: {
        thread: {
          id: "custom-thread-123",
          metadata: {
            topic: "blockchain",
            priority: "high",
            tags: ["technology", "cryptocurrency"]
          },
          title: "Blockchain Research Session"
        },
        resource: "power-user",
        options: {
          lastMessages: 30, // Override default
          semanticRecall: {
            topK: 10,
            messageRange: 3
          }
        }
      },
      maxSteps: 15
    }
  );
  
  console.log('Research with custom memory config:');
  console.log(result.text.substring(0, 200) + '...\n');
}

// ============================================================================
// Main Execution
// ============================================================================

async function runExamples() {
  console.log('\n🚀 Multi-Agent Architecture Examples\n');
  console.log('=' .repeat(80) + '\n');
  
  try {
    // Run examples (comment out the ones you don't want to run)
    
    // await example1_BasicResearch();
    // await example2_ContextAwareConversation();
    // await example3_AmbiguousQuery();
    // await example4_ResearchService();
    // await example5_DirectAgentAccess();
    // await example6_ExportFunctionality();
    // await example7_MultiTurnResearch();
    // await example8_ComparativeResearch();
    // await example9_ErrorHandling();
    // await example10_CustomMemoryConfig();
    
    console.log('✅ All examples completed successfully!\n');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Uncomment to run examples
// runExamples();

// Export examples for individual use
export {
  example1_BasicResearch,
  example2_ContextAwareConversation,
  example3_AmbiguousQuery,
  example4_ResearchService,
  example5_DirectAgentAccess,
  example6_ExportFunctionality,
  example7_MultiTurnResearch,
  example8_ComparativeResearch,
  example9_ErrorHandling,
  example10_CustomMemoryConfig,
  runExamples
};
