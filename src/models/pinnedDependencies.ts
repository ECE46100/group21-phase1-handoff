import { Octokit } from "octokit";
import * as dotenv from 'dotenv';
import { error } from "console";
import semver from "semver";

dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

function isPinnedToMajorMinor(versionRange: string) {
  // Split by '||' for disjunctive ranges
  const ranges = versionRange.split('||').map(range => range.trim());
  // check if the min versions match across ranges
  const minVersions = ranges.map(range => [semver.minVersion(range)?.major, semver.minVersion(range)?.minor]);
  if (minVersions.some(minVersion => minVersion !== minVersions[0])) return false;

  return ranges.every(range => {
    const minVersion = semver.minVersion(range);
    if (!minVersion) return false;

    const major = minVersion.major;
    const minor = minVersion.minor;
    const patch = minVersion.patch;
    
    const incrMinor = `${major}.${minor + 1}.${patch}`;
    const incrMajor = `${major + 1}.${minor}.${patch}`;
    return !(semver.satisfies(incrMinor, range) || semver.satisfies(incrMajor, range));
  });
}

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
            if (typeof version==="string" && isPinnedToMajorMinor(version)) {
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
