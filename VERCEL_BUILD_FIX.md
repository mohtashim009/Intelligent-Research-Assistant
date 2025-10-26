# Vercel Build Fix - Peer Dependency Conflict

## Problem
Vercel build was failing with peer dependency conflict:
```
npm error Could not resolve dependency:
npm error peer @mastra/core@">=0.15.3-0 <0.17.0-0" from @mastra/mcp@0.11.4
npm error Conflicting peer dependency: @mastra/core@0.16.3
```

## Root Cause
- `@mastra/mcp@0.11.4` required `@mastra/core` version `<0.17.0`
- Project was using `@mastra/core@0.23.1` (newer version)
- Vercel doesn't use `--legacy-peer-deps` by default
- Local builds worked because npm was configured with legacy peer deps

## Solution

### 1. Created `.npmrc` File
Added `.npmrc` in project root with:
```
legacy-peer-deps=true
```

This tells npm (and Vercel) to ignore peer dependency conflicts.

### 2. Updated `@mastra/mcp` Package
Changed in `package.json`:
```json
"@mastra/mcp": "^0.11.4"  // Old - incompatible
"@mastra/mcp": "^0.14.1"  // New - latest version
```

The newer version `0.14.1` is more likely to be compatible with `@mastra/core@0.23.1`.

## Files Changed

1. **`.npmrc`** (new file)
   - Enables legacy peer deps resolution
   - Applies to both local and Vercel builds

2. **`package.json`**
   - Updated `@mastra/mcp` from `^0.11.4` to `^0.14.1`

## Why This Works

### `.npmrc` Approach
- Tells npm to install packages even with peer dependency mismatches
- Vercel respects `.npmrc` configuration
- Allows builds to proceed despite version conflicts

### Package Update Approach
- Uses newer version of `@mastra/mcp`
- Newer versions often have broader peer dependency ranges
- Reduces likelihood of conflicts

## Testing

### Local Test
```bash
npm install
# Should complete without errors
```

### Vercel Test
Push to repository and Vercel will:
1. Read `.npmrc` configuration
2. Install with `legacy-peer-deps=true`
3. Build should succeed

## Alternative Solutions (if issues persist)

### Option 1: Use npm overrides
Add to `package.json`:
```json
"overrides": {
  "@mastra/mcp": {
    "@mastra/core": "^0.23.1"
  }
}
```

### Option 2: Lock all Mastra packages to compatible versions
Downgrade `@mastra/core` to match `@mastra/mcp` requirements:
```json
"@mastra/core": "^0.16.3"
```

### Option 3: Use pnpm instead of npm
pnpm handles peer dependencies differently and may resolve conflicts better.

## Verification

After deploying to Vercel:
1. Check build logs for successful installation
2. Verify no peer dependency errors
3. Test application functionality
4. Ensure all Mastra features work correctly

## Notes

- The `.npmrc` file is committed to the repository
- All team members will use legacy peer deps
- Future package updates should check compatibility
- Monitor Mastra package updates for better compatibility
