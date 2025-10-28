# Chat Session Persistence - User Guide

## 🎉 What's New

Your chat sessions are now automatically saved to MongoDB! Every conversation is preserved and accessible from the sidebar.

## ✨ Features

### Automatic Session Management
- ✅ **Auto-save**: Every message is saved automatically
- ✅ **Session creation**: First message creates a new session
- ✅ **Smart titles**: Session titles generated from first message
- ✅ **Full history**: All messages preserved with timestamps
- ✅ **User-scoped**: Each user only sees their own chats

### Sidebar Features
- 📝 **Chat list**: All your conversations in chronological order
- 🔍 **Quick preview**: See last message and message count
- 🗑️ **Delete**: Remove unwanted conversations
- ➕ **New chat**: Start fresh anytime
- 🎯 **Active indicator**: Current chat highlighted

## 🚀 How It Works

### Starting a New Chat

1. Click "New Chat" button in sidebar
2. Type your first message
3. Session automatically created with smart title
4. All subsequent messages saved to this session

### Switching Between Chats

1. Click any chat in the sidebar
2. All messages load instantly
3. Continue conversation from where you left off
4. Previous chat auto-saved

### Deleting a Chat

1. Hover over any chat in sidebar
2. Click the trash icon that appears
3. Confirm deletion
4. Chat permanently removed

## 📊 What's Stored

Each chat session includes:

```typescript
{
  title: "Your research topic...",
  messages: [
    {
      role: "user" | "assistant",
      content: "Message text",
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date,
  lastMessageAt: Date,
  messageCount: number
}
```

## 🎯 User Experience

### Session Titles
- Automatically generated from first message
- Max 50 characters
- Can be updated (future feature)

### Message Display
- User messages on right (blue)
- AI responses on left (gray)
- Timestamps for each message
- Copy button for AI responses

### Sidebar Organization
- Most recent chats at top
- Shows last message preview
- Message count badge
- Relative timestamps ("2 hours ago")

## 🔄 Data Flow

```
User sends message
    ↓
Save to UI (instant)
    ↓
Save to MongoDB (background)
    ↓
AI generates response
    ↓
Save to UI (instant)
    ↓
Save to MongoDB (background)
    ↓
Update sidebar
```

## 💡 Tips

1. **Start Fresh**: Click "New Chat" for unrelated topics
2. **Organize**: Each research topic gets its own session
3. **Review**: Click old chats to review past research
4. **Clean Up**: Delete test or unwanted chats
5. **Export**: Use export button to save important research

## 🛠️ Technical Details

### Components

**ChatInterfaceWithPersistence**
- Main chat interface with MongoDB integration
- Handles message sending and receiving
- Manages current session state

**useChatSessions Hook**
- Manages all chat operations
- Handles API calls to MongoDB
- Provides session CRUD operations

**ChatSidebar**
- Displays all user sessions
- Handles session selection
- Shows delete option on hover

### API Endpoints Used

```
GET    /api/chats              - List all sessions
POST   /api/chats              - Create new session
GET    /api/chats/[id]         - Load specific session
PATCH  /api/chats/[id]         - Update session
DELETE /api/chats/[id]         - Delete session
POST   /api/chats/[id]/messages - Add message
```

## 🔐 Security

- All sessions scoped to authenticated user
- JWT token required for all operations
- No cross-user data access
- Automatic cleanup on logout

## 📱 Mobile Support

- Swipe to open sidebar
- Touch-friendly interface
- Responsive design
- Full feature parity

## 🐛 Troubleshooting

### Messages not saving
- Check MongoDB connection
- Verify authentication token
- Check browser console for errors

### Can't see old chats
- Refresh the page
- Check if logged in as correct user
- Verify MongoDB is running

### Sidebar not updating
- Click "New Chat" to refresh
- Check network tab for API errors
- Ensure token hasn't expired

## 🎓 Best Practices

1. **Topic per Session**: Keep related research in one chat
2. **Regular Cleanup**: Delete test or draft sessions
3. **Export Important**: Save critical research as PDF/HTML
4. **Descriptive First Message**: Helps with auto-titles
5. **Review History**: Learn from past research patterns

## 🚀 Future Enhancements

Coming soon:
- [ ] Edit session titles
- [ ] Search across all chats
- [ ] Tag/categorize sessions
- [ ] Archive instead of delete
- [ ] Export multiple sessions
- [ ] Share sessions (with permission)
- [ ] Session templates
- [ ] Bulk operations

## 📊 Usage Stats

Track your research:
- Total sessions created
- Messages per session
- Most active research topics
- Time spent researching

(Stats dashboard coming soon!)

---

**Enjoy your persistent research workspace!** 🎉

All your conversations are now safely stored and easily accessible.
