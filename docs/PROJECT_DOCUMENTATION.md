# AI Research Assistant - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Core Features](#core-features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Multi-Agent System](#multi-agent-system)
6. [Authentication & Security](#authentication--security)
7. [Data Persistence](#data-persistence)
8. [Research Capabilities](#research-capabilities)
9. [User Interface](#user-interface)
10. [API Endpoints](#api-endpoints)
11. [Setup & Configuration](#setup--configuration)
12. [Deployment](#deployment)

---

## 🎯 Project Overview

**AI Research Assistant** is a sophisticated Next.js application that provides intelligent, multi-source research capabilities powered by AI agents. The system conducts deep research using multiple search engines and academic sources, synthesizes information, and generates comprehensive, well-cited reports.

### What It Does

The application serves as an intelligent research companion that:
- **Conducts Deep Research**: Searches across Google, Google Scholar, Google News, Bing, and more
- **Synthesizes Information**: Uses AI to analyze and combine information from multiple sources
- **Generates Reports**: Creates comprehensive, academic-style research reports with proper citations
- **Manages Conversations**: Maintains context across multiple research sessions
- **Exports Documents**: Converts reports to various formats (PDF, Markdown, HTML)
- **Modifies Reports**: Allows format conversion (IEEE, APA, MLA) and content additions
- **Persists Data**: Saves all chats, messages, and reports to MongoDB with user authentication

### Key Differentiators

1. **Multi-Agent Architecture**: Specialized AI agents for different tasks (research, drafting, export)
2. **Intelligent Routing**: Master agent analyzes intent and delegates to appropriate sub-agents
3. **Context-Aware**: Maintains conversation history and memory for coherent multi-turn interactions
4. **Academic Quality**: Generates properly structured reports with abstracts, citations, and references
5. **User Authentication**: Secure JWT-based authentication with MongoDB persistence
6. **Real-Time Research**: Uses live data from multiple search APIs, not pre-trained knowledge

---

## 🚀 Core Features

### 1. Intelligent Research
- **Multi-Source Search**: Integrates Google Search, Google Scholar, Google News, Bing, and more via SerpAPI
- **Academic Focus**: Prioritizes peer-reviewed papers and scholarly articles
- **Current Events**: Includes recent news and developments
- **Fallback Synthesis**: Uses Perplexity AI when primary sources lack content
- **Citation Management**: Automatically generates numbered citations [1], [2], [3]
- **Reference Limits**: Enforces quality over quantity (10-15 references maximum)

### 2. Dynamic Report Generation
- **Adaptive Structure**: Report sections adapt to research type (technical, experimental, theoretical, etc.)
- **Comprehensive Content**: 1500-2500 word reports with detailed analysis
- **Multiple Perspectives**: Includes diverse viewpoints and sources
- **Professional Formatting**: Academic-style structure with abstracts, sections, and conclusions

### 3. Report Modification (Draft Agent)
- **Format Conversion**: Convert reports to IEEE, APA, MLA, Chicago formats
- **Content Addition**: Add new sections with user-provided content
- **Restructuring**: Modify existing sections and organization
- **Style Adjustment**: Change tone, detail level, and formatting

### 4. User Authentication & Authorization
- **Secure Registration**: Email/password with bcrypt hashing
- **JWT Tokens**: 7-day expiration with automatic refresh
- **Protected Routes**: Frontend and backend route protection
- **User Isolation**: All data scoped to authenticated users

### 5. Chat Session Management
- **Persistent Conversations**: All chats saved to MongoDB
- **Session History**: Browse and resume previous research sessions
- **Auto-Titling**: Generates descriptive titles from first message
- **Search**: Find chats by title, content, or tags
- **Archive/Delete**: Manage chat history

### 6. Export Capabilities
- **Multiple Formats**: PDF, Markdown, HTML
- **Formatted Output**: Preserves structure and citations
- **Download**: Direct file downloads

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 15)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  Auth Pages  │    │  Chat UI     │    │  User Menu   │     │
│  │  /auth       │    │  /           │    │  (Dropdown)  │     │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│         │                   │                    │              │
│         └───────────────────┴────────────────────┘              │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │  AuthContext    │                          │
│                    │  (React State)  │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    BACKEND (API Routes)                          │
├─────────────────────────────┼───────────────────────────────────┤
│                             │                                   │
│  ┌──────────────────────────▼──────────────────────────┐       │
│  │           Authentication Middleware                  │       │
│  │         (Verify JWT, Extract User ID)               │       │
│  └──────────────────────────┬──────────────────────────┘       │
│                             │                                   │
│  ┌──────────────┬───────────┴───────────┬──────────────┐       │
│  │              │                       │              │       │
│  ▼              ▼                       ▼              ▼       │
│ ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│ │ Auth   │  │ Users  │  │ Chats  │  │Reports │  │Research│   │
│ │ Routes │  │ Routes │  │ Routes │  │ Routes │  │ Routes │   │
│ └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘   │
│     │           │            │           │           │         │
│     └───────────┴────────────┴───────────┴───────────┘         │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │  Mastra Agents  │                          │
│                    │  (AI Logic)     │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────┼───────────────────────────────────┤
│                             │                                   │
│  ┌──────────┬───────────────┴───────────┬──────────┐           │
│  │          │                           │          │           │
│  ▼          ▼                           ▼          ▼           │
│ ┌────┐  ┌────────┐  ┌──────────┐  ┌─────────┐  ┌──────┐      │
│ │Gemini│ │SerpAPI │  │Perplexity│  │ MongoDB │  │Turso │      │
│ │(AI)  │ │(Search)│  │  (AI)    │  │  (DB)   │  │(Vec) │      │
│ └──────┘ └────────┘  └──────────┘  └─────────┘  └──────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User Authentication**: User logs in → JWT token stored → Token sent with all requests
2. **Research Request**: User asks question → Master Agent analyzes intent → Routes to Research Agent
3. **Data Collection**: Research Agent calls SerpAPI tools → Collects results from multiple sources
4. **Synthesis**: AI analyzes and synthesizes information → Generates comprehensive report
5. **Persistence**: Report saved to MongoDB → Associated with user and chat session
6. **Display**: Formatted report rendered in UI with markdown support

---

## 💻 Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Component Library**: Radix UI (shadcn/ui)
- **State Management**: React Context API
- **Markdown Rendering**: remark, rehype
- **Icons**: Heroicons, Lucide React

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **AI Framework**: Mastra (multi-agent orchestration)
- **AI Models**: Google Gemini 2.5 Flash
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

### Database & Storage
- **Primary Database**: MongoDB (user data, chats, reports)
- **Vector Store**: LibSQL/Turso (semantic memory, optional)
- **Session Storage**: localStorage (JWT tokens)

### External APIs
- **Search**: SerpAPI (Google, Scholar, News, Bing, etc.)
- **AI Synthesis**: Perplexity AI (fallback for content extraction)
- **Embeddings**: Google text-embedding-004 (for semantic recall)

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm
- **Build Tool**: Next.js built-in (Turbopack)
- **Linting**: ESLint

---

## 🤖 Multi-Agent System

The application uses **Mastra** to orchestrate multiple specialized AI agents:

### 1. Master Agent (`master-agent`)
**Role**: Orchestrator and prompt enhancer

**Responsibilities**:
- Analyzes user intent (research, modification, or export)
- Enhances prompts with conversation context
- Routes requests to appropriate sub-agents
- Maintains conversation memory
- Manages working memory for context

**Model**: Google Gemini 2.5 Flash

**Key Features**:
- Semantic recall (retrieves relevant past conversations)
- Working memory template (tracks user preferences, topics)
- Context-aware prompt enhancement
- Intelligent delegation

**Decision Logic**:
```
User Query → Intent Detection
  ├─ Research keywords → Call research-agent
  ├─ Modification keywords → Call draft-agent
  └─ Export keywords → Call export-agent
```

### 2. Research Agent (`research-agent`)
**Role**: Deep research specialist

**Responsibilities**:
- Conducts multi-source research
- Calls SerpAPI tools (Google, Scholar, News)
- Uses Perplexity as fallback for content synthesis
- Generates comprehensive reports with citations
- Adapts report structure to research type

**Model**: Google Gemini 2.5 Flash

**Tools Available**:
- `googleSearch`: General web search
- `googleScholar`: Academic papers
- `googleNews`: Recent news articles
- `bingSearch`: Cross-verification
- `perplexity_search`: Content synthesis (fallback only)

**Research Workflow**:
```
1. googleSearch(query) → Get general results
2. googleScholar(query) → Get academic papers
3. googleNews(query) → Get recent articles
4. IF Scholar lacks abstracts → perplexity_search(query)
5. Synthesize all results → Generate report
6. Apply citation limits (10-15 max)
```

**Output Format**:
- Abstract (150-250 words)
- Introduction
- Dynamic sections (adapt to topic)
- Conclusion
- References (numbered citations)

### 3. Draft Agent (`draft-agent`)
**Role**: Report modification specialist

**Responsibilities**:
- Converts reports to different formats (IEEE, APA, MLA, Chicago)
- Adds new sections with user-provided content
- Restructures existing content
- Maintains citation integrity
- Preserves research quality

**Model**: Google Gemini 2.5 Flash Lite

**Capabilities**:
- Format conversion (academic styles)
- Section addition/modification
- Style adjustment
- Content restructuring

**Workflow**:
```
1. Receive report content from master-agent
2. Analyze current structure
3. Apply requested modifications
4. Return modified report (no commentary)
```

### 4. Export Agent (`export-agent`)
**Role**: Document formatting and export

**Responsibilities**:
- Formats reports for export
- Generates PDF, Markdown, HTML
- Preserves structure and citations
- Prepares downloadable files

**Model**: Google Gemini 2.5 Flash Lite

### Agent Communication Flow

```
User: "Research quantum computing"
  ↓
Master Agent: Detects research intent
  ↓
Master Agent → Research Agent: Enhanced prompt with context
  ↓
Research Agent: Calls tools (Google, Scholar, News)
  ↓
Research Agent: Synthesizes results → Generates report
  ↓
Master Agent: Returns report to user
  ↓
User: "Convert to IEEE format"
  ↓
Master Agent: Detects modification intent
  ↓
Master Agent → Draft Agent: Report + modification request
  ↓
Draft Agent: Converts to IEEE format
  ↓
Master Agent: Returns modified report
```

---

## 🔐 Authentication & Security

### Authentication Flow

#### Registration
```
1. User submits email, password, name
2. Backend validates input
3. Password hashed with bcrypt (10 rounds)
4. User document created in MongoDB
5. JWT token generated (7-day expiration)
6. Token returned to client
7. Token stored in localStorage
8. User redirected to chat interface
```

#### Login
```
1. User submits email, password
2. Backend finds user by email
3. Password verified with bcrypt
4. JWT token generated
5. Token returned and stored
6. User redirected to chat
```

#### Protected Requests
```
1. Client includes token in Authorization header
2. Middleware extracts and verifies JWT
3. User ID extracted from token payload
4. Request proceeds with authenticated user context
5. All database queries filtered by userId
```

### Security Layers

1. **Password Security**
   - bcrypt hashing (10 rounds)
   - Minimum 8 characters
   - Requires uppercase, lowercase, and number
   - Never stored in plain text

2. **Token Security**
   - JWT signed with secret key
   - 7-day expiration
   - Verified on every request
   - Contains user ID + email

3. **Route Protection**
   - Frontend: `ProtectedRoute` wrapper component
   - Backend: `authenticateRequest` middleware
   - Automatic redirect to login if unauthenticated

4. **Data Isolation**
   - All queries filtered by `userId`
   - No cross-user data access
   - MongoDB indexes on `userId` for performance

5. **API Security**
   - Input validation with Zod schemas
   - Error handling (no sensitive data leaks)
   - CORS configuration
   - Rate limiting (future enhancement)

### JWT Token Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "iat": 1704067200,
  "exp": 1704672000
}
```

---

## 💾 Data Persistence

### Database Schema

#### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,              // Unique, lowercase
  password: string,           // bcrypt hash
  name: string,
  createdAt: Date,
  updatedAt: Date,
  lastLogin?: Date,
  preferences: {
    theme: 'light' | 'dark' | 'system',
    defaultExportFormat: 'pdf' | 'html' | 'markdown'
  }
}
```

#### Chat Sessions Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to users
  title: string,              // Auto-generated or user-set
  messages: [
    {
      id: string,             // Unique message ID
      role: 'user' | 'assistant',
      content: string,        // Message text
      timestamp: Date,
      metadata?: {
        model: string,
        tokens: number
      }
    }
  ],
  createdAt: Date,
  updatedAt: Date,
  lastMessageAt: Date,
  isArchived: boolean,
  tags: string[],
  metadata: {
    totalMessages: number,
    totalTokens: number,
    researchTopics: string[]
  }
}
```

#### Reports Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to users
  chatSessionId: ObjectId,    // Reference to chat_sessions
  title: string,
  content: string,            // Markdown content
  format: string,             // 'ieee', 'apa', 'markdown', etc.
  version: number,            // Version tracking
  createdAt: Date,
  updatedAt: Date,
  tags: string[],
  metadata: {
    wordCount: number,
    referenceCount: number,
    sections: string[]
  },
  exports: [
    {
      format: string,
      url: string,
      generatedAt: Date
    }
  ]
}
```

### Data Services

#### UserService
- `createUser(email, password, name)`: Register new user
- `authenticateUser(email, password)`: Login
- `getUserById(userId)`: Fetch user data
- `updateUser(userId, updates)`: Update profile
- `deleteUser(userId)`: Delete account

#### ChatService
- `createChatSession(userId, title)`: Create new chat
- `getChatSession(chatId, userId)`: Fetch specific chat
- `getUserChatSessions(userId)`: List all user chats
- `addMessage(chatId, userId, message)`: Add message to chat
- `updateChatTitle(chatId, userId, title)`: Update chat title
- `deleteChatSession(chatId, userId)`: Delete chat
- `searchChatSessions(userId, query)`: Search chats

#### ReportService
- `createReport(userId, chatId, title, content, format)`: Save report
- `getReport(reportId, userId)`: Fetch report
- `getUserReports(userId)`: List all user reports
- `updateReport(reportId, userId, updates)`: Update report
- `deleteReport(reportId, userId)`: Delete report
- `searchReports(userId, query)`: Search reports

### MongoDB Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Chat Sessions
db.chat_sessions.createIndex({ userId: 1, lastMessageAt: -1 })
db.chat_sessions.createIndex({ userId: 1, isArchived: 1 })

// Reports
db.reports.createIndex({ userId: 1, createdAt: -1 })
db.reports.createIndex({ chatSessionId: 1 })
```

---

## 🔍 Research Capabilities

### Search Tools (via SerpAPI)

#### 1. Google Search (`googleSearch`)
- **Purpose**: General web search
- **Use Case**: Broad information gathering, overviews
- **Returns**: Titles, links, snippets, dates
- **Limit**: 10 results per query

#### 2. Google Scholar (`googleScholar`)
- **Purpose**: Academic papers and scholarly articles
- **Use Case**: Research requiring academic credibility
- **Returns**: Papers with abstracts, citations, publication info
- **Limit**: 10 results per query

#### 3. Google News (`googleNews`)
- **Purpose**: Recent news articles
- **Use Case**: Current events, recent developments
- **Returns**: News articles with sources, dates, summaries
- **Limit**: 10 results per query

#### 4. Bing Search (`bingSearch`)
- **Purpose**: Alternative search engine
- **Use Case**: Cross-verification of Google results
- **Returns**: Web results similar to Google

#### 5. Other Tools (Available but less used)
- Google Shopping, YouTube, Maps, Jobs, Images
- DuckDuckGo, Baidu, Yandex

### AI Synthesis (Perplexity)

#### When Used
- **Fallback Only**: When Google Scholar returns papers without abstracts
- **Content Extraction**: To understand academic paper content
- **Never First**: Always try SerpAPI tools first

#### Tools
1. `perplexity_search`: Quick synthesis with citations
2. `perplexity_research`: Deep research (extreme cases only)
3. `perplexity_reason`: Complex reasoning tasks

### Research Workflow

```
Step 1: Query Analysis
  - Understand research topic
  - Identify key terms
  - Determine scope

Step 2: Multi-Source Search
  - googleSearch(topic) → 10 general results
  - googleScholar(topic) → 10 academic papers
  - googleNews(topic) → 10 recent articles

Step 3: Content Evaluation
  - Check if Scholar has abstracts
  - IF NO abstracts → perplexity_search(topic)
  - Select top 10-15 most relevant sources

Step 4: Synthesis
  - Analyze all sources
  - Identify key themes
  - Extract important data
  - Note different perspectives

Step 5: Report Generation
  - Structure: Abstract → Intro → Body → Conclusion → References
  - Citations: Numbered [1], [2], [3]
  - Length: 1500-2500 words
  - References: 10-15 maximum

Step 6: Quality Check
  - Verify all citations
  - Check reference count
  - Ensure coherent structure
  - Validate academic tone
```

### Citation System

**Format**: Numbered citations `[1]`, `[2]`, `[3]`

**Rules**:
- Every claim must be cited
- Maximum 15 references
- Only cite sources actually used in text
- No redundant sources
- Prioritize: Academic > Official > News > General web

**Example**:
```markdown
Quantum computing represents a paradigm shift in computational power [1]. 
Recent breakthroughs have demonstrated quantum supremacy [2, 3].

## References

1. Smith, J. (2024). *Quantum Computing Fundamentals*. Nature, 15(3), 234-245.
2. Google AI. (2023). *Quantum Supremacy Achieved*. Science, 366(6468), 505-509.
3. IBM Research. (2024). *Quantum Error Correction*. Physical Review Letters, 132(1).
```

### Report Structure Adaptation

The system adapts report structure based on research type:

**Technical/System Research**:
- Abstract → Introduction → Related Work → System Architecture → Implementation → Evaluation → Conclusion

**Experimental Research**:
- Abstract → Introduction → Background → Methodology → Results → Discussion → Conclusion

**Review/Survey Research**:
- Abstract → Introduction → Background → Current State → Trends → Challenges → Future Directions → Conclusion

**Theoretical Research**:
- Abstract → Introduction → Theoretical Framework → Analysis → Implications → Conclusion

---

## 🎨 User Interface

### Pages

#### 1. Authentication Page (`/auth`)
**Purpose**: User login and registration

**Features**:
- Toggle between login and registration forms
- Email/password validation
- Password strength requirements
- Error handling and feedback
- Responsive design

**Components**:
- `LoginForm`: Email/password login
- `RegisterForm`: New user registration with name, email, password

#### 2. Chat Interface (`/`)
**Purpose**: Main research and conversation interface

**Features**:
- Protected route (requires authentication)
- Chat sidebar with session history
- Message display with markdown rendering
- Message input with send button
- Export functionality
- User menu (profile, logout)
- Responsive layout (mobile + desktop)

**Components**:
- `ChatInterfaceWithPersistence`: Main container
- `ChatSidebar`: Session list and management
- `MessageBubble`: Individual message display
- `MessageInput`: Text input with send
- `ExportButton`: Export to PDF/Markdown/HTML
- `UserMenu`: User profile dropdown
- `TypingIndicator`: Loading state

### Component Hierarchy

```
App
└── AuthProvider (Context)
    └── Layout
        ├── /auth (Public)
        │   ├── LoginForm
        │   └── RegisterForm
        │
        └── / (Protected)
            └── ProtectedRoute
                └── ChatInterfaceWithPersistence
                    ├── ChatSidebar
                    │   ├── Session List
                    │   ├── New Chat Button
                    │   └── Delete Session
                    ├── Header
                    │   ├── Title
                    │   ├── ExportButton
                    │   └── UserMenu
                    ├── MessageArea
                    │   ├── MessageBubble (User)
                    │   ├── MessageBubble (AI)
                    │   └── TypingIndicator
                    └── MessageInput
```

### UI Features

#### Markdown Rendering
- **Library**: remark + rehype
- **Features**: 
  - Headers, lists, code blocks
  - Tables, blockquotes
  - Links (sanitized)
  - Syntax highlighting (code)

#### Responsive Design
- **Mobile**: Collapsible sidebar (sheet)
- **Desktop**: Fixed sidebar (280px)
- **Breakpoint**: 1024px (lg)

#### Dark Mode Support
- **System**: Follows OS preference
- **Manual**: User can override
- **Persistence**: Saved in user preferences

#### Accessibility
- **Keyboard Navigation**: Full support
- **Screen Readers**: ARIA labels
- **Focus Management**: Proper focus states
- **Color Contrast**: WCAG AA compliant

#### Loading States
- **Typing Indicator**: Shows AI is thinking
- **Progress Messages**: 
  - "Conducting deep research..."
  - "Drafting in progress..."
  - "Preparing export..."
- **Skeleton Loaders**: For session list

#### Error Handling
- **Network Errors**: Retry suggestions
- **API Errors**: User-friendly messages
- **Validation Errors**: Inline feedback
- **Fallback UI**: Graceful degradation

### User Experience Flow

```
1. User visits site
   ↓
2. Not authenticated → Redirect to /auth
   ↓
3. User registers/logs in
   ↓
4. Redirect to / (chat interface)
   ↓
5. User sees empty state or previous chats
   ↓
6. User types research question
   ↓
7. Message sent → Loading indicator
   ↓
8. AI response streams in
   ↓
9. Response rendered with markdown
   ↓
10. User can:
    - Continue conversation
    - Export report
    - Start new chat
    - Switch to previous chat
    - Logout
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
**Purpose**: Create new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response** (201):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Invalid input (email format, password strength)
- 409: User already exists

#### POST `/api/auth/login`
**Purpose**: Authenticate existing user

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Invalid input
- 401: Invalid credentials

#### GET `/api/auth/me`
**Purpose**: Get current user info

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {
      "theme": "dark",
      "defaultExportFormat": "pdf"
    }
  }
}
```

**Errors**:
- 401: Invalid or expired token

### Chat Endpoints

#### GET `/api/chats`
**Purpose**: List all user's chat sessions

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `includeArchived`: boolean (default: false)
- `search`: string (optional)

**Response** (200):
```json
{
  "success": true,
  "chats": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Quantum Computing Research",
      "lastMessageAt": "2024-01-15T10:35:00Z",
      "messageCount": 10,
      "isArchived": false
    }
  ]
}
```

#### POST `/api/chats`
**Purpose**: Create new chat session

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "title": "New Research Topic"
}
```

