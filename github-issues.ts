import fetch from 'node-fetch';
import type { GitIssue } from './gitIssue';

export async function issueExists(owner: string, repo: string, title: string, token: string): Promise<boolean> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-API-Wrapper'
    }
  });
  if (!res.ok) return false;
  const issues = await res.json();
  return issues.some((issue: any) => issue.title.trim().toLowerCase() === title.trim().toLowerCase());
}

export async function createIssue(owner: string, repo: string, issue: GitIssue, token: string): Promise<any> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
  const res = await fetch(url, {
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
