import { Octokit } from "octokit";
import * as dotenv from 'dotenv';
// import fs from 'fs';

dotenv.config();
        auth: process.env.GITHUB_API_TOKEN
export async function getRampUpTime(owner: string, repo: string) {
    const octokit = new Octokit({ 
        auth: process.env.GITHUB_API_TOKEN
    });

    // send the GET request for "list contents" API to get the repo size
    const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: owner,
        repo: repo,
        per_page: 10
    });
    
    const commitTimes: number[] = commits.data.map((commit: any) => new Date(commit.commit.author.date).getTime());

    const timeMin = Math.min(...commitTimes);
    const timeMax = Math.max(...commitTimes);

    const normalizedTimes = commitTimes.map((time: number) => (time - timeMin) / (timeMax - timeMin));

    const avgNormalizedTime = normalizedTimes.reduce((a, b) => a + b, 0) / normalizedTimes.length;

    return avgNormalizedTime.toFixed(3);
};