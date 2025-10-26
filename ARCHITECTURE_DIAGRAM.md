# Multi-Agent Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (Chat / API / CLI)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RESEARCH SERVICE                            │
│  • Simplified API                                                │
│  • Automatic conversation tracking                              │
│  • Thread/Resource ID management                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MASTER AGENT                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ RESPONSIBILITIES:                                         │  │
│  │ • Analyze user intent                                     │  │
│  │ • Identify ambiguities                                    │  │
│  │ • Ask clarifying questions                                │  │
│  │ • Enhance prompts with context                            │  │
│  │ • Delegate to sub-agents                                  │  │
│  │ • Coordinate responses                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ MEMORY SYSTEM:                                            │  │
│  │ • Working Memory (user context)                           │  │
│  │ • Semantic Recall (past conversations)                    │  │
│  │ • Conversation History (20 messages)                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────┐    ┌──────────────────────────────┐
│   RESEARCH AGENT         │    │     EXPORT AGENT             │
│  ┌────────────────────┐  │    │  ┌────────────────────────┐  │
│  │ TOOLS:             │  │    │  │ CAPABILITIES:          │  │
│  │ • Perplexity AI    │  │    │  │ • PDF formatting       │  │
│  │ • Google Search    │  │    │  │ • HTML generation      │  │
│  │ • Google Scholar   │  │    │  │ • Markdown export      │  │
│  │ • Google News      │  │    │  │ • Pagination           │  │
│  │ • Google Shopping  │  │    │  │ • Professional styling │  │
│  │ • Google Maps      │  │    │  │ • Page breaks          │  │
│  │ • YouTube Search   │  │    │  └────────────────────────┘  │
│  │ • Bing Search      │  │    │                              │
│  │ • DuckDuckGo       │  │    │  ┌────────────────────────┐  │
│  │ • Baidu Search     │  │    │  │ CUSTOM TOOL:           │  │
│  │ • Yandex Search    │  │    │  │ • format-for-export    │  │
│  └────────────────────┘  │    │  └────────────────────────┘  │
│                          │    │                              │
│  ┌────────────────────┐  │    └──────────────────────────────┘
│  │ OUTPUT:            │  │
│  │ • Comprehensive    │  │
│  │   research reports │  │
│  │ • Citations        │  │
│  │ • Multi-source     │  │
│  │   verification     │  │
│  └────────────────────┘  │
└──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MEMORY STORAGE                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ LibSQL Database                                           │  │
│  │ • Conversation threads                                    │  │
│  │ • Message history                                         │  │
│  │ • Working memory                                          │  │
│  │ • Vector embeddings (semantic recall)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Conversation Flow

### Example 1: Simple Research Query

```
User: "Research quantum computing"
    │
    ▼
Master Agent
    │ (analyzes intent - clear query)
    │
    ├─→ Enhances prompt with context
    │   "Conduct comprehensive research on quantum computing..."
    │
    └─→ Delegates to Research Agent
            │
            ├─→ Perplexity Search
            ├─→ Google Scholar
            ├─→ Google News
            └─→ Cross-references
                │
                ▼
            Comprehensive Report
                │
                ▼
Master Agent (receives report)
    │
    ▼
User: [Receives formatted research report]
```

### Example 2: Ambiguous Query with Clarification

```
User: "research on CNN"
    │
    ▼
Master Agent
    │ (analyzes intent - ambiguous!)
    │
    └─→ Asks clarification:
        "Are you interested in:
         1. Convolutional Neural Networks
         2. Cable News Network"
            │
            ▼
User: "convolutional neural network"
    │
    ▼
Master Agent
    │ (now clear - enhances with context)
    │
    ├─→ Enhanced prompt:
    │   "Research Convolutional Neural Networks (CNNs),
    │    a deep learning architecture. User clarified
    │    they want the neural network, not the news
    │    network. Focus on..."
    │
    └─→ Delegates to Research Agent
            │
            ▼
        [Research process...]
            │
            ▼
User: [Receives targeted research]
```

### Example 3: Context-Aware Follow-up

```
User: "Tell me about Python"
    │
    ▼
Master Agent
    │ (stores in memory: topic = Python)
    │
    └─→ Research Agent
            │
            ▼
        Python Research
            │
            ▼
User: [Receives Python overview]
    │
    ▼
User: "What are its web frameworks?"
    │
    ▼
Master Agent
    │ (retrieves from memory: topic = Python)
    │
    ├─→ Enhanced prompt:
    │   "Research Python web frameworks.
    │    User previously asked about Python
    │    programming language. Focus on
    │    Django, Flask, FastAPI..."
    │
    └─→ Research Agent
            │
            ▼
        Framework Research
            │
            ▼
User: [Receives framework comparison]
```

### Example 4: Export Flow

