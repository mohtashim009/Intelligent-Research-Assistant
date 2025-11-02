# Vercel Memory Setup Guide

## Problem
LibSQL local database (`file:./mastra-memory.db`) doesn't work on Vercel because:
- Vercel serverless functions have read-only filesystems
- Each request runs in a different container
- Local files can't persist between requests

## Solution
The master agent now automatically adapts based on environment:

### Development (Local)
- Uses local SQLite database: `file:./mastra-memory.db`
- Memory features fully enabled
- Conversation history persists

### Production (Vercel)
- **Option 1**: Disable memory (default)
- **Option 2**: Use Turso (remote LibSQL database)

## Current Configuration

The code now checks the environment in TWO places:

### 1. Master Agent (`lib/mastra/agents/master-agent.ts`)
```typescript
const isVercel = process.env.VERCEL === '1';
const connectionUrl = isVercel 
  ? process.env.TURSO_DATABASE_URL || 'memory-disabled'
  : 'file:./mastra-memory.db';
```

### 2. Main Mastra Instance (`lib/mastra/index.ts`)
```typescript
const isVercel = process.env.VERCEL === '1';
const connectionUrl = isVercel 
  ? process.env.TURSO_DATABASE_URL 
  : 'file:./mastra-memory.db';

// Only add storage and vectors if not on Vercel or if Turso is configured
if (connectionUrl && !isVercel) {
  // Use local database
} else if (connectionUrl && isVercel && process.env.TURSO_AUTH_TOKEN) {
  // Use Turso on Vercel
}
// Otherwise: No storage/vectors (Vercel without Turso)
```

### Without Turso (Current Setup)
- Memory is disabled on Vercel
- Agent works without conversation history
- Each request is independent
- **No additional setup required**

### With Turso (Optional Enhancement)
- Memory works on Vercel
- Conversation history persists
- Requires Turso account and setup

## Option 1: Run Without Memory (Current - No Setup Needed)

✅ **Already configured** - works out of the box on Vercel

**Pros:**
- No additional setup
- No external dependencies
- No costs
- Simpler architecture

**Cons:**
- No conversation history
- No context between requests
- Each query is independent

## Option 2: Enable Memory with Turso (Optional)

If you want conversation memory on Vercel, follow these steps:

### Step 1: Create Turso Account
1. Go to https://turso.tech
2. Sign up for free account
3. Install Turso CLI:
   ```bash
   brew install tursodatabase/tap/turso  # macOS
   # or
   curl -sSfL https://get.tur.so/install.sh | bash  # Linux
   ```

### Step 2: Create Database
```bash
# Login
turso auth login

# Create database
turso db create mastra-memory

# Get connection URL
turso db show mastra-memory --url

# Create auth token
turso db tokens create mastra-memory
```

### Step 3: Add Environment Variables to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### Step 4: Redeploy
Push your code or trigger a redeploy in Vercel.

## How It Works

### Code Logic
```typescript
// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Choose connection URL
const connectionUrl = isVercel 
  ? process.env.TURSO_DATABASE_URL || 'memory-disabled'
  : 'file:./mastra-memory.db';

// Try to create vector store
let vectorStore: LibSQLVector | undefined;
try {
  if (connectionUrl !== 'memory-disabled') {
    vectorStore = new LibSQLVector({
      connectionUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
} catch (error) {
  console.warn('Memory disabled:', error);
  vectorStore = undefined;
}

// Only add memory if vector store exists
export const masterAgent = new Agent({
  // ... other config
  ...(vectorStore && {
    memory: new Memory({
      vector: vectorStore,
      // ... memory config
    }),
  }),
});
```

### Environment Detection
- **Local**: `VERCEL` env var not set → uses local file
- **Vercel**: `VERCEL=1` → checks for Turso URL
- **Fallback**: If no Turso URL → memory disabled

## Testing

### Test Locally
```bash
npm run dev
# Memory should work with local database
```

### Test on Vercel (Without Turso)
```bash
# Deploy to Vercel
vercel deploy

# Test API
curl https://your-app.vercel.app/api/research \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "AI in healthcare"}'

# Should work without errors
# No conversation history between requests
```

### Test on Vercel (With Turso)
```bash
# After setting up Turso and env vars
vercel deploy

# Test API
curl https://your-app.vercel.app/api/research \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "AI in healthcare", "threadId": "test-123", "resourceId": "user-1"}'

# Should work with conversation history
```

## Troubleshooting

### Error: "Unable to open connection to local database"
**Cause**: Trying to use local file on Vercel
**Solution**: Already fixed - code now handles this automatically

### Error: "TURSO_DATABASE_URL not found"
**Cause**: Turso not set up but code expects it
**Solution**: Either:
1. Set up Turso (see Option 2 above)
2. Leave it unset - memory will be disabled (current setup)

### Memory not working on Vercel
**Check**:
1. Are Turso env vars set in Vercel?
2. Is Turso database accessible?
3. Check Vercel logs for errors

## Recommendations

### For MVP/Testing
✅ **Use current setup** (memory disabled on Vercel)
- Simpler
- No external dependencies
- Works immediately

### For Production
Consider enabling Turso if you need:
- Conversation history
- Context-aware responses
- User-specific memory
- Multi-turn conversations

## Cost Considerations

### Without Turso (Current)
- **Cost**: $0
- **Complexity**: Low
- **Maintenance**: None

### With Turso
- **Cost**: Free tier available (500 MB, 1 billion row reads/month)
- **Complexity**: Medium (requires setup)
- **Maintenance**: Low (managed service)

## Summary

✅ **Current Status**: Works on Vercel without memory
✅ **No Action Required**: Code automatically adapts to environment
✅ **Optional Enhancement**: Can enable Turso for conversation memory

The application will work on Vercel immediately without any additional setup!
