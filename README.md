# git-api

Simple API server that interacts with the GitHub API along with a web UI to use it. A Node.js/Express backend with a clean HTML frontend. **Now fully migrated to TypeScript.**

## 🚀 **Backend API Server** (Node.js/Express + TypeScript)

**Features:**
- **User endpoints**: Get user info, user repositories
- **Repository endpoints**: Get repo details, commits, issues
- **Search functionality**: Search repositories with filters
- **Issue management**: View and create issues (with authentication)
- **LLM-powered issue creation**: Extract and create issues from user text using OpenAI/Claude (see `/api/repos/:owner/:repo/llm-issues`)
- **Authentication support**: Optional GitHub token for private data and higher rate limits
- **Error handling**: Comprehensive error responses
- **CORS enabled**: Ready for frontend integration

**Key Endpoints:**
- `GET /api/user/:username` - Get user information
- `GET /api/user/:username/repos` - Get user repositories  
- `GET /api/repos/:owner/:repo` - Get repository details
- `GET /api/repos/:owner/:repo/issues` - Get repository issues
- `POST /api/repos/:owner/:repo/issues` - Create new issue (requires auth)
- `POST /api/repos/:owner/:repo/llm-issues` - Extract and create issues from user text (requires auth)
- `GET /api/search/repositories` - Search repositories

## 🎨 **Web UI** (Modern HTML/CSS/JS)

**Features:**
- **Beautiful responsive design** with gradient backgrounds and smooth animations
- **Tabbed interface** for different GitHub operations
- **Authentication support** for GitHub personal access tokens
- **Real-time API testing** with loading states and error handling
- **Formatted results** with syntax highlighting for JSON responses
- **Special UI elements** for repository cards with stats (stars, forks, language)
- **Search functionality** with sorting options

**Tabs Available:**
1. **👤 Users** - Look up user profiles and their repositories
2. **📁 Repositories** - Get detailed repo info and recent commits  
3. **🔍 Search** - Search GitHub repositories with advanced filters
4. **🐛 Issues** - View and create repository issues

## 🛠️ **Setup Instructions**

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
   - For LLM-powered issue extraction, set your OpenAI API key:
   ```bash
   export OPENAI_API_KEY=sk-...
   ```

3. **Run the server (TypeScript):**
```bash
npx ts-node server.ts
```
   Or build and run the compiled JavaScript:
```bash
npx tsc
node dist/server.js
```

4. **Access the web UI** at `http://localhost:3000`

## 🔑 **Authentication (Optional)**
- For public repositories and basic info, no token needed
- For private repos, creating issues, or higher rate limits, get a token from 
[GitHub Settings](https://github.com/settings/tokens)
- Enter your token in the authentication section of the web UI

## 🧹 **Project Notes**
- All code is now in TypeScript (`.ts`). Legacy `.js` files have been removed.
- Main entry point: `server.ts`
- LLM integration: see `llm.ts` and `/api/repos/:owner/:repo/llm-issues` endpoint.
