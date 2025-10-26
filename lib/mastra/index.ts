import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { masterAgent } from './agents/master-agent';
import { researchAgent } from './agents/research-agent';
import { exportAgent } from './agents/export-agent';

/**
 * Main Mastra instance with multi-agent architecture
 * 
 * Architecture:
 * - Master Agent: Orchestrates and enhances prompts with context
 * - Research Agent: Conducts deep research with multiple sources
 * - Export Agent: Formats and prepares documents for export
 * 
 * Note: Lazy-loaded to avoid initialization during build phase
 */

let mastraInstance: Mastra | null = null;

function initMastra(): Mastra {
  if (!mastraInstance) {
    mastraInstance = new Mastra({
      agents: {
        masterAgent,
        researchAgent,
        exportAgent,
      },
      storage: new LibSQLStore({
        url: 'file:./mastra-memory.db',
      }),
      vectors: {
        default: new LibSQLVector({
          connectionUrl: 'file:./mastra-memory.db',
        }),
      },
    });
  }

  return mastraInstance;
}

// Lazy-loaded mastra instance
export const mastra = {
  getAgent: (name: string) => initMastra().getAgent(name),
  // Add other methods as needed
} as Mastra;

// Export agents for direct access if needed
export { masterAgent, researchAgent, exportAgent };
