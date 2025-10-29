# Mobile Avatar Optimization

## Change
Hide all avatars (both user and AI) on mobile devices to maximize screen space and improve readability.

## Implementation

### Avatar Visibility
- **Mobile (< 640px)**: No avatars shown for either user or AI messages
- **Desktop (≥ 640px)**: Both user and AI avatars visible

### Code Changes
```tsx
<Avatar className={`w-8 h-8 flex-shrink-0 hidden sm:flex ${
  isUser 
    ? 'bg-primary text-primary-foreground' 
    : 'bg-muted'
}`}>
```

### Width Adjustments
Since both message types no longer have avatars on mobile, they can use more width:

- **User messages**: `max-w-[95%]` on mobile, `max-w-[80%]` on desktop
- **AI messages**: `max-w-[95%]` on mobile, `max-w-[80%]` on desktop

## Benefits
1. **Maximum screen space** for all messages on mobile
2. **Better readability** with wider message bubbles (95% width)
3. **Cleaner, more modern UI** on small screens
4. **Consistent spacing** - both message types use same width on mobile
5. **Message distinction** - still clear from background colors (blue for user, gray for AI)

## Visual Result
- **Mobile**: No avatars, both message types at 95% width, distinguished by color
- **Desktop**: Both avatars visible, messages at 80% width

## File Modified
- `components/chat/message-bubble.tsx`
