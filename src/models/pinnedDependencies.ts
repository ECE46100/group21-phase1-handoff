import { Octokit } from "octokit";
import * as dotenv from 'dotenv';
import { error } from "console";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});


export async function getPinnedDependencies(owner: string, repo: string): Promise<string> {
    try {
        // Fetch the package.json file from the repository
        const response = await octokit.request("GET /repos/{owner}/{repo}/contents/package.json", {
            owner,
            repo,
            headers: {
                accept: "application/vnd.github.v3.raw" // Retrieve raw file content
            }
        });

        /* Parse the JSON content of package.json */
        const packageJson = JSON.parse(response.data as string);
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

        let pinnedCount = 0;
        let totalDependencies = 0;

        /* Analyze each dependency version */
        for (const version of Object.values(dependencies)) {
            totalDependencies++;
            // console.log(version);
            if (typeof version==="string" && /^\d+\.\d+(\.x|\.\*)?$|^\d+\.\d+\.\d+$/.test(version)){
                /* 
                    checks for example : "2.3.3" || "2.3.*" || "2.3.x" 
                    the followings do not count : "2.x" || "^2.3.4" || "~2.3.4" 
                */
                pinnedCount++;
            }
        }

        /* Calculate the fraction of pinned dependencies, return 1 if no dependencies at all */
        const fractionPinned = totalDependencies > 0 ? pinnedCount / totalDependencies : 1;
        return fractionPinned.toFixed(3);
    } catch (error) {
        return "-1"; /* return -1 if error */
    }
}