```
User: "Export this as PDF"
    │
    ▼
Master Agent
    │ (recognizes export request)
    │
    ├─→ Retrieves conversation history
    │
    └─→ Delegates to Export Agent
            │
            ├─→ Analyzes content structure
            ├─→ Applies PDF formatting rules
            ├─→ Adds pagination
            ├─→ Applies professional styling
            │
            ▼
        Formatted PDF Content
            │
            ▼
Export Service
    │
    ├─→ Generates PDF with jsPDF
    ├─→ Applies final styling
    └─→ Triggers download
            │
            ▼
User: [Downloads formatted PDF]
```

## Memory System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      MEMORY SYSTEM                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ WORKING MEMORY (User Context)                           │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ • User name and preferences                         │ │    │
│  │ │ • Current research topic                            │ │    │
│  │ │ • Previous topics discussed                         │ │    │
│  │ │ • Pending questions                                 │ │    │
│  │ │ • Research history                                  │ │    │
│  │ │ • Preferred detail level                            │ │    │
│  │ │ • Preferred export format                           │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │ Scope: Thread-specific                                  │    │
│  │ Storage: Markdown template in database                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ SEMANTIC RECALL (Past Conversations)                    │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ • Vector embeddings of all messages                 │ │    │
│  │ │ • Similarity search (top 5 matches)                 │ │    │
│  │ │ • Context window (2 messages before/after)          │ │    │
│  │ │ • Relevance scoring                                 │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │ Scope: Thread-specific                                  │    │
│  │ Storage: Vector database (LibSQL)                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ CONVERSATION HISTORY (Recent Messages)                  │    │
│  │ ┌─────────────────────────────────────────────────────┐ │    │
│  │ │ • Last 20 messages                                  │ │    │
│  │ │ • User messages                                     │ │    │
│  │ │ • Assistant responses                               │ │    │
│  │ │ • Tool calls and results                            │ │    │
│  │ │ • Timestamps                                        │ │    │
│  │ └─────────────────────────────────────────────────────┘ │    │
│  │ Scope: Thread-specific                                  │    │
│  │ Storage: Relational database (LibSQL)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────┐
│  User    │
│  Input   │
└────┬─────┘
     │
     ▼
┌─────────────────────────────────────┐
│  1. Input Processing                │
│  • Sanitize input                   │
│  • Extract intent                   │
│  • Check for ambiguities            │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  2. Memory Retrieval                │
│  • Load working memory              │
│  • Retrieve conversation history    │
│  • Search semantic recall           │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  3. Prompt Enhancement              │
│  • Add conversation context         │
│  • Include relevant past messages   │
│  • Add user preferences             │
│  • Clarify ambiguities              │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  4. Agent Delegation                │
│  • Route to appropriate agent       │
│  • Pass enhanced prompt             │
│  • Set execution parameters         │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  5. Agent Execution                 │
│  • Research Agent: Multi-tool query │
│  • Export Agent: Format content     │
│  • Tool calls and results           │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  6. Response Processing             │
│  • Format response                  │
│  • Add citations                    │
│  • Apply styling                    │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  7. Memory Update                   │
│  • Store new messages               │
│  • Update working memory            │
│  • Create vector embeddings         │
└────┬────────────────────────────────┘
     │
     ▼
┌──────────┐
│  User    │
│  Output  │
└──────────┘
```

## Component Interaction Matrix

```
┌─────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Component   │ Master   │ Research │ Export   │ Memory   │ User     │
│             │ Agent    │ Agent    │ Agent    │ System   │ Interface│
├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Master      │    -     │ Delegates│ Delegates│ Read/    │ Receives │
│ Agent       │          │ research │ export   │ Write    │ input    │
├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Research    │ Returns  │    -     │    -     │    -     │    -     │
│ Agent       │ results  │          │          │          │          │
├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Export      │ Returns  │    -     │    -     │    -     │    -     │
│ Agent       │ formatted│          │          │          │          │
├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Memory      │ Provides │    -     │    -     │    -     │    -     │
│ System      │ context  │          │          │          │          │
├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ User        │ Sends    │    -     │    -     │    -     │    -     │
│ Interface   │ queries  │          │          │          │          │
└─────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Frontend:                                                        │
│  • Next.js 15.4.6                                                │
│  • React 19.1.0                                                  │
│  • TypeScript 5.x                                                │
│  • Tailwind CSS 4.x                                              │
│                                                                   │
│  Backend:                                                         │
│  • Mastra.ai (Multi-agent framework)                             │
│  • Google Gemini 2.5 Flash (LLM)                                 │
│  • LibSQL (Memory storage)                                       │
│                                                                   │
│  APIs & Tools:                                                    │
│  • Perplexity AI (Real-time search)                              │
│  • SerpAPI (Google services)                                     │
│  • jsPDF (PDF generation)                                        │
│                                                                   │
│  Development:                                                     │
│  • npm/yarn (Package management)                                 │
│  • ESLint (Code quality)                                         │
│  • Git (Version control)                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

**Note**: This diagram provides a visual representation of the multi-agent architecture. For detailed implementation information, see the other documentation files.
