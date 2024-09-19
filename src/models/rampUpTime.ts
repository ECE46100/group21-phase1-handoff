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

    // --- // OLD CODE OLD CODE OLD CODE // --- //
    // Repository size (in KB) gives a rough measure of complexity
    // const repoSizeKB = response.data.size;

    // send the GET request for "list files" API to check for documentation
    // const readmeResponse = await octokit.request("GET /repos/{owner}/{repo}/contents/README.md", {
    //     owner: owner,
    //     repo: repo
    // }).catch(() => null);  // README might not exist

    // const hasReadme = readmeResponse ? true : false;

    // Check for the presence of a CONTRIBUTING.md file
    // const contributingResponse = await octokit.request("GET /repos/{owner}/{repo}/contents/CONTRIBUTING.md", {
    //     owner: owner,
    //     repo: repo
    // }).catch(() => null);  // CONTRIBUTING.md might not exist

    // const hasContributingGuide = contributingResponse ? true : false;

    // Example logic to calculate ramp-up time based on size and documentation
    // let rampUpTime = repoSizeKB / 1000;  // Normalize size to MB for scaling

    // if (hasReadme) {
    //     rampUpTime *= 0.8;  // Reduce ramp-up time if README is present
    // }

    // if (hasContributingGuide) {
    //     rampUpTime *= 0.7;  // Further reduce if CONTRIBUTING.md is present
    // }

    // return rampUpTime.toFixed(2);  // return ramp-up time score
    // --- // OLD CODE OLD CODE OLD CODE // --- //
    
    const commitTimes: number[] = commits.data.map((commit: any) => new Date(commit.commit.author.date).getTime());

    const timeMin = Math.min(...commitTimes);
    const timeMax = Math.max(...commitTimes);

    const normalizedTimes = commitTimes.map((time: number) => (time - timeMin) / (timeMax - timeMin));

    const avgNormalizedTime = normalizedTimes.reduce((a, b) => a + b, 0) / normalizedTimes.length;

    return avgNormalizedTime.toFixed(3);
};