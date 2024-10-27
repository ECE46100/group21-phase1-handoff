import { Octokit } from "octokit";
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Calculate the fraction of merged pull requests that have been reviewed.
 * @param owner - GitHub owner or organization name.
 * @param repo - GitHub repository name.
 * @returns The fraction of merged pull requests that have at least one code review.
 */
export async function getReviewedMergeFraction(owner: string, repo: string): Promise<number> {
    const octokit = new Octokit({ 
        auth: process.env.GITHUB_TOKEN 
    });

    let reviewedCount = 0;
    let totalMergedPRs = 0;
    let page = 1;
    const perPage = 100;  // GitHub's max allowed per page

    while (true) {
        const prResponse = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner,
            repo,
            state: 'closed',
            per_page: perPage,
            page: page
        });

        const mergedPRs = prResponse.data.filter(pr => pr.merged_at !== null);
        
        // If no more merged PRs, break the loop
        if (mergedPRs.length === 0) break;

        // Process each merged PR to check for reviews
        for (const pr of mergedPRs) {
            totalMergedPRs++;

            // Fetch reviews for the PR
            const reviewsResponse = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
                owner,
                repo,
                pull_number: pr.number
            });

            // If there is at least one review, count it as reviewed
            if (reviewsResponse.data.length > 0) {
                reviewedCount++;
            }
        }

        // Move to the next page of pull requests
        page++;
    }

    // Calculate the fraction of reviewed merges
    const fractionReviewed = totalMergedPRs > 0 ? reviewedCount / totalMergedPRs : 0;
    return parseFloat(fractionReviewed.toFixed(3));
};
