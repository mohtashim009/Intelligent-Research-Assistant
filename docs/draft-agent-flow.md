# Draft Agent Flow Diagram

## User Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
│                                                              │
│  Step 1: "Research quantum computing"                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Master Agent                              │
│  → Delegates to Research Agent                              │
│  → Returns full research report                             │
│  → Report stored in memory                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
│                                                              │
│  Step 2: "Convert this report to IEEE format"              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Chat Interface                            │
│                                                              │
│  • Receives user message                                    │
│  • Sends to Master Agent                                    │
│  • Displays response                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Master Agent                              │
│                                                              │
│  1. Analyzes request: "draft modification"                  │
│  2. Retrieves report from conversation memory               │
│  3. Delegates to Draft Agent with report content            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Draft Agent                               │
│                                                              │
│  1. Uses analyzeReport tool                                 │
│     • Identifies sections                                   │
│     • Detects current format                                │
│     • Analyzes structure                                    │
│                                                              │
│  2. Uses modifyReport tool                                  │
│     • Applies format conversion                             │
│     • Modifies content                                      │
│     • Ensures consistency                                   │
│                                                              │
│  3. Returns modified report                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Memory System                             │
│                                                              │
│  • Stores modified report                                   │
│  • Updates conversation history                             │
│  • Enables iterative editing                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                         User                                 │
│                                                              │
│  Receives: IEEE-formatted report                            │
│  Can request: Additional modifications                      │
└─────────────────────────────────────────────────────────────┘
```

## Memory Flow

```
Session Start
     │
     ▼
┌─────────────────────┐
│ User requests       │
│ research            │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Research Agent      │
│ generates report    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Report stored in    │
│ Thread Memory       │
│                     │
│ thread: "session-1" │
│ resource: "user-1"  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ User requests       │
│ modification        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Draft Agent         │
│ retrieves report    │
│ from memory         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Modified report     │
│ stored in memory    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ User can make       │
│ more changes        │
│ (iterative)         │
└─────────────────────┘
```

## Format Conversion Process

```
Original Report (Markdown)
         │
         ▼
┌────────────────────┐
│ analyzeReport      │
│                    │
│ • Extract sections │
│ • Detect format    │
│ • Count words      │
│ • Find citations   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Format Detection   │
│                    │
│ Current: Markdown  │
│ Target: IEEE       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ modifyReport       │
│                    │
│ • Convert sections │
│   to Roman nums    │
│ • Convert citations│
│   to [1], [2]      │
│ • Format refs      │
│ • Add IEEE header  │
└─────────┬──────────┘
          │
          ▼
IEEE-Formatted Report
```

## Multi-Step Modification

```
Original Report
     │
     ▼
Step 1: Convert to IEEE
     │
     ▼
IEEE Report (stored in memory)
     │
     ▼
Step 2: Add System Design section
     │
     ▼
IEEE Report + New Section (stored in memory)
     │
     ▼
Step 3: Enhance abstract
     │
     ▼
Final Report (stored in memory)
```

## Tool Execution Flow

```
Draft Agent receives request
         │
         ▼
    ┌────────────────┐
    │ Should I use   │
    │ analyzeReport? │
    └────┬───────────┘
         │
    Yes  │  No
    ┌────┴────┐
    ▼         ▼
┌─────────┐  ┌──────────────┐
│ Analyze │  │ Proceed with │
│ report  │  │ modification │
│ structure│  └──────┬───────┘
└────┬────┘         │
     │              │
     └──────┬───────┘
            ▼
    ┌───────────────┐
    │ modifyReport  │
    │               │
    │ • Apply       │
    │   changes     │
    │ • Maintain    │
    │   quality     │
    └───────┬───────┘
            │
            ▼
    Return modified report
```

## Comparison: With vs Without Memory

### Without Memory (Not Recommended)
```
User: "Here's my report..."
AI: "Got it"

User: "Convert to IEEE"
AI: "What report? Please provide it again"
❌ Poor experience
```

### With Memory (Implemented)
```
User: "Here's my report..."
AI: "Got it" [stores in memory]

User: "Convert to IEEE"
AI: [retrieves from memory] "Here's the IEEE version"
✅ Smooth experience

User: "Now add a section"
AI: [retrieves IEEE version] "Here's the updated report"
✅ Iterative editing
```

## Architecture Integration

```
┌─────────────────────────────────────────────────────────┐
│                    Mastra Instance                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Master Agent                         │  │
│  │  • Orchestration                                  │  │
│  │  • Context enhancement                            │  │
│  └────┬─────────────┬──────────────┬─────────────┬──┘  │
│       │             │              │             │      │
│  ┌────▼────┐  ┌────▼────┐  ┌──────▼──────┐  ┌──▼───┐  │
│  │Research │  │ Export  │  │   Draft     │  │Future│  │
│  │ Agent   │  │ Agent   │  │   Agent ✨  │  │Agents│  │
│  └─────────┘  └─────────┘  └─────────────┘  └──────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Memory System                        │  │
│  │  • LibSQL Vector Store                            │  │
│  │  • Google Embeddings                              │  │
│  │  • Working Memory                                 │  │
│  │  • Semantic Recall                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Key Benefits Visualization

```
┌─────────────────────────────────────────────────────────┐
│                   Draft Agent Benefits                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🧠 Memory-Enabled                                      │
│     └─ Remembers report across requests                │
│                                                          │
│  🔄 Iterative Editing                                   │
│     └─ Make multiple changes in sequence               │
│                                                          │
│  📝 Format Conversion                                   │
│     └─ IEEE, APA, MLA, Chicago, Custom                 │
│                                                          │
│  ➕ Content Modification                                │
│     └─ Add, remove, restructure sections               │
│                                                          │
│  💬 Natural Interface                                   │
│     └─ Works through existing chat                     │
│                                                          │
│  ⚡ Fast & Efficient                                    │
│     └─ 10-30 seconds per modification                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```
