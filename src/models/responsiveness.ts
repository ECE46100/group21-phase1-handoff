import { Octokit } from "octokit";
import * as dotenv from 'dotenv';

dotenv.config();
        auth: process.env.GITHUB_API_TOKEN
export async function getResponsiveness(owner: string, repo: string) {
    const octokit = new Octokit({
        auth: process.env.GITHUB_API_TOKEN
    });

    // Fetch issues for the repository
    const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: owner,
        repo: repo,
        state: 'closed',
        since: '2015-01-01T00:00:00Z'
    });

    const issues = response.data;
    let totalResponseTime = 0;
    let issueCount = 0;

    issues.forEach((issue: any) => {
        if (!issue.created_at || !issue.closed_at) return;  // Skip if no dates are found

        const createdAt = new Date(issue.created_at).getTime();
        const closedAt = new Date(issue.closed_at).getTime();

        // Calculate time difference in hours
        const responseTimeHours = (closedAt - createdAt) / (1000 * 60 * 60);
        totalResponseTime += responseTimeHours;
        issueCount++;
    });

    if (issueCount === 0) {
        return "No issues found";
    }

    const avgResponseTime = totalResponseTime / issueCount;

    return avgResponseTime.toFixed(2) + " hours";
};