**Response** (201):
```json
{
  "success": true,
  "chat": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "New Research Topic",
    "messages": [],
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET `/api/chats/[chatId]`
**Purpose**: Get specific chat session

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "chat": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Quantum Computing Research",
    "messages": [
      {
        "id": "msg_1",
        "role": "user",
        "content": "Research quantum computing",
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "id": "msg_2",
        "role": "assistant",
        "content": "# Quantum Computing Research\n\n...",
        "timestamp": "2024-01-15T10:30:15Z"
      }
    ]
  }
}
```

#### PATCH `/api/chats/[chatId]`
**Purpose**: Update chat (title, archive status)

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "title": "Updated Title",
  "isArchived": true
}
```

**Response** (200):
```json
{
  "success": true,
  "chat": { /* updated chat */ }
}
```

#### DELETE `/api/chats/[chatId]`
**Purpose**: Delete chat session

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

### Research Endpoint

#### POST `/api/research`
**Purpose**: Conduct AI research and generate response

**Headers**:
```
Authorization: Bearer <token> (optional, but recommended)
```

**Request**:
```json
{
  "query": "Research quantum computing",
  "threadId": "thread_123",
  "resourceId": "resource_456",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous question"
    },
    {
      "role": "assistant",
      "content": "Previous answer"
    }
  ]
}
```

**Response** (200):
```json
{
  "result": "# Quantum Computing Research\n\n## Abstract\n...",
  "threadId": "thread_123",
  "resourceId": "resource_456",
  "progressLogs": [
    "🔧 Using googleSearch...",
    "✅ googleSearch completed",
    "🔧 Using googleScholar...",
    "✅ googleScholar completed"
  ],
  "toolsUsed": 3
}
```

**Errors**:
- 400: Query is required
- 500: Research generation failed

### Report Endpoints

#### GET `/api/reports`
**Purpose**: List all user's reports

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `search`: string (optional)
- `chatId`: string (optional, filter by chat)

**Response** (200):
```json
{
  "success": true,
  "reports": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Quantum Computing Research Report",
      "format": "ieee",
      "createdAt": "2024-01-15T10:35:00Z",
      "wordCount": 2500
    }
  ]
}
```

#### POST `/api/reports`
**Purpose**: Create new report

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "chatSessionId": "507f1f77bcf86cd799439012",
  "title": "Quantum Computing Research Report",
  "content": "# Quantum Computing\n\n...",
  "format": "ieee"
}
```

