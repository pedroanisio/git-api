"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueExists = issueExists;
exports.createIssue = createIssue;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function issueExists(owner, repo, title, token) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`;
    const res = await (0, node_fetch_1.default)(url, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-API-Wrapper'
        }
    });
    if (!res.ok)
        return false;
    const issues = await res.json();
    return issues.some((issue) => issue.title.trim().toLowerCase() === title.trim().toLowerCase());
}
async function createIssue(owner, repo, issue, token) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    const res = await (0, node_fetch_1.default)(url, {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-API-Wrapper',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(issue)
    });
    return res.json();
}
