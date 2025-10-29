# Text Overflow Fix

## Issue
Text in AI-generated reports was being cut off on the right side of the screen, especially on mobile devices.

## Changes Made

### 1. Message Bubble Component (`components/chat/message-bubble.tsx`)
- Changed max-width from `max-w-[80%]` to responsive `max-w-[calc(100%-3rem)] sm:max-w-[80%]`
- Added `min-w-0` to allow flex items to shrink below their minimum content size
- Added `w-full` and `overflow-hidden` to the Card component
- Changed gap from `gap-3` to `gap-2 sm:gap-3` for better mobile spacing
- Added `overflow-wrap-anywhere` class to user messages

### 2. Markdown Renderer (`components/ui/markdown-renderer.tsx`)
- Added `break-words` and `overflow-wrap-anywhere` classes to the root div
- Added `overflow-hidden` class support via className prop

### 3. Global CSS (`app/globals.css`)
- Added word-wrapping properties to `.markdown-content`:
  - `word-wrap: break-word`
  - `overflow-wrap: break-word`
  - `word-break: break-word`
  - `max-width: 100%`
- Applied word-wrapping to all markdown elements (h1-h4, p, li)
- Added `hyphens: auto` to paragraphs for better text flow
- Added utility classes:
  - `.overflow-wrap-anywhere`
  - `.break-word`
- Ensured code blocks maintain proper overflow with `overflow-x: auto`

### 4. Chat Interface Containers
- Added `overflow-hidden` to messages area container
- Changed padding from `px-2 sm:px-0` to `px-2 sm:px-4` for better mobile spacing
- Added `w-full` to ensure proper width constraints

## Result
- Text now properly wraps within the message bubbles
- No horizontal overflow on any screen size
- Long words break appropriately without cutting off
- Code blocks scroll horizontally when needed
- Maintains all original fonts and styling
- Works on both mobile and desktop viewports
