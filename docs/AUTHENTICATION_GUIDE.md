# Authentication System - Quick Start Guide

## 🎉 What's New

Your AI Research Assistant now has a complete authentication system with:

✅ User registration and login
✅ JWT-based authentication
✅ Protected routes
✅ User profile menu
✅ Persistent sessions
✅ MongoDB integration for data storage

## 🚀 Getting Started

### 1. Set Up MongoDB

**Option A: Local MongoDB (Recommended for Development)**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify it's running
mongosh
```

**Option B: MongoDB Atlas (Cloud - Free Tier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string

### 2. Configure Environment Variables

Your `.env.local` should have:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=research-agent

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Your existing API keys
GOOGLE_GENERATIVE_AI_API_KEY=your-key
SERPAPI_API_KEY=your-key
PERPLEXITY_API_KEY=your-key
```

### 3. Start the Application

```bash
npm run dev
```

### 4. Access the App

1. Open http://localhost:3000
2. You'll be redirected to `/auth` (login page)
3. Click "Create one" to register a new account
4. Fill in your details:
   - Full Name
   - Email
   - Password (min 8 chars, uppercase, lowercase, number)
5. You'll be automatically logged in and redirected to the chat

## 📱 User Interface

### Login Page (`/auth`)
- Email and password fields
- Switch to registration
- Automatic redirect if already logged in

### Registration Page (`/auth`)
- Full name, email, password fields
- Password strength validation
- Automatic login after registration

### Main Chat Interface (`/`)
- **Protected**: Requires authentication
- **User Menu**: Top right corner (your initials)
  - View profile
  - Settings
  - Logout

## 🔐 How Authentication Works

### Flow
1. **Register/Login** → Receive JWT token
2. **Token stored** in localStorage
3. **All API requests** include token in Authorization header
4. **Protected routes** check authentication before rendering
5. **Logout** clears token and redirects to login

### Token Details
- **Type**: JWT (JSON Web Token)
- **Expiration**: 7 days
- **Storage**: localStorage (browser)
- **Format**: `Bearer <token>`

## 🛠️ For Developers

### Adding Authentication to API Routes

```typescript
import { authenticateRequest, createAuthErrorResponse } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  // Authenticate the request
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  // Use auth.userId to access user-specific data
  const userId = auth.userId;
  
  // Your logic here...
}
```

### Using Auth in Components

```typescript
'use client';

import { useAuth } from '@/lib/contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
const token = localStorage.getItem('authToken');

const response = await fetch('/api/chats', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ title: 'New Chat' }),
});
```

## 📊 Database Collections

The system creates these MongoDB collections automatically:

### `users`
- User accounts
- Hashed passwords
- Preferences
- Login tracking

### `chat_sessions`
- Conversation history
- Messages
- Metadata
- User-scoped

### `reports`
- Research reports
- Versions
- Linked to chats
- Export history

## 🔒 Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **Password Validation**: 
   - Min 8 characters
   - Uppercase + lowercase
   - At least one number
3. **JWT Tokens**: Signed and verified
4. **Protected Routes**: Automatic redirect to login
5. **User Isolation**: All data scoped to user ID

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongodb  # Linux
```

### "Invalid token" errors
- Token might be expired (7 days)
- Clear localStorage and login again
- Check JWT_SECRET is set in .env.local

### "User not found" after login
- Database might be empty
- Register a new account
- Check MongoDB connection

### Can't access protected routes
- Clear browser cache
- Check localStorage for 'authToken'
- Try logging in again

## 🎯 Next Steps

### Immediate
1. ✅ Register your first account
2. ✅ Test the chat interface
3. ✅ Try logging out and back in

### Future Enhancements
- [ ] Password reset functionality
- [ ] Email verification
- [ ] OAuth providers (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Session management (view all devices)
- [ ] Profile editing
- [ ] Avatar uploads

## 📚 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Chats
- `GET /api/chats` - List all chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/[id]` - Get specific chat
- `PATCH /api/chats/[id]` - Update chat
- `DELETE /api/chats/[id]` - Delete chat
- `POST /api/chats/[id]/messages` - Add message

### Reports
- `GET /api/reports` - List all reports
- `POST /api/reports` - Create report
- `GET /api/reports/[id]` - Get specific report
- `PATCH /api/reports/[id]` - Update report
- `DELETE /api/reports/[id]` - Delete report

## 💡 Tips

1. **Development**: Use local MongoDB for faster iteration
2. **Production**: Use MongoDB Atlas for reliability
3. **Security**: Change JWT_SECRET before deploying
4. **Backup**: Regularly backup your MongoDB data
5. **Testing**: Create a test account for development

## 🆘 Need Help?

Check these files for implementation details:
- `lib/contexts/AuthContext.tsx` - Auth state management
- `lib/middleware/auth.ts` - Request authentication
- `lib/services/user.service.ts` - User operations
- `components/auth/` - UI components
- `app/api/auth/` - Auth endpoints

---

**Ready to start?** Just run `npm run dev` and visit http://localhost:3000! 🚀
