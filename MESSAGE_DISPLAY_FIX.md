# Message Display Fix - Messages Not Showing During Research

## Problem

When sending a message to start research:
1. User message would disappear immediately
2. "Conducting deep research..." indicator would show but no messages visible
3. After research completed, AI response wouldn't appear
4. Only after refreshing and reopening from chat history would messages appear
5. Header showed "0 messages" even though messages were being saved

## Root Cause

The issue was in the `useEffect` that syncs messages from `currentSession`:

```typescript
// PROBLEMATIC CODE
useEffect(() => {
  if (currentSession) {
    const formattedMessages = currentSession.messages.map(...);
    setMessages(formattedMessages);
  }
}, [currentSession]); // Triggers whenever currentSession changes
```

### The Problem Flow:

```
1. User sends message
   ↓
2. setMessages([...prev, userMessage]) ✅ Message added to UI
   ↓
3. addMessage(sessionId, message) → Updates MongoDB
   ↓
4. addMessage updates currentSession state in useChatSessions hook
   ↓
5. currentSession change triggers useEffect
   ↓
6. useEffect loads messages from currentSession.messages
   ↓
7. But currentSession.messages is stale (hasn't been refreshed from DB)
   ↓
8. setMessages(formattedMessages) ❌ Overwrites UI with old data
   ↓
9. User message disappears from UI!
```

The `addMessage` function updates the local `currentSession` state optimistically, but the useEffect was reloading messages from that state, which could be out of sync with the UI.

## Solution

Track which session is currently loaded and only reload messages when switching to a **different** session:

```typescript
const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);

useEffect(() => {
  // Only reload if switching to a different session
  if (currentSession && currentSession._id !== loadedSessionId) {
    const formattedMessages = currentSession.messages.map(...);
    setMessages(formattedMessages);
    setLoadedSessionId(currentSession._id);
  } else if (!currentSession && loadedSessionId) {
    setMessages([]);
    setLoadedSessionId(null);
  }
}, [currentSession, loadedSessionId]);
```

### The Fixed Flow:

```
1. User sends message
   ↓
2. setMessages([...prev, userMessage]) ✅ Message added to UI
   ↓
3. addMessage(sessionId, message) → Updates MongoDB
   ↓
4. addMessage updates currentSession state
   ↓
5. currentSession changes BUT loadedSessionId === currentSession._id
   ↓
6. useEffect sees same session, SKIPS reload ✅
   ↓
7. User message stays visible! ✅
   ↓
8. AI response arrives
   ↓
9. setMessages([...prev, aiMessage]) ✅ AI message added to UI
   ↓
10. Both messages visible! ✅
```

## Changes Made

### 1. Added Session Tracking State

```typescript
const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
```

### 2. Updated useEffect Logic

```typescript
// Only reload when switching to a DIFFERENT session
if (currentSession && currentSession._id !== loadedSessionId) {
  // Load messages and update loadedSessionId
}
```

### 3. Reset on New Chat

```typescript
const handleNewChat = async () => {
  setMessages([]);
  setLoadedSessionId(null); // Reset tracking
  // ...
};
```

### 4. Reset on Session Select

```typescript
const handleSessionSelect = async (sessionId: string) => {
  setLoadedSessionId(null); // Force reload
  await loadSession(sessionId);
  // ...
};
```

## Benefits

1. **Messages Stay Visible**: User and AI messages remain in UI during conversation
2. **Loading Indicator Works**: "Conducting deep research..." shows with user message visible
3. **Real-time Updates**: Messages appear immediately without refresh
4. **Proper Message Count**: Header shows correct count
5. **Session Switching Works**: Loading different session still reloads messages correctly

## Testing Scenarios

### ✅ Scenario 1: New Research
1. Click "New Chat"
2. Type: "Research quantum computing"
3. Press Enter
4. **Expected**: 
   - User message appears immediately
   - "Conducting deep research..." shows below
   - AI response appears when ready
   - Both messages stay visible

### ✅ Scenario 2: Continue Conversation
1. In existing chat with messages
2. Type: "Tell me more"
3. Press Enter
4. **Expected**:
   - All previous messages stay visible
   - New user message appears
   - AI response appears
   - Message count increases

### ✅ Scenario 3: Switch Sessions
1. Open chat from sidebar
2. **Expected**:
   - All messages from that chat load
   - Message count correct

### ✅ Scenario 4: New Chat After Conversation
1. In chat with messages
2. Click "New Chat"
3. Type new message
4. **Expected**:
   - Previous messages cleared
   - New message appears
   - Fresh conversation starts

## Files Modified

- `components/chat/ChatInterfaceWithPersistence.tsx`
  - Added `loadedSessionId` state
  - Updated `useEffect` to check session ID
  - Updated `handleNewChat` to reset tracking
  - Updated `handleSessionSelect` to force reload

---

**Status**: ✅ Fixed - Messages now display correctly during research
