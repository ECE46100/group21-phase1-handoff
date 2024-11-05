import { getBusFactor } from "../models/busFactor.js";
import { getRampUpTime } from "../models/rampUpTime.js";
import { getResponsiveness } from "../models/responsiveness.js";
import { getLatency } from "../models/latency.js";
import { getCorrectness } from "../models/correctness.js";
import { getRepoLicense } from "../models/license.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from "fs";
import { cloneRepo, deleteRepo } from '../utils/clone.js';import { getReviewedMerge } from "../models/reviewedMerge.js";
import { getPinnedDependencies } from "../models/pinnedDependencies.js"

import fetch from 'node-fetch';

interface repository {
    url: string;
}
interface metadata {
    repository: repository;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoDir = join(__dirname, '..', '..', 'repo');
if (!existsSync(repoDir)) {
    mkdirSync(repoDir);
}

export class URLHandler {
    async handle(url: string) {
        if (url.includes('github.com')) {
            // GitHub Url, Call Imported Functions
            return await this.GitHubHandler(url);
        } else if (url.includes('npmjs.com')) {
            // NPM URL, Call Fetch Function
            const githubUrl = await this.NPMHandler(url);
            return await this.GitHubHandler(githubUrl);
        } else {
            throw new Error('Unsupported URL. Please provide a GitHub or NPM URL');
        }
    }

    async GitHubHandler(url: string) {
        const { owner, repo } = this.extractOwnerRepo(url);
        await cloneRepo(url, join(__dirname, '..', '..', 'repo'));
        let logLatencyStartNet = performance.now();
        let logLatencyStart = performance.now();
        const busFactor = await getBusFactor(owner, repo);
        const busFactorLatency = await getLatency(logLatencyStart, performance.now());

        logLatencyStart = performance.now();
        const rampUpTime = await getRampUpTime(owner, repo);
        const rampUpTimeLatency = await getLatency(logLatencyStart, performance.now());

        logLatencyStart = performance.now();
        const responsiveness = await getResponsiveness(owner, repo);
        const responsivenessLatency = await getLatency(logLatencyStart, performance.now());

        logLatencyStart = performance.now();
        const correctness = await getCorrectness();
        const correctnessLatency = await getLatency(logLatencyStart, performance.now());

        logLatencyStart = performance.now();
        const license = await getRepoLicense(owner, repo);
        const licenseLatency = await getLatency(logLatencyStart, performance.now());

        logLatencyStart = performance.now();
        const reviewedMerge = await getReviewedMerge(owner, repo);
        const reviewedMergeLatency = await getLatency(logLatencyStart, performance.now());

        logLatencyStart = performance.now();
        const pinnedDependencies = await getPinnedDependencies(owner, repo);
        const pinnedDependenciesLatency = await getLatency(logLatencyStart, performance.now());

        const netScore = (license * (0.125 * parseFloat(busFactor) + 0.5 * parseFloat(correctness) + 0.125 * parseFloat(rampUpTime) + 0.25 * parseFloat(responsiveness))).toFixed(3);
        const netScoreLatency = await getLatency(logLatencyStartNet, performance.now());

        deleteRepo(join(__dirname, '..', '..', 'repo'));
        return {
            netScore,
            netScoreLatency,
            busFactor,
            busFactorLatency,
            rampUpTime,
            rampUpTimeLatency,
            responsiveness,
            responsivenessLatency,
            correctness,
            correctnessLatency,
            license,
            licenseLatency,
            reviewedMerge,
            reviewedMergeLatency,
            pinnedDependencies,
            pinnedDependenciesLatency,
        };
    }

    async NPMHandler(url: string) {
        const packageName = this.extractPackageName(url);
        const metadata = await this.getNpmMetadata(packageName);
        if(typeof metadata === 'object' && metadata !== null
             && 'repository' in metadata && typeof metadata.repository === 'object' 
             && metadata.repository !== null && 'url' in metadata.repository 
             && typeof metadata.repository.url === 'string') {
            
            let repoUrl = (metadata.repository.url).replace(/^git\+/, '').replace(/\.git$/, '').replace('git://', 'https://');

            if (repoUrl.startsWith('ssh://git@github.com:')) {
                repoUrl = repoUrl.replace('ssh://git@github.com:', 'https://github.com/');
            } else if (repoUrl.startsWith('ssh://git@github.com/')) {
                repoUrl = repoUrl.replace('ssh://git@github.com/', 'https://github.com/');
            }
            
            return repoUrl
            // return (metadata.repository.url).replace(/^git\+/, '').replace(/\.git$/, '').replace('git://', 'https://');
        }
        else {
            throw new Error('No GitHub repository found for the NPM package. Please provide another NPM URL');
        }
    }

    extractOwnerRepo(url: string) {
        const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
        const match = url.match(regex);
        if (!match) {
            throw new Error("Invalid URL");
        }
        const owner = match[1];
        const repo = match[2];
        return { owner, repo };
    }

    extractPackageName(url: string) {
        const regex = /https:\/\/www\.npmjs\.com\/package\/([^\/]+)/;
        const match = url.match(regex);
        if (!match) {
            throw new Error('Invalid NPM URL');
        }
        return match[1];
    }

    async getNpmMetadata(packageName: string) {
        const response = await fetch(`https://registry.npmjs.org/${packageName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch NPM metadata');
        }
        return await response.json() as metadata;
    }
}