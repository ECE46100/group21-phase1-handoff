import { getBusFactorGitHub, getBusFactorNPM } from "../models/busFactor.js";
import { getRampUpTimeGitHub, getRampUpTimeNPM } from "../models/rampUpTime.js";
import { getResponsivenessGitHub, getResponsivenessNPM } from "../models/responsiveness.js";
import fetch from 'node-fetch';

export class URLHandler {
    async handle(url: string) {
        if (url.includes('github.com')) {
            // GitHub Url, Call Imported Functions
            return await this.GitHubHandler(url);
        } else if (url.includes('npmjs.com')) {
            // NPM URL, Call Fetch Function
            return await this.NPMHandler(url);
        } else {
            throw new Error('Unsupported URL. Please provide a GitHub or NPM URL');
        }
    }

    async GitHubHandler(url: string) {
        const { owner, repo } = this.extractOwnerRepo(url);
        
        const busFactor = await getBusFactorGitHub(owner, repo);
        const rampUpTime = await getRampUpTimeGitHub(owner, repo);
        const responsiveness = await getResponsivenessGitHub(owner, repo);

        return {
            busFactor,
            rampUpTime,
            responsiveness,
        };
    }

    async NPMHandler(url: string) {
        const packageName = this.extractPackageName(url);
        const metadata = await this.getNpmMetadata(packageName);

        const busFactor = getBusFactorNPM(metadata);
        const rampUpTime = getRampUpTimeNPM(metadata);
        const responsiveness = getResponsivenessNPM(metadata);

        return {
            busFactor,
            rampUpTime,
            responsiveness,
        };
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
        return await response.json();
    }
}