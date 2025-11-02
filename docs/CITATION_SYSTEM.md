# Academic Citation System Implementation

## Overview
Implemented a professional numbered citation system similar to academic papers and journals.

## Changes Made

### 1. Research Agent Updates
**File:** `lib/mastra/agents/research-agent.ts`

#### Citation Format
- **OLD:** `[Source: Name](URL)` - cluttered with full URLs
- **NEW:** `[1], [2], [3]` - clean numbered citations

#### Instructions Updated
- Explicitly requires numbered citations throughout
- Provides clear examples of citation format
- Shows how to cite multiple sources: `[1, 2, 3]`
- Emphasizes placing citations at end of sentences

#### Example Output Format
```markdown
## Key Findings
- AI is improving gene editing precision [1]
- Multiple studies confirm this approach [2, 3]
- Recent breakthroughs show promise [4]

## Detailed Analysis
Recent research demonstrates that AI algorithms can predict 
editing outcomes with 95% accuracy [1]. This capability is 
crucial for minimizing off-target effects [2, 3].

## Sources
1. Smith, J. (2024). *AI in Gene Editing*. Nature. [https://...]
2. Johnson, M. (2024). *CRISPR Advances*. Science. [https://...]
3. Lee, K. (2024). *Precision Medicine*. Cell. [https://...]
```

### 2. PDF Export Updates
**File:** `lib/export-utils.ts`

#### Citation Preservation
- Numbered citations `[1]`, `[2]`, `[3]` are preserved in PDF
- Special regex to protect citations during text cleaning
- Citations remain visible and clickable in the text

#### Sources Section Formatting
- **Special styling** for "Sources" heading:
  - Larger font (18pt)
  - Bold with underline
  - Extra spacing before section
  
- **Source entries** formatted as:
  - Bold bracketed numbers: `[1]`, `[2]`, `[3]`
  - Left-aligned (not justified) for readability
  - Smaller font (10pt) for compact display
  - Proper spacing between entries

#### Text Cleaning Logic
```typescript
// 1. Protect numbered citations
[1], [2], [3] → __CITATION_0__, __CITATION_1__, __CITATION_2__

// 2. Remove markdown links
[Text](URL) → Text

// 3. Restore citations
__CITATION_0__ → [1]
```

## Benefits

### 1. Professional Appearance
- Matches academic paper standards
- Clean, uncluttered text
- Easy to reference sources

### 2. Better Readability
- No long URLs breaking text flow
- Citations don't interrupt reading
- Clear source attribution

### 3. Space Efficiency
- More content fits on each page
- URLs only appear once (in Sources section)
- Cleaner paragraph formatting

### 4. Academic Standard
- Follows IEEE, APA, and other citation styles
- Familiar format for researchers
- Professional credibility

## Example Comparison

### Before (with full URLs)
```
AI algorithms are improving precision [Source: Genetic Engineering 
and Biotechnology News](https://www.genengnews.com/topics/
artificial-intelligence/ai-enabled-gene-editing-produces-fewer-
off-target-outcomes/) and efficiency [Source: Nature](https://
www.nature.com/articles/s41551-025-01463-z).
```
**Problems:**
- URLs break awkwardly
- Hard to read
- Takes up too much space

### After (numbered citations)
```
AI algorithms are improving precision and efficiency [1, 2].

## Sources
1. Genetic Engineering and Biotechnology News. (2025). 
   *AI-Enabled Gene Editing Produces Fewer Off-Target Outcomes*. 
   [https://www.genengnews.com/...]
2. Nature. (2025). *CRISPR-GPT for agentic automation*. 
   [https://www.nature.com/articles/s41551-025-01463-z]
```
**Benefits:**
- Clean, readable text
- Professional appearance
- Easy to reference
- URLs in one place

## Usage

### For Users
No changes needed - the system works automatically:
1. Ask for research
2. Get report with numbered citations
3. Export to PDF
4. Citations and sources properly formatted

### For Developers
The system handles:
- Citation extraction and protection
- Source section formatting
- PDF layout and styling
- Text cleaning and preservation

## Future Enhancements
- Hyperlink citations to sources section in PDF
- Support for different citation styles (APA, MLA, Chicago)
- Automatic bibliography generation
- Citation management and deduplication
