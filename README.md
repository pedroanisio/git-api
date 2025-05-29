# git-api

Simple API server that interacts with the GitHub API along with a web UI to use it. A Node.js/Express backend with a clean HTML frontend.

## 🚀 **Backend API Server** (Node.js/Express)

**Features:**
- **User endpoints**: Get user info, user repositories
- **Repository endpoints**: Get repo details, commits, issues
- **Search functionality**: Search repositories with filters
- **Issue management**: View and create issues (with authentication)
- **Authentication support**: Optional GitHub token for private data and higher rate limits
- **Error handling**: Comprehensive error responses
- **CORS enabled**: Ready for frontend integration

**Key Endpoints:**
- `GET /api/user/:username` - Get user information
- `GET /api/user/:username/repos` - Get user repositories  
- `GET /api/repos/:owner/:repo` - Get repository details
- `GET /api/repos/:owner/:repo/issues` - Get repository issues
- `POST /api/repos/:owner/:repo/issues` - Create new issue (requires auth)
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
npm init -y
npm install express cors
```

2. **Save the server code** as `server.js`

3. **Create a `public` folder** and save the HTML as `public/index.html`

4. **Run the server:**
```bash
node server.js
```

5. **Access the web UI** at `http://localhost:3000`

## 🔑 **Authentication (Optional)**
- For public repositories and basic info, no token needed
- For private repos, creating issues, or higher rate limits, get a token from 
[GitHub Settings](https://github.com/settings/tokens)
- Enter your token in the authentication section of the web UI
