# Authentication & Data Persistence Setup

This document explains the complete authentication and data management system implemented with MongoDB.

## Features

✅ **User Authentication**
- JWT-based authentication
- Secure password hashing with bcrypt
- Password strength validation
- Session management

✅ **Chat Sessions**
- Create and manage multiple chat sessions
- Store complete message history
- Search across conversations
- Archive/delete sessions

✅ **Reports Management**
- Save research reports
- Version control for reports
- Link reports to chat sessions
- Track exports (PDF, HTML, Markdown)

✅ **Memory & Context**
- Persistent chat history
- User preferences
- Conversation context across sessions

## Setup Instructions

### 1. Install MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

MONGODB_DB_NAME=research-agent
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Database Collections

The system automatically creates these collections:
- `users` - User accounts
- `chat_sessions` - Chat conversations
- `reports` - Research reports

### 4. Start the Application

```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Chat Sessions

#### Create Chat Session
```http
POST /api/chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Quantum Computing Research"
}
```

#### Get All Chats
```http
GET /api/chats
Authorization: Bearer <token>
```

#### Get Specific Chat
```http
GET /api/chats/{chatId}
Authorization: Bearer <token>
```

#### Add Message to Chat
```http
POST /api/chats/{chatId}/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "user",
  "content": "Research quantum computing"
}
```

#### Update Chat Title
```http
PATCH /api/chats/{chatId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Delete Chat
```http
DELETE /api/chats/{chatId}
Authorization: Bearer <token>
```

### Reports

#### Create Report
```http
POST /api/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatSessionId": "...",
  "title": "Quantum Computing Research Report",
  "content": "# Report Content...",
  "format": "markdown"
}
```

#### Get All Reports
```http
GET /api/reports
Authorization: Bearer <token>
```

#### Get Reports for a Chat
```http
GET /api/reports?chatId={chatId}
Authorization: Bearer <token>
```

#### Update Report
```http
PATCH /api/reports/{reportId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "# Updated Content...",
  "incrementVersion": true
}
```

#### Delete Report
```http
DELETE /api/reports/{reportId}
Authorization: Bearer <token>
```

## Frontend Integration

### 1. Store Token

After login/register, store the JWT token:
```typescript
// Store in localStorage
localStorage.setItem('authToken', response.token);

// Or use a state management library (Redux, Zustand, etc.)
```

### 2. Add Token to Requests

```typescript
const token = localStorage.getItem('authToken');

const response = await fetch('/api/chats', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### 3. Handle Authentication State

```typescript
// Check if user is authenticated
const checkAuth = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  const response = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    localStorage.removeItem('authToken');
    return false;
  }

  return true;
};
```

## Security Best Practices

1. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

2. **JWT Token**
   - Expires in 7 days
   - Change `JWT_SECRET` in production
   - Use HTTPS in production

3. **MongoDB**
   - Use strong passwords
   - Enable authentication
   - Use connection string with credentials
   - Restrict network access

## Data Models

### User
```typescript
{
  _id: ObjectId,
  email: string,
  password: string, // hashed
  name: string,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  preferences: {
    theme: 'light' | 'dark' | 'system',
    defaultExportFormat: 'pdf' | 'html' | 'markdown'
  }
}
```

### Chat Session
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  messages: Message[],
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

### Report
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  chatSessionId: ObjectId,
  title: string,
  content: string,
  format: 'markdown' | 'ieee' | 'apa' | 'custom',
  createdAt: Date,
  updatedAt: Date,
  version: number,
  tags: string[],
  metadata: {
    wordCount: number,
    referenceCount: number,
    sections: string[]
  },
  exports: [{
    format: 'pdf' | 'html' | 'markdown',
    url: string,
    generatedAt: Date
  }]
}
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Test connection
mongosh mongodb://localhost:27017
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env.local`
- Check token expiration (7 days default)
- Verify Authorization header format: `Bearer <token>`

### CORS Issues
- Ensure `NEXT_PUBLIC_API_URL` is set correctly
- Check that requests include proper headers

## Next Steps

1. **Implement Frontend Components**
   - Login/Register forms
   - Chat interface with session management
   - Report viewer/editor

2. **Add Features**
   - Password reset
   - Email verification
   - OAuth providers (Google, GitHub)
   - Real-time chat updates (WebSockets)

3. **Production Deployment**
   - Use MongoDB Atlas
   - Set strong JWT_SECRET
   - Enable HTTPS
   - Add rate limiting
   - Implement logging and monitoring
