import { Octokit } from "octokit";
import type { GraphQlQueryResponseData } from "@octokit/graphql"; 
/* The default type of a graphQL response. We'd get TS errors if not used  */

import * as dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

export async function getReviewedMerge(owner: string, repo: string): Promise<string> {
    let reviewedCount = 0;
    let totalMergedPRs = 0;
    let hasNextPage = true;
    let endCursor: string | null = null;

    while (hasNextPage) {
        /* fetch merged PRs & reviews via graphQL */
        const response: GraphQlQueryResponseData = await octokit.graphql({
            query: `
                query ($owner: String!, $repo: String!, $endCursor: String) {
                    repository(owner: $owner, name: $repo) {
                        pullRequests(first: 100, after: $endCursor, states: MERGED) {
                            pageInfo {
                                hasNextPage
                                endCursor
                            }
                            nodes {
                                mergedAt
                                reviews(first: 1) {
                                    totalCount
                                }
                            }
                        }
                    }
                }
            `,
            owner,
            repo,
            endCursor
        });

        const pullRequests = response.repository.pullRequests.nodes;

        /* count reviewed and total merged PRs */
        for (const pr of pullRequests) {
            totalMergedPRs++;
            if (pr.reviews.totalCount > 0) {
                reviewedCount++;
            }
        }

        /* update end condition */
        hasNextPage = response.repository.pullRequests.pageInfo.hasNextPage;
        endCursor = response.repository.pullRequests.pageInfo.endCursor;
    }

    /* calculate the fraction of reviewed merges */
    const fractionReviewed = totalMergedPRs > 0 ? reviewedCount / totalMergedPRs : 0;
    return fractionReviewed.toFixed(3);
}