**Response** (201):
```json
{
  "success": true,
  "report": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "chatSessionId": "507f1f77bcf86cd799439012",
    "title": "Quantum Computing Research Report",
    "content": "...",
    "format": "ieee",
    "version": 1,
    "createdAt": "2024-01-15T10:35:00Z"
  }
}
```

#### GET `/api/reports/[reportId]`
**Purpose**: Get specific report

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "report": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Quantum Computing Research Report",
    "content": "# Quantum Computing\n\n...",
    "format": "ieee",
    "metadata": {
      "wordCount": 2500,
      "referenceCount": 15,
      "sections": ["Abstract", "Introduction", ...]
    }
  }
}
```

#### PATCH `/api/reports/[reportId]`
**Purpose**: Update report

**Headers**:
```
Authorization: Bearer <token>
```

**Request**:
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "format": "apa"
}
```

**Response** (200):
```json
{
  "success": true,
  "report": { /* updated report */ }
}
```

#### DELETE `/api/reports/[reportId]`
**Purpose**: Delete report

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

## ⚙️ Setup & Configuration

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MongoDB**: v6 or higher (local or Atlas)
- **API Keys**:
  - Google AI (Gemini)
  - SerpAPI
  - Perplexity AI (optional)
  - Turso (optional, for vector memory)

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd ai-research-assistant
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables

