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
        state: 'all',
        per_page: 50
    });

    // --- // OLD CODE OLD CODE OLD CODE // --- //
    // const issues = response.data;
    // let totalResponseTime = 0;
    // let issueCount = 0;

    // issues.forEach((issue: any) => {
    //     if (!issue.created_at || !issue.closed_at) return;  // Skip if no dates are found

    //     const createdAt = new Date(issue.created_at).getTime();
    //     const closedAt = new Date(issue.closed_at).getTime();

    //     // Calculate time difference in hours
    //     const responseTimeHours = (closedAt - createdAt) / (1000 * 60 * 60);
    //     totalResponseTime += responseTimeHours;
    //     issueCount++;
    // });

    // if (issueCount === 0) {
    //     return "No issues found";
    // }

    // const avgResponseTime = totalResponseTime / issueCount;

    // return avgResponseTime.toFixed(2) + " hours";
    // --- // OLD CODE OLD CODE OLD CODE // --- //

    const issues = response.data.filter((issue: any) => issue.pull_request === undefined);

    let totalResponseTime = 0;
    let totalResolutionTime = 0;
    let resolvedIssuesCount = 0;

    issues.forEach((issue: any) => {
        if (issue.created_at && issue.closed_at) {
            const createdAt = new Date(issue.created_at).getTime();
            const closedAt = new Date(issue.closed_at).getTime();

            const firstResponseTime = (issue.comments && Array.isArray(issue.comments) && issue.comments.length > 0) ? new Date(issue.comments[0].created_at).getTime() : createdAt;

            totalResponseTime += 1 / (1 + (firstResponseTime - createdAt) / (1000 * 60 * 60 * 24)); // Output in Days
            totalResolutionTime += 1 / (1 + (closedAt - createdAt) / (1000 * 60 * 60 * 24 * 14)); // Normalized to 2 Weeks
        
            resolvedIssuesCount++;
        }
    });

    const totalIssues = issues.length;
    const issueResRate = resolvedIssuesCount / totalIssues;

    const responsiveness = 0.4 * (totalResponseTime / totalIssues) +
                            0.4 * (totalResolutionTime / totalIssues) +
                            0.2 * issueResRate;

    return responsiveness.toFixed(3);
};