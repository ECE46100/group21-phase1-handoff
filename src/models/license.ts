import { Octokit } from "@octokit/core";
import * as dotenv from 'dotenv';
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

// Function to fetch the license for a specific GitHub repository
export async function getRepoLicense(owner: string, repo: string): Promise<number> {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/license', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    // Check if license is available and valid
    if (response.data.license?.spdx_id == 'LGPL-2.1' || response.data.license?.spdx_id == 'LGPL-2.1-only' || response.data.license?.spdx_id == 'MIT') {
      return 1;
    } else {
      return licenseHelper(owner, repo);
    }
  } catch (error) {
    return licenseHelper(owner, repo);
  }
}

async function licenseHelper(owner: string, repo: string): Promise<number> {
  // use github api to get package.json, license.md, and readme.md
  const possibleLocations = ['package.json', 'LICENSE.md', 'README.md'];
  for (const location of possibleLocations) {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{location}', {
      owner: owner,
      repo: repo,
      location: location,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const result = Buffer.from(response.data.content, 'base64').toString();
    if (location === 'package.json') {
      const json_result = JSON.parse(result);
      if (json_result.license == "MIT" || json_result.license == "LGPL-2.1" || json_result.license == "LGPL-2.1-only") {
        return 1;
      }
    } else {
      if (result.includes("MIT License") || result.includes("LGPL-2.1") || result.includes("LGPL-2.1-only")) {
        return 1;
      }
    }
  }
  return 0;
}