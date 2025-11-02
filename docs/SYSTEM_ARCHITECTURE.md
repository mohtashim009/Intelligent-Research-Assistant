# System Architecture - Authentication & Data Flow

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
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
                    ┌─────────▼─────────┐
                    │   localStorage    │
                    │   (JWT Token)     │
                    └─────────┬─────────┘
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
│                    │    Services     │                          │
│                    │  (Business      │                          │
│                    │   Logic)        │                          │
│                    └────────┬────────┘                          │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                       DATABASE (MongoDB)                         │
├─────────────────────────────┼───────────────────────────────────┤
│                             │                                   │
│  ┌──────────────┬───────────┴───────────┬──────────────┐       │
│  │              │                       │              │       │
│  ▼              ▼                       ▼              ▼       │
│ ┌────────┐  ┌────────┐  ┌────────────┐  ┌────────────┐       │
│ │ users  │  │ chat_  │  │  reports   │  │  sessions  │       │
│ │        │  │sessions│  │            │  │  (future)  │       │
│ └────────┘  └────────┘  └────────────┘  └────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Authentication Flow

### Registration Flow
```
User                    Frontend                Backend                 Database
  │                        │                       │                       │
  ├─1. Fill form──────────>│                       │                       │
  │                        ├─2. POST /api/auth/   │                       │
  │                        │    register           │                       │
  │                        │                       ├─3. Hash password      │
  │                        │                       ├─4. Create user────────>│
  │                        │                       │<─5. User created──────┤
  │                        │                       ├─6. Generate JWT       │
  │                        │<─7. Return user+token─┤                       │
  │                        ├─8. Store token       │                       │
  │                        │    (localStorage)     │                       │
  │<─9. Redirect to chat───┤                       │                       │
  │                        │                       │                       │
```

### Login Flow
```
User                    Frontend                Backend                 Database
  │                        │                       │                       │
  ├─1. Enter credentials──>│                       │                       │
  │                        ├─2. POST /api/auth/   │                       │
  │                        │    login              │                       │
  │                        │                       ├─3. Find user──────────>│
  │                        │                       │<─4. User data─────────┤
  │                        │                       ├─5. Verify password    │
  │                        │                       ├─6. Generate JWT       │
  │                        │<─7. Return user+token─┤                       │
  │                        ├─8. Store token       │                       │
  │                        │    (localStorage)     │                       │
  │<─9. Redirect to chat───┤                       │                       │
  │                        │                       │                       │
```

### Authenticated Request Flow
```
User                    Frontend                Backend                 Database
  │                        │                       │                       │
  ├─1. Action (e.g.,──────>│                       │                       │
  │    create chat)        ├─2. GET token from    │                       │
  │                        │    localStorage       │                       │
  │                        ├─3. POST /api/chats   │                       │
  │                        │    Authorization:     │                       │
  │                        │    Bearer <token>     │                       │
  │                        │                       ├─4. Verify JWT         │
  │                        │                       ├─5. Extract userId     │
  │                        │                       ├─6. Create chat────────>│
  │                        │                       │<─7. Chat created──────┤
  │                        │<─8. Return chat data──┤                       │
  │<─9. Update UI──────────┤                       │                       │
  │                        │                       │                       │
```

## 📊 Data Models

### User Model
```typescript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "user@example.com",
  password: "$2a$10$...", // bcrypt hash
  name: "John Doe",
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z"),
  lastLogin: ISODate("2024-01-15T10:30:00Z"),
  preferences: {
    theme: "dark",
    defaultExportFormat: "pdf"
  }
}
```

### Chat Session Model
```typescript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  title: "Quantum Computing Research",
  messages: [
    {
      id: "msg_1234567890",
      role: "user",
      content: "Research quantum computing",
      timestamp: ISODate("2024-01-15T10:30:00Z")
    },
    {
      id: "msg_1234567891",
      role: "assistant",
      content: "# Quantum Computing Research...",
      timestamp: ISODate("2024-01-15T10:30:15Z"),
      metadata: {
        model: "gemini-2.5-flash",
        tokens: 1500
      }
    }
  ],
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:35:00Z"),
  lastMessageAt: ISODate("2024-01-15T10:35:00Z"),
  isArchived: false,
  tags: ["quantum", "computing", "research"],
  metadata: {
    totalMessages: 10,
    totalTokens: 15000,
    researchTopics: ["quantum computing", "algorithms"]
  }
}
```