Create `.env.local` file:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=research-agent

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google AI (for agents)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key

# SerpAPI (for research)
SERPAPI_KEY=your-serpapi-key

# Perplexity (for research fallback)
PERPLEXITY_API_KEY=your-perplexity-key

# Turso (for vector memory - optional)
TURSO_DATABASE_URL=your-turso-url
TURSO_AUTH_TOKEN=your-turso-token

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 4. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Linux
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

#### 5. Get API Keys

**Google AI (Gemini)**:
1. Visit [ai.google.dev](https://ai.google.dev)
2. Create API key
3. Add to `GOOGLE_GENERATIVE_AI_API_KEY`

**SerpAPI**:
1. Visit [serpapi.com](https://serpapi.com)
2. Sign up for free tier (100 searches/month)
3. Get API key
4. Add to `SERPAPI_KEY`

**Perplexity AI** (Optional):
1. Visit [perplexity.ai](https://www.perplexity.ai)
2. Get API key from account settings
3. Add to `PERPLEXITY_API_KEY`

#### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

#### 7. Create Account
1. Click "Create one" on login page
2. Fill in name, email, password
3. Click "Create account"
4. Start researching!

### Configuration Options

#### JWT Configuration
```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d  # Token expiration time
```

#### MongoDB Configuration
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=research-agent
```

#### AI Model Configuration
Models are configured in agent files:
- Master Agent: `gemini-2.5-flash`
- Research Agent: `gemini-2.5-flash`
- Draft Agent: `gemini-2.5-flash-lite`
- Export Agent: `gemini-2.5-flash-lite`

#### Memory Configuration (Optional)
```env
# For semantic recall and vector memory
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
- Vercel account
- MongoDB Atlas (cloud database)
- All API keys ready

#### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
- Visit [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure project

3. **Set Environment Variables**

In Vercel dashboard, add all environment variables:
```
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=research-agent
JWT_SECRET=your-production-secret
GOOGLE_GENERATIVE_AI_API_KEY=...
SERPAPI_KEY=...
PERPLEXITY_API_KEY=...
TURSO_DATABASE_URL=... (optional)
TURSO_AUTH_TOKEN=... (optional)
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Visit your production URL

#### Post-Deployment

1. **Test Authentication**
   - Create test account
   - Verify login works
   - Check JWT token generation

2. **Test Research**
   - Ask research question
   - Verify API calls work
   - Check report generation

3. **Monitor Logs**
   - Check Vercel logs for errors
   - Monitor API usage
   - Track performance

### Environment-Specific Configuration

#### Development
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

### Database Migration

If migrating from local to cloud:

1. **Export Local Data**
```bash
mongodump --db research-agent --out ./backup
```

2. **Import to Atlas**
```bash
mongorestore --uri "mongodb+srv://..." --db research-agent ./backup/research-agent
```

### Performance Optimization

#### 1. Database Indexes
```javascript
// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.chat_sessions.createIndex({ userId: 1, lastMessageAt: -1 })
db.reports.createIndex({ userId: 1, createdAt: -1 })
```

#### 2. Caching
- Use Vercel Edge Caching for static assets
- Implement Redis for session caching (future)
- Cache AI responses for common queries (future)

#### 3. API Rate Limiting
```typescript
// Future enhancement
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}
```

### Monitoring & Logging

#### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor page views, performance
- Track user engagement

#### Error Tracking
- Implement Sentry (future)
- Log errors to external service
- Set up alerts for critical errors

#### API Usage Tracking
- Monitor SerpAPI usage (100 free searches/month)
- Track Perplexity API calls
- Monitor Google AI token usage

---

## 📚 Additional Documentation

### Related Files
- `START_HERE.md`: Quick start guide
- `AUTHENTICATION_COMPLETE.md`: Authentication features
- `AUTHENTICATION_GUIDE.md`: Developer guide for auth
- `SYSTEM_ARCHITECTURE.md`: Detailed architecture
- `CHAT_PERSISTENCE_GUIDE.md`: Chat persistence implementation
- `MULTI_AGENT_ARCHITECTURE.md`: Agent system details

### Key Directories
```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   └── page.tsx           # Main chat page
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── chat/             # Chat components
│   └── ui/               # UI components
├── lib/                   # Core logic
│   ├── mastra/           # AI agents
│   ├── services/         # Database services
│   ├── contexts/         # React contexts
│   └── hooks/            # Custom hooks
└── types/                 # TypeScript types
```

### Development Workflow

1. **Feature Development**
   - Create feature branch
   - Implement changes
   - Test locally
   - Create pull request

2. **Testing**
   - Manual testing in development
   - Test authentication flow
   - Test research functionality
   - Test export features

3. **Deployment**
   - Merge to main branch
   - Automatic Vercel deployment
   - Verify production build
   - Monitor for errors

### Troubleshooting

#### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb  # Linux
```

#### "Invalid token" errors
- Clear browser localStorage
- Login again
- Check JWT_SECRET is set correctly

#### "SerpAPI error"
- Verify SERPAPI_KEY is correct
- Check API quota (100 free searches/month)
- Try alternative search tools

#### "AI generation failed"
- Check GOOGLE_GENERATIVE_AI_API_KEY
- Verify API quota
- Check network connectivity

---

## 🎯 Future Enhancements

### Planned Features
1. **Advanced Search Filters**: Date ranges, source types, language
2. **Collaborative Research**: Share chats with team members
3. **Report Templates**: Pre-defined templates for different research types
4. **Citation Management**: Export to BibTeX, EndNote
5. **Voice Input**: Speech-to-text for queries
6. **Mobile App**: Native iOS/Android apps
7. **API Access**: Public API for third-party integrations
8. **Analytics Dashboard**: Research insights and statistics

### Technical Improvements
1. **Rate Limiting**: Prevent API abuse
2. **Caching**: Redis for session and response caching
3. **WebSockets**: Real-time streaming responses
4. **Background Jobs**: Queue system for long-running research
5. **Testing**: Unit tests, integration tests, E2E tests
6. **CI/CD**: Automated testing and deployment
7. **Monitoring**: Comprehensive error tracking and analytics
8. **Performance**: Optimize database queries, reduce bundle size

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🤝 Support

For questions, issues, or feature requests:
- Check existing documentation files
- Review code comments
- Test API endpoints with curl
- Check MongoDB connection
- Verify environment variables

---

**Built with ❤️ using Next.js, Mastra, and AI**
