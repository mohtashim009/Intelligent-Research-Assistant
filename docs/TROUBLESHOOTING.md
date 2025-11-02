# Troubleshooting Guide

## Common Issues and Solutions

### 1. API Quota Exceeded Error

**Error Message**:
```
Error [AI_APICallError]: You exceeded your current quota, please check your plan and billing details.
Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 10
Please retry in 38s.
```

**Cause**: Google Gemini free tier has rate limits:
- **10 requests per minute**
- **1500 requests per day**

**Solutions**:

#### Option 1: Wait (Immediate)
```bash
# Wait 1 minute for the quota to reset
# The error message tells you exactly how long to wait
```

#### Option 2: Upgrade to Paid Tier (Recommended for Production)
1. Visit [Google AI Studio](https://ai.google.dev)
2. Enable billing on your Google Cloud project
3. Upgrade to paid tier for higher limits:
   - **360 requests per minute**
   - **10,000 requests per day**

#### Option 3: Use Different Model (Temporary)
```typescript
// In lib/mastra/agents/master-agent.ts
// Change from:
model: google('gemini-2.5-flash')

// To:
model: google('gemini-1.5-flash') // Might have different limits
```

#### Option 4: Reduce maxSteps (Prevents Loops)
```typescript
// In app/api/research/route.ts
maxSteps: 10, // Reduced from 20 to prevent quota exhaustion
```

### 2. Master Agent Loop (Repeated Research Calls)

**Symptoms**:
- Research agent called multiple times
- Same research repeated
- No output returned
- Memory leak warnings
- API quota exhausted quickly

**Cause**: Master agent stuck in loop calling research-agent repeatedly

**Solution**: Already fixed in latest version

**Verification**:
```typescript
// Check app/api/research/route.ts
maxSteps: 10, // Should be 10, not 20

// Check lib/mastra/agents/master-agent.ts
// Should say "Call research-agent ONCE"
```

**If still happening**:
1. Restart the dev server: `npm run dev`
2. Clear browser cache
3. Check console logs for repeated tool calls
4. Reduce maxSteps further if needed (try 5)

### 3. Memory Leak Warnings

**Warning Message**:
```
(node:12345) MaxListenersExceededWarning: Possible EventEmitter memory leak detected
```

**Cause**: Too many concurrent API calls or infinite loops

**Solutions**:

#### Immediate Fix:
```bash
# Restart the dev server
Ctrl+C
npm run dev
```

#### Permanent Fix:
1. Ensure maxSteps is set to 10 or less
2. Check for infinite loops in agent instructions
3. Monitor API calls in console

### 4. No Research Output

**Symptoms**:
- Research agent called
- Tools executed
- But no text returned to user

**Causes & Solutions**:

#### Cause 1: Master Agent Not Returning Results
```typescript
// Master agent should return research-agent results directly
// Check instructions say: "RETURN THE COMPLETE TEXT"
```

#### Cause 2: API Quota Exceeded
```bash
# Check console for quota errors
# Wait 1 minute and try again
```

#### Cause 3: Empty Response from Research Agent
```typescript
// Check research-agent instructions
// Ensure it's generating comprehensive reports
```

### 5. Build Errors

**Error**: `Module not found: Can't resolve 'fs'`

**Cause**: Trying to import server-side code in client components

**Solution**: Use dynamic imports or move to server-side
```typescript
// ❌ Wrong (in client component)
import { mastra } from '@/lib/mastra';

// ✅ Correct (in API route or server component)
import { mastra } from '@/lib/mastra';
```

### 6. Export Agent Not Working

**Symptoms**:
- Enhanced export button doesn't work
- No AI enhancement happening
- Regular export works fine

**Solutions**:

#### Check API Endpoint:
```bash
# Verify endpoint exists
curl http://localhost:3000/api/export/enhance
```

#### Check Console Logs:
```javascript
// Should see:
🤖 Using export agent to enhance content for PDF...
✅ Export agent enhancement complete
```

#### Check API Key:
```bash
# Verify GOOGLE_GENERATIVE_AI_API_KEY is set
echo $GOOGLE_GENERATIVE_AI_API_KEY
```

### 7. MongoDB Connection Issues

**Error**: `MongoServerError: Authentication failed`

**Solutions**:

#### Check Connection String:
```bash
# In .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Common issues:
# - Wrong password (URL encode special characters)
# - Wrong database name
# - IP not whitelisted (add 0.0.0.0/0 in MongoDB Atlas)
```

#### Test Connection:
```bash
# Use MongoDB Compass or mongosh to test
mongosh "mongodb+srv://..."
```

### 8. Authentication Issues

**Error**: `Unauthorized` or `Invalid token`

**Solutions**:

#### Clear Local Storage:
```javascript
// In browser console
localStorage.clear();
// Then login again
```

#### Check JWT Secret:
```bash
# In .env.local
JWT_SECRET=your-secret-key-here
# Must be the same across restarts
```

#### Check Token Expiration:
```javascript
// Tokens expire after 7 days
// Login again if expired
```

## Performance Optimization

### Reduce API Calls

1. **Lower maxSteps**:
   ```typescript
   maxSteps: 5, // Instead of 10 or 20
   ```

2. **Cache Results**:
   ```typescript
   // Store research results in database
   // Reuse for similar queries
   ```

3. **Use Lighter Models**:
   ```typescript
   model: google('gemini-1.5-flash') // Faster, cheaper
   ```

### Improve Response Time

1. **Reduce Tool Count**:
   ```typescript
   // Use fewer search tools per query
   // Focus on most relevant sources
   ```

2. **Parallel Processing**:
   ```typescript
   // Call multiple tools in parallel
   // Instead of sequentially
   ```

## Monitoring

### Check API Usage

1. **Google AI Studio**:
   - Visit: https://ai.dev/usage
   - Monitor quota usage
   - Set up alerts

2. **Console Logs**:
   ```bash
   # Watch for patterns
   grep "Using" logs.txt | wc -l  # Count tool calls
   ```

3. **Performance Metrics**:
   ```typescript
   // Add timing logs
   console.time('research');
   await research();
   console.timeEnd('research');
   ```

## Getting Help

### Check Logs

```bash
# Development
npm run dev
# Watch console output

# Production (Vercel)
vercel logs
```

### Debug Mode

```typescript
// Add to .env.local
DEBUG=true
NODE_ENV=development
```

### Report Issues

Include:
1. Error message (full stack trace)
2. Steps to reproduce
3. Environment (dev/production)
4. API quota status
5. Console logs

## Quick Fixes Checklist

- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Check API quota (wait 1 minute)
- [ ] Verify environment variables
- [ ] Check MongoDB connection
- [ ] Review console logs
- [ ] Test with simple query
- [ ] Reduce maxSteps if looping
- [ ] Check network connectivity
- [ ] Verify API keys are valid

## Prevention

### Best Practices

1. **Set Reasonable Limits**:
   - maxSteps: 5-10 (not 20+)
   - Timeout: 30-60 seconds
   - Max tokens: 2000-4000

2. **Monitor Usage**:
   - Track API calls
   - Set up alerts
   - Review logs regularly

3. **Handle Errors Gracefully**:
   - Catch quota errors
   - Show user-friendly messages
   - Implement retry logic

4. **Test Thoroughly**:
   - Test with various queries
   - Check edge cases
   - Monitor for loops

## Status Indicators

### Healthy System:
- ✅ API calls complete in 2-10 seconds
- ✅ No repeated tool calls
- ✅ Clear output returned
- ✅ No memory warnings
- ✅ Quota usage under limits

### Unhealthy System:
- ❌ API calls timeout
- ❌ Repeated tool calls (loop)
- ❌ No output or empty responses
- ❌ Memory leak warnings
- ❌ Quota exceeded errors

---

**Last Updated**: 2024
**Status**: Active Troubleshooting Guide
