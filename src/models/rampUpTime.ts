import { Octokit } from "octokit";
import * as dotenv from 'dotenv';

dotenv.config();

export async function getRampUpTime(owner: string, repo: string) {
        auth: process.env.GITHUB_TOKEN
    const octokit = new Octokit({ 
        auth: process.env.GITHUB_TOKEN
    });

    try {
        // send the GET request for "list contents" API to get the repo size
        const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
            owner: owner,
            repo: repo,
            per_page: 10
        });

        if (commits.data.length === 0) {
            return "0.000";
        }

        const commitTimes: number[] = commits.data.map((commit: { commit: { author: { date: string } } }) => 
            new Date(commit.commit.author.date).getTime()
        );

        const timeMin = Math.min(...commitTimes);
        const timeMax = Math.max(...commitTimes);

        if (timeMin === timeMax) {
            return "0.000";
        }

        const normalizedTimes = commitTimes.map((time: number) => (time - timeMin) / (timeMax - timeMin));

        const avgNormalizedTime = normalizedTimes.reduce((a, b) => a + b, 0) / normalizedTimes.length;

        return avgNormalizedTime.toFixed(3);
    } catch (error) {
        return "0.000";
    }
};
