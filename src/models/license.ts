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
    if (response.data.license) {
      const licenseKey = response.data.license.key.toLowerCase();
      console.log(`License found: ${response.data.license.name}`);

      // Treat licenses with 'noassertion' or similar ambiguous values as 'no license'
      const noLicenseKeys = ["noassertion", "unlicense", "other"];
      if (noLicenseKeys.includes(licenseKey)) {
        console.log(`License "${licenseKey}" treated as no license.`);
        return 0; // No valid license
      }

      return 1; // Valid license found
    }
  } catch (error) {
    if (error instanceof Error) {
      // Specific handling for Error objects
      console.error('Error fetching license:', error.message);
    } else {
      console.error('An unknown error occurred.', error);
    }
  }

  return 0; // Default return in case of unexpected issues
}

// Helper function to extract owner and repo from a GitHub package URL
function extractRepoInfo(packageURL: string): { owner: string; repo: string } | null {
  const match = packageURL.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    const owner = match[1];
    const repo = match[2];
    return { owner, repo };
  }
  return null;
}

// Updated analyze function to include license fetching
export const analyze = async (packageURL: string) => {
  console.log(`Fetching security metrics for package: ${packageURL}`);
  console.log(`Fetching license requirements for package: ${packageURL}`);
  
  const repoInfo = extractRepoInfo(packageURL);

  if (repoInfo) {
    const { owner, repo } = repoInfo;
    const licenseStatus = await getRepoLicense(owner, repo);
    console.log(`License status: ${licenseStatus}`);
    return licenseStatus; // Return 1 if license exists, 0 if not
  } else {
    console.log('Invalid GitHub repository URL.');
    return 0; // Return 0 if the URL is not a valid GitHub repo URL
  }
};
