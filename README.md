# AI Research Assistant

A sophisticated Next.js application that provides intelligent, multi-source research capabilities powered by AI agents. The system conducts deep research using multiple search engines and academic sources, synthesizes information, and generates comprehensive, well-cited reports.

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Mastra](https://img.shields.io/badge/Mastra-0.23-purple)
![MongoDB](https://img.shields.io/badge/MongoDB-6.20-green?logo=mongodb)

## ✨ Features

### 🔬 Intelligent Research
- **Multi-Source Search**: Integrates Google Search, Google Scholar, Google News, Bing via SerpAPI
- **Academic Focus**: Prioritizes peer-reviewed papers and scholarly articles
- **AI Synthesis**: Uses Perplexity AI for content synthesis when needed
- **Smart Citations**: Automatically generates numbered citations [1], [2], [3]
- **Quality Control**: Enforces 10-15 reference limit for focused research

### 🤖 Multi-Agent Architecture
- **Master Agent**: Orchestrates and routes requests intelligently
- **Research Agent**: Conducts deep research with multiple tools
- **Draft Agent**: Modifies reports (IEEE, APA, MLA format conversion)
- **Context-Aware**: Maintains conversation memory with vector embeddings

### 📝 Report Generation
- **Adaptive Structure**: Sections adapt to research type (technical, experimental, theoretical)
- **Comprehensive**: 1500-2500 word reports with detailed analysis
- **Professional**: Academic-style with abstracts, sections, conclusions
- **Multiple Formats**: Export to PDF, HTML, Markdown

### 🔐 Authentication & Security
- **JWT Authentication**: Secure 7-day token expiration
- **Password Hashing**: bcrypt with 10 rounds
- **Protected Routes**: Frontend and backend route protection
- **User Isolation**: All data scoped to authenticated users

### 💾 Data Persistence
- **MongoDB**: Stores users, chats, messages, reports
- **Session Management**: Browse and resume previous research sessions
- **Auto-Titling**: Generates descriptive titles from first message
- **Vector Memory**: LibSQL/Turso for semantic recall (optional)

## 🏗️ Architecture

```
Frontend (Next.js 15)
    ↓
Authentication Middleware (JWT)
    ↓
API Routes (Next.js)
    ↓
Mastra Agents (Master → Research/Draft)
    ↓
External Services (Gemini, SerpAPI, Perplexity, MongoDB)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- MongoDB instance (local or Atlas)
- API Keys (see Environment Variables)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai-research-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/research-assistant
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/research-assistant

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key

# SerpAPI (for Google Search, Scholar, News)
SERPAPI_API_KEY=your-serpapi-key

# Perplexity AI (optional, for content synthesis)
PERPLEXITY_API_KEY=your-perplexity-api-key

# Vector Memory (optional, for semantic recall)
# Local development uses file:./mastra-memory.db by default
# For production (Vercel), use Turso:
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-token
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting API Keys

### Required APIs

1. **Google AI (Gemini)** - Free tier available
   - Visit: [https://ai.google.dev](https://ai.google.dev)
   - Get API key from Google AI Studio
   - Used for: AI agent responses
   - **Free Tier Limits**: 10 requests/minute, 1500 requests/day
   - **Note**: If you hit quota limits, wait 1 minute or upgrade to paid tier

2. **SerpAPI** - 100 free searches/month
   - Visit: [https://serpapi.com](https://serpapi.com)
   - Sign up and get API key
   - Used for: Google Search, Scholar, News

3. **MongoDB** - Free tier (Atlas) available
   - Visit: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster and get connection string
   - Used for: User data, chats, messages

### Optional APIs

4. **Perplexity AI** - For enhanced content synthesis
   - Visit: [https://www.perplexity.ai](https://www.perplexity.ai)
   - Get API key from account settings
   - Used for: Fallback content synthesis

5. **Turso (LibSQL)** - For vector memory in production
   - Visit: [https://turso.tech](https://turso.tech)
   - Create database and get credentials
   - Used for: Semantic memory (optional)

## 📖 Usage

### Basic Research Flow

1. **Register/Login**: Create an account or sign in
2. **Ask a Question**: Type your research query
3. **AI Research**: System searches multiple sources automatically
4. **Get Report**: Receive comprehensive, cited research report
5. **Modify**: Convert format (IEEE, APA) or add sections
6. **Export**: Download as PDF, HTML, or Markdown

### Example Queries

```
"Research quantum computing applications in cryptography"
"Tell me about recent developments in AI safety"
"What are the latest trends in renewable energy?"
```

### Modifying Reports

```
"Convert this report to IEEE format"
"Add a section about implementation challenges"
"Change to APA citation style"
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Component library (shadcn/ui)

### Backend
- **Next.js API Routes** - Serverless functions
- **Mastra** - Multi-agent orchestration
- **MongoDB** - Database
- **JWT** - Authentication

### AI & Search
- **Google Gemini 2.5 Flash** - AI model
- **SerpAPI** - Search APIs (Google, Scholar, News)
- **Perplexity AI** - Content synthesis
- **Google Embeddings** - Vector embeddings

### Export
- **jsPDF** - PDF generation
- **remark/rehype** - Markdown processing

## 📁 Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── chats/           # Chat session endpoints
│   │   ├── research/        # Research endpoint
│   │   └── reports/         # Report endpoints
│   ├── auth/                # Auth pages
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── chat/               # Chat interface
│   └── ui/                 # UI components
├── lib/                    # Utilities and services
│   ├── mastra/            # Mastra agents
│   │   ├── agents/        # AI agents
│   │   │   ├── master-agent.ts
│   │   │   ├── research-agent.ts
│   │   │   └── draft-agent.ts
│   │   ├── index.ts       # Mastra configuration
│   │   └── serpapi-tool.ts
│   ├── services/          # Business logic
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── export-utils.ts    # Export utilities
├── types/                 # TypeScript types
└── docs/                  # Documentation
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `SERPAPI_API_KEY`
- `PERPLEXITY_API_KEY` (optional)
- `TURSO_DATABASE_URL` (optional)
- `TURSO_AUTH_TOKEN` (optional)

## 📚 Documentation

For detailed documentation, see:
- [Project Documentation](docs/PROJECT_DOCUMENTATION.md) - Complete system overview
- [Authentication Guide](docs/AUTHENTICATION_GUIDE.md) - Auth implementation
- [Chat Persistence Guide](docs/CHAT_PERSISTENCE_GUIDE.md) - Session management
- [Multi-Agent Architecture](docs/MULTI_AGENT_ARCHITECTURE.md) - Agent system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Mastra](https://mastra.ai) - Multi-agent framework
- [Next.js](https://nextjs.org) - React framework
- [Google AI](https://ai.google.dev) - Gemini models
- [SerpAPI](https://serpapi.com) - Search APIs
- [Perplexity AI](https://www.perplexity.ai) - AI synthesis

## 📧 Support

For issues and questions, please open an issue on GitHub.
