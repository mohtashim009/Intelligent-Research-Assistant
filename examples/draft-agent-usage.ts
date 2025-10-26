/**
 * Draft Agent Usage Examples
 * 
 * Demonstrates how to use the draft-agent to modify and customize research reports
 */

import { mastra } from '@/lib/mastra';

// Example report content
const sampleReport = `# Quantum Computing Research

## Abstract
Quantum computing represents a paradigm shift in computational capabilities...

## Introduction
Quantum computers leverage quantum mechanical phenomena...

## Methodology
Our research methodology involved analyzing various quantum algorithms...

## Results
The experimental results demonstrate significant improvements...

## Conclusion
This research shows promising applications of quantum computing...

## References
[1] Nielsen, M. A., & Chuang, I. L. (2010). Quantum Computation and Quantum Information.
[2] Preskill, J. (2018). Quantum Computing in the NISQ era and beyond.
`;

/**
 * Example 1: Research then Convert to IEEE format
 * This shows the proper flow: research first, then modify
 */
export async function example1_ConvertToIEEE() {
  console.log('\n=== Example 1: Research then Convert to IEEE Format ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const conversationIds = {
    thread: 'draft-example-1',
    resource: 'user-draft-demo',
  };

  // Step 1: Generate research report (this would normally use research-agent)
  // For demo purposes, we'll simulate by providing a report
  console.log('Step 1: Generating research report...');
  await masterAgent.generate(
    `Here's my research report:\n\n${sampleReport}`,
    { memory: conversationIds }
  );

  // Step 2: Request IEEE format conversion
  // The agent retrieves the report from memory automatically
  console.log('Step 2: Converting to IEEE format...');
  const result = await masterAgent.generate(
    'Convert this report to IEEE format with numbered sections and IEEE-style citations',
    { memory: conversationIds, maxSteps: 10 }
  );

  console.log('IEEE Formatted Report:');
  console.log(result.text);
}

/**
 * Example 2: Research then Add a new section
 * Shows how to add content after research
 */
export async function example2_AddSection() {
  console.log('\n=== Example 2: Research then Add System Design Section ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const conversationIds = {
    thread: 'draft-example-2',
    resource: 'user-draft-demo',
  };

  // Step 1: Generate research report
  console.log('Step 1: Generating research report...');
  await masterAgent.generate(
    `Here's my research report:\n\n${sampleReport}`,
    { memory: conversationIds }
  );

  // Step 2: Request to add a new section
  // The agent automatically retrieves the report from memory
  console.log('Step 2: Adding System Design section...');
  const result = await masterAgent.generate(
    `Add a "System Design" section after the Methodology section. Include information about:
    - Microservices architecture
    - Quantum circuit design
    - Integration with classical systems`,
    { memory: conversationIds, maxSteps: 10 }
  );

  console.log('Report with New Section:');
  console.log(result.text);
}

/**
 * Example 3: Multiple modifications in sequence
 */
export async function example3_MultipleModifications() {
  console.log('\n=== Example 3: Multiple Modifications ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const conversationIds = {
    thread: 'draft-example-3',
    resource: 'user-draft-demo',
  };

  // Provide the report
  await masterAgent.generate(
    `Here's my research report:\n\n${sampleReport}`,
    { memory: conversationIds }
  );

  // First modification: Convert to IEEE
  console.log('Step 1: Converting to IEEE format...');
  await masterAgent.generate(
    'Convert this to IEEE format',
    { memory: conversationIds, maxSteps: 10 }
  );

  // Second modification: Add section
  console.log('Step 2: Adding Future Work section...');
  await masterAgent.generate(
    'Add a "Future Work" section before the Conclusion with 3-4 bullet points about potential research directions',
    { memory: conversationIds, maxSteps: 10 }
  );

  // Third modification: Enhance abstract
  console.log('Step 3: Enhancing abstract...');
  const result = await masterAgent.generate(
    'Make the abstract more detailed, expanding it to 150-200 words',
    { memory: conversationIds, maxSteps: 10 }
  );

  console.log('Final Modified Report:');
  console.log(result.text);
}

/**
 * Example 4: Convert to APA format
 */
export async function example4_ConvertToAPA() {
  console.log('\n=== Example 4: Convert to APA Format ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const conversationIds = {
    thread: 'draft-example-4',
    resource: 'user-draft-demo',
  };

  await masterAgent.generate(
    `Here's my research report:\n\n${sampleReport}`,
    { memory: conversationIds }
  );

  const result = await masterAgent.generate(
    'Convert this report to APA format with proper in-text citations (Author, Year) and a References section',
    { memory: conversationIds, maxSteps: 10 }
  );

  console.log('APA Formatted Report:');
  console.log(result.text);
}

/**
 * Example 5: Restructure report sections
 */
export async function example5_RestructureReport() {
  console.log('\n=== Example 5: Restructure Report ===\n');
  
  const masterAgent = mastra.getAgent('masterAgent');
  const conversationIds = {
    thread: 'draft-example-5',
    resource: 'user-draft-demo',
  };

  await masterAgent.generate(
    `Here's my research report:\n\n${sampleReport}`,
    { memory: conversationIds }
  );

  const result = await masterAgent.generate(
    `Restructure this report to follow this order:
    1. Title and Abstract
    2. Introduction and Background (combine intro with background info)
    3. Literature Review (add this new section)
    4. Methodology
    5. Results and Discussion (combine these)
    6. Conclusion and Future Work
    7. References`,
    { memory: conversationIds, maxSteps: 10 }
  );

  console.log('Restructured Report:');
  console.log(result.text);
}

/**
 * Example 6: Direct draft agent usage (without master agent)
 */
export async function example6_DirectDraftAgent() {
  console.log('\n=== Example 6: Direct Draft Agent Usage ===\n');
  
  const draftAgent = mastra.getAgent('draftAgent');
  const conversationIds = {
    thread: 'draft-direct-example',
    resource: 'user-draft-demo',
  };

  // Analyze the report first
  const analysisResult = await draftAgent.generate(
    `Analyze this report and tell me its current structure:\n\n${sampleReport}`,
    { memory: conversationIds }
  );

  console.log('Report Analysis:');
  console.log(analysisResult.text);

  // Then modify it
  const modificationResult = await draftAgent.generate(
    'Convert this report to IEEE format with numbered sections',
    { memory: conversationIds, maxSteps: 10 }
  );

  console.log('\nModified Report:');
  console.log(modificationResult.text);
}

/**
 * Run all examples
 */
export async function runDraftExamples() {
  try {
    await example1_ConvertToIEEE();
    await example2_AddSection();
    await example3_MultipleModifications();
    await example4_ConvertToAPA();
    await example5_RestructureReport();
    await example6_DirectDraftAgent();
    
    console.log('\n✅ All draft agent examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runDraftExamples();
}
