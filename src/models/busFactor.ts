import { Octokit } from "octokit";
import * as dotenv from 'dotenv';

dotenv.config();
        auth: process.env.GITHUB_API_TOKEN
export async function getBusFactor(url: string) {
    const octokit = new Octokit({ 
        auth: process.env.GITHUB_API_TOKEN
    });

    // extract repository name and its owner from the URL
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    if (!match) {
        throw new Error("Invalid URL");
    }
    const owner = match[1];
    const repo = match[2];

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
        const author = commit.author.login;
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
