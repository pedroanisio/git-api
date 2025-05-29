"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const llm_1 = require("./llm");
const github_issues_1 = require("./github-issues");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', true);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
const GITHUB_API_BASE = 'https://api.github.com';
async function githubRequest(endpoint, token = null, method = 'GET', body = null) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-API-Wrapper'
    };
    if (token)
        headers['Authorization'] = `token ${token}`;
    const options = { method, headers };
    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
    }
    try {
        const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, options);
        const data = await response.json();
        if (!response.ok)
            throw new Error(data.message || `HTTP ${response.status}`);
        return { success: true, data, status: response.status };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
// ...existing endpoints...
app.post('/api/repos/:owner/:repo/llm-issues', async (req, res) => {
    const { owner, repo } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { text } = req.body;
    if (!token)
        return res.status(401).json({ success: false, error: 'Authentication required' });
    if (!text)
        return res.status(400).json({ success: false, error: 'Missing text in request body' });
    try {
        const issues = await (0, llm_1.extractGitIssues)(text);
        const results = [];
        for (const issue of issues) {
            const exists = await (0, github_issues_1.issueExists)(owner, repo, issue.title, token);
            if (!exists) {
                const created = await (0, github_issues_1.createIssue)(owner, repo, issue, token);
                results.push({ created: true, issue: created });
            }
            else {
                results.push({ created: false, issue });
            }
        }
        res.json({ success: true, results });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// ...existing endpoints...
app.listen(PORT, () => {
    console.log(`GitHub API server running on http://localhost:${PORT}`);
    console.log(`Web UI available at http://localhost:${PORT}`);
});
