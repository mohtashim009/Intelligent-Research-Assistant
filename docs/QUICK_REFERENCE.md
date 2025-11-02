# 🚀 Quick Reference Card

## Start the App

```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Start the app
npm run dev

# 3. Visit
http://localhost:3000
```

## First Time Setup

1. Register account at `/auth`
2. Start chatting
3. Sessions auto-save!

## Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | Secure login/register with JWT |
| 💬 **Chat** | Auto-saving conversations |
| 📝 **History** | All chats in sidebar |
| 🗑️ **Delete** | Remove unwanted chats |
| 👤 **Profile** | User menu (top-right) |
| 📤 **Export** | Save as PDF/HTML/Markdown |

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=research-agent
JWT_SECRET=your-secret-key
GOOGLE_GENERATIVE_AI_API_KEY=...
SERPAPI_API_KEY=...
PERPLEXITY_API_KEY=...
```

## Common Tasks

### Create New Chat
1. Click "New Chat" in sidebar
2. Type first message
3. Session auto-created

### Switch Chats
1. Click any chat in sidebar
2. Messages load instantly

### Delete Chat
1. Hover over chat
2. Click trash icon
3. Confirm deletion

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check MongoDB is running |
| Messages not saving | Verify auth token |
| Sidebar empty | Refresh page |
| MongoDB error | `brew services restart mongodb-community` |

## Documentation

- `START_HERE.md` - Quick start
- `IMPLEMENTATION_SUMMARY.md` - Full overview
- `CHAT_PERSISTENCE_GUIDE.md` - Chat features
- `AUTHENTICATION_GUIDE.md` - Auth details

---

**Everything you need at a glance!** 🎯