### Report Model
```typescript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  chatSessionId: ObjectId("507f1f77bcf86cd799439012"),
  title: "Quantum Computing Research Report",
  content: "# Quantum Computing\n\n## Abstract...",
  format: "ieee",
  version: 3,
  createdAt: ISODate("2024-01-15T10:35:00Z"),
  updatedAt: ISODate("2024-01-15T11:00:00Z"),
  tags: ["quantum", "research", "ieee"],
  metadata: {
    wordCount: 2500,
    referenceCount: 15,
    sections: ["Abstract", "Introduction", "Methodology", ...]
  },
  exports: [
    {
      format: "pdf",
      url: "/exports/report_123.pdf",
      generatedAt: ISODate("2024-01-15T11:00:00Z")
    }
  ]
}
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Password Security                             │
│  ├─ bcrypt hashing (10 rounds)                          │
│  ├─ Strength validation                                 │
│  └─ Never stored in plain text                          │
│                                                          │
│  Layer 2: JWT Tokens                                    │
│  ├─ Signed with secret key                              │
│  ├─ 7-day expiration                                    │
│  ├─ Verified on every request                           │
│  └─ Contains user ID + email                            │
│                                                          │
│  Layer 3: Route Protection                              │
│  ├─ Frontend: ProtectedRoute wrapper                    │
│  ├─ Backend: Authentication middleware                  │
│  └─ Automatic redirect to login                         │
│                                                          │
│  Layer 4: Data Isolation                                │
│  ├─ All queries filtered by userId                      │
│  ├─ No cross-user data access                           │
│  └─ MongoDB indexes on userId                           │
│                                                          │
│  Layer 5: API Security                                  │
│  ├─ Input validation                                    │
│  ├─ Error handling                                      │
│  ├─ Rate limiting (future)                              │
│  └─ CORS configuration                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────┐
│                   AuthContext State                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  State:                                                  │
│  ├─ user: User | null                                   │
│  ├─ token: string | null                                │
│  └─ loading: boolean                                    │
│                                                          │
│  Actions:                                               │
│  ├─ login(email, password)                              │
│  ├─ register(email, password, name)                     │
│  ├─ logout()                                            │
│  └─ checkAuth() [on mount]                              │
│                                                          │
│  Computed:                                              │
│  └─ isAuthenticated: boolean                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📡 API Endpoints Map

```
/api/
├── auth/
│   ├── register (POST)    - Create new user
│   ├── login (POST)       - Authenticate user
│   └── me (GET)           - Get current user
│
├── chats/
│   ├── / (GET)            - List all chats
│   ├── / (POST)           - Create new chat
│   ├── [id] (GET)         - Get specific chat
│   ├── [id] (PATCH)       - Update chat
│   ├── [id] (DELETE)      - Delete chat
│   └── [id]/messages/
│       ├── (GET)          - Get messages
│       └── (POST)         - Add message
│
├── reports/
│   ├── / (GET)            - List all reports
│   ├── / (POST)           - Create new report
│   ├── [id] (GET)         - Get specific report
│   ├── [id] (PATCH)       - Update report
│   └── [id] (DELETE)      - Delete report
│
└── research/ (existing)
    └── (POST)             - Conduct research
```

## 🎯 Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Layout
│       ├── /auth (Public)
│       │   ├── LoginForm
│       │   └── RegisterForm
│       │
│       └── / (Protected)
│           └── ProtectedRoute
│               └── ChatInterface
│                   ├── ChatSidebar
│                   ├── MessageBubble
│                   ├── MessageInput
│                   ├── ExportButton
│                   └── UserMenu ← NEW!
```

## 🚀 Request Flow Example

### Creating a Chat Session

```
1. User clicks "New Chat"
   ↓
2. Frontend: useAuth() gets token from context
   ↓
3. Frontend: POST /api/chats
   Headers: { Authorization: "Bearer <token>" }
   Body: { title: "New Research" }
   ↓
4. Backend: authenticateRequest(request)
   - Extract token from header
   - Verify JWT signature
   - Check expiration
   - Extract userId
   ↓
5. Backend: ChatService.createChatSession(userId, title)
   ↓
6. MongoDB: Insert new document
   {
     userId: ObjectId(userId),
     title: "New Research",
     messages: [],
     createdAt: new Date(),
     ...
   }
   ↓
7. Backend: Return chat object
   ↓
8. Frontend: Update UI with new chat
   ↓
9. User sees new chat in sidebar
```

## 💾 Data Persistence Flow

```
User Action → Frontend → API → Service → MongoDB
                ↓                           ↓
            Update UI ← Response ← Query Result
```

## 🔄 Session Management

```
┌─────────────────────────────────────────────────────────┐
│                   Session Lifecycle                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Login/Register                                       │
│     ├─ Generate JWT token                               │
│     ├─ Store in localStorage                            │
│     └─ Set in AuthContext                               │
│                                                          │
│  2. Active Session                                       │
│     ├─ Token included in all requests                   │
│     ├─ Verified on backend                              │
│     └─ User data cached in context                      │
│                                                          │
│  3. Page Refresh                                         │
│     ├─ Check localStorage for token                     │
│     ├─ Verify with /api/auth/me                         │
│     └─ Restore user state                               │
│                                                          │
│  4. Token Expiration (7 days)                           │
│     ├─ Backend returns 401                              │
│     ├─ Frontend clears token                            │
│     └─ Redirect to login                                │
│                                                          │
│  5. Logout                                               │
│     ├─ Clear localStorage                               │
│     ├─ Clear AuthContext                                │
│     └─ Redirect to /auth                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides a secure, scalable foundation for user authentication and data persistence in your AI Research Assistant!
