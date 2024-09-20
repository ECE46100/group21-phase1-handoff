import { Octokit } from "octokit";
import * as dotenv from 'dotenv';

dotenv.config();

export async function getCorrectness(url: string) {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    // Extract repository name and its owner from the URL
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    if (!match) {
        throw new Error("Invalid URL");
    }
    const owner = match[1];
    const repo = match[2];

    // Fetch issues for the repository
    const openIssuesResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: owner,
        repo: repo,
        state: 'open',
        since: '2015-01-01T00:00:00Z'
    });

    const closedIssuesResponse = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: owner,
        repo: repo,
        state: 'closed',
        since: '2015-01-01T00:00:00Z'
    });

    const openIssues = openIssuesResponse.data.length;
    const closedIssues = closedIssuesResponse.data.length;

    if (closedIssues + openIssues === 0) {
        return "No issues found";
    }

    const correctnessScore = (closedIssues / (closedIssues + openIssues)) * 100;

    return correctnessScore.toFixed(2) + "%";
};
