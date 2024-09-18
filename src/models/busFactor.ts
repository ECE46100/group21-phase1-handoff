import { Octokit } from "octokit";
import * as dotenv from 'dotenv';

dotenv.config();
        auth: process.env.GITHUB_API_TOKEN
export async function getBusFactorGitHub(owner: string, repo: string) {
    const octokit = new Octokit({ 
        auth: process.env.GITHUB_API_TOKEN
    });

    // send the GET request for "list commits" API
    const response = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: owner,
        repo: repo,
        since: '2015-01-01T00:00:00Z'
    });

    // parse the response such that we create a dictionary of commit_author : number_of_commits mappings
    const commits = response.data;
    var commiters = new Map<string, number>();

    commits.forEach((commit: any) => {
        const author = commit.author ? commit.author.login : null;
        if(!author) {
            return;
        }
        else if(commiters.has(author)) {
            commiters.set(author, (commiters.get(author) || 0) + 1);
        }
        else {
            commiters.set(author, 1);
        }
    });
    
    // sort the dictionary by number_of_commits
    const totalCommits = Array.from(commiters.values()).reduce((a, b) => a + b, 0);
    var busFactor = 0;
    for (const [author, commits] of commiters.entries()) {
        busFactor += (commits / totalCommits) ** 2;
    };

    return busFactor.toFixed(3);
};

export function getBusFactorNPM(metadata: any) {
    const maintainers = metadata.maintainers || [];
    const busFactor = 1 / maintainers.length;
    return busFactor.toFixed(3);
}