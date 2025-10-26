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
 * Storage and vectors are optional on Vercel (serverless environment)
 */

let mastraInstance: Mastra | null = null;

function initMastra(): Mastra {
  if (!mastraInstance) {
    // Check if running on Vercel
    const isVercel = process.env.VERCEL === '1';
    const connectionUrl = isVercel
      ? process.env.TURSO_DATABASE_URL
      : 'file:./mastra-memory.db';

    // Only create storage and vectors if we have a valid connection
    const config: any = {
      agents: {
        masterAgent,
        researchAgent,
        exportAgent,
      },
    };

    // Only add storage and vectors in development or if Turso is configured
    if (connectionUrl && !isVercel) {
      try {
        config.storage = new LibSQLStore({
          url: connectionUrl,
        });
        config.vectors = {
          default: new LibSQLVector({
            connectionUrl,
          }),
        };
      } catch (error) {
        console.warn('Storage/vectors initialization failed, running without persistence:', error);
      }
    } else if (connectionUrl && isVercel && process.env.TURSO_AUTH_TOKEN) {
      // Turso is configured on Vercel
      try {
        config.storage = new LibSQLStore({
          url: connectionUrl,
          authToken: process.env.TURSO_AUTH_TOKEN,
        });
        config.vectors = {
          default: new LibSQLVector({
            connectionUrl,
            authToken: process.env.TURSO_AUTH_TOKEN,
          }),
        };
      } catch (error) {
        console.warn('Turso initialization failed, running without persistence:', error);
      }
    }

    mastraInstance = new Mastra(config);
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
