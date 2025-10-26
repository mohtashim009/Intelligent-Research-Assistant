export class ResearchService {
  private static threadId: string | null = null;
  private static resourceId: string | null = null;

  /**
   * Initialize or get thread and resource IDs for conversation continuity
   */
  private static getConversationIds(): { threadId: string; resourceId: string } {
    if (!this.threadId) {
      // Generate unique IDs for this session
      this.threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.resourceId = `user-${Math.random().toString(36).substr(2, 9)}`;
    }
    return {
      threadId: this.threadId,
      resourceId: this.resourceId,
    };
  }

  /**
   * Reset conversation context (start a new conversation)
   */
  static resetConversation(): void {
    this.threadId = null;
    this.resourceId = null;
  }

  /**
   * Generate research message with conversation context
   */
  static async generateResearchMessage(query: string): Promise<string> {
    console.log('Research service called with query:', query);
    
    try {
      const { threadId, resourceId } = this.getConversationIds();
      
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          threadId,
          resourceId,
        }),
      });

      console.log('Research API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Research API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Research API response received');
      return data.result;
    } catch (error) {
      console.error('Research service error:', error);
      throw error;
    }
  }
}
