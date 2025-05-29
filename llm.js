// llm.js
// Handles LLM integration for extracting GitIssue objects from user text

const { Configuration, OpenAIApi } = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Calls the LLM to extract issues from user text and return them as GitIssue objects.
 * @param {string} userText
 * @returns {Promise<GitIssue[]>}
 */
async function extractGitIssues(userText) {
  const prompt = `Extract a list of GitHub issues from the following text. For each issue, return a JSON object with the following fields: title, body. Use the most concise and descriptive title possible.\n\nText:\n${userText}\n\nOutput (as JSON array):`;
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that extracts GitHub issues from text.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 800,
  });
  const text = response.data.choices[0].message.content;
  try {
    const issues = JSON.parse(text);
    return Array.isArray(issues) ? issues : [];
  } catch (e) {
    return [];
  }
}

module.exports = { extractGitIssues };
