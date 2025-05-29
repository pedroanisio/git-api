import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { extractGitIssues } from './llm';
import { issueExists, createIssue } from './github-issues';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const GITHUB_API_BASE = 'https://api.github.com';

async function githubRequest(endpoint: string, token: string | null = null, method: string = 'GET', body: any = null) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-API-Wrapper'
  };
  if (token) headers['Authorization'] = `token ${token}`;
  const options: any = { method, headers };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }
  try {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
    return { success: true, data, status: response.status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get user information
app.get('/api/user/:username', async (req: Request, res: Response) => {
  const { username } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const result = await githubRequest(`/users/${username}`, token);
  res.json(result);
});

// Get user repositories
app.get('/api/user/:username/repos', async (req: Request, res: Response) => {
  const { username } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { page = 1, per_page = 30, sort = 'updated' } = req.query;
  const result = await githubRequest(
    `/users/${username}/repos?page=${page}&per_page=${per_page}&sort=${sort}`,
    token
  );
  res.json(result);
});

// Get repository information
app.get('/api/repos/:owner/:repo', async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const result = await githubRequest(`/repos/${owner}/${repo}`, token);
  res.json(result);
});

// Get repository issues
app.get('/api/repos/:owner/:repo/issues', async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { state = 'open', page = 1, per_page = 30 } = req.query;
  const result = await githubRequest(
    `/repos/${owner}/${repo}/issues?state=${state}&page=${page}&per_page=${per_page}`,
    token
  );
  res.json(result);
});

// Create a new issue
app.post('/api/repos/:owner/:repo/issues', async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  const result = await githubRequest(
    `/repos/${owner}/${repo}/issues`,
    token,
    'POST',
    req.body
  );
  res.json(result);
});

// Get repository commits
app.get('/api/repos/:owner/:repo/commits', async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { page = 1, per_page = 30 } = req.query;
  const result = await githubRequest(
    `/repos/${owner}/${repo}/commits?page=${page}&per_page=${per_page}`,
    token
  );
  res.json(result);
});

// Search repositories
app.get('/api/search/repositories', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { q, sort = 'stars', order = 'desc', page = 1, per_page = 30 } = req.query;
  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
  }
  const result = await githubRequest(
    `/search/repositories?q=${encodeURIComponent(q as string)}&sort=${sort}&order=${order}&page=${page}&per_page=${per_page}`,
    token
  );
  res.json(result);
});

// Get authenticated user (requires token)
app.get('/api/user', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  const result = await githubRequest('/user', token);
  res.json(result);
});

// Serve the web UI
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// LLM-powered issue creation
app.post('/api/repos/:owner/:repo/llm-issues', async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { text } = req.body;
  if (!token) return res.status(401).json({ success: false, error: 'Authentication required' });
  if (!text) return res.status(400).json({ success: false, error: 'Missing text in request body' });
  try {
    const issues = await extractGitIssues(text);
    const results: Array<{ created: boolean; issue: any }> = [];
    for (const issue of issues) {
      const exists = await issueExists(owner, repo, issue.title, token);
      if (!exists) {
        const created = await createIssue(owner, repo, issue, token);
        results.push({ created: true, issue: created });
      } else {
        results.push({ created: false, issue });
      }
    }
    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`GitHub API server running on http://localhost:${PORT}`);
  console.log(`Web UI available at http://localhost:${PORT}`);
});
