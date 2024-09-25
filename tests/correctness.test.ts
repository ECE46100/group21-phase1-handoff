import { describe, test, expect } from 'vitest';
import { URLHandler } from '../src/utils/urlHandler';
import { getCorrectness } from '../src/models/correctness';

const lowScore = 0.333;
const mediumScore = 0.666;
const highScore = 1;

const urls = [ 
    {url: "https://www.npmjs.com/package/wat4hjs", expected: 'low'},
    {url: "https://github.com/mrdoob/three.js/", expected: 'high'},
    {url: "https://www.npmjs.com/package/socket.io", expected: 'low'},
    {url: "https://github.com/prathameshnetake/libvlc", expected: 'medium'},
    {url: "https://www.npmjs.com/package/react", expected: 'low'},
    {url: "https://www.npmjs.com/package/unlicensed", expected: 'low'}]

const urlHandler = new URLHandler();

describe('Correctness', () => {
    urls.forEach(({url, expected}) => {
        test(`Expecting ${expected} score for ${url}`, async () => {
            let owner: string;
            let repo: string;
            let githubUrl: string;
            if(url.includes('github.com')) {
                // Good URL
                githubUrl = url;
            } else if(url.includes('npmjs.com')) {
                // Good URL - Convert to GitHub
                githubUrl = await urlHandler.NPMHandler(url);
            } else {
                throw new Error('Unsupported URL. Please provide a GitHub or NPM URL');
            }
            if(expected === 'low') {
                expect(parseFloat(await getCorrectness(githubUrl))).toBeLessThanOrEqual(lowScore);
            } else if(expected === 'medium') {
                expect(parseFloat(await getCorrectness(githubUrl))).toBeGreaterThan(lowScore);
                expect(parseFloat(await getCorrectness(githubUrl))).toBeLessThanOrEqual(mediumScore);
            } else if(expected === 'high') {
                expect(parseFloat(await getCorrectness(githubUrl))).toBeGreaterThan(mediumScore);
            }
        });
    });
});