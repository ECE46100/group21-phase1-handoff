import { describe, test, expect } from 'vitest';
import { URLHandler } from '../src/utils/urlHandler';
import { getRampUpTime } from '../src/models/rampUpTime';

const lowScore = 0.333;
const mediumScore = 0.666;
const highScore = 1;

const urls = [ 
    {url: "https://www.npmjs.com/package/wat4hjs", expected: 'medium'},
    {url: "https://github.com/mrdoob/three.js/", expected: 'low'},
    {url: "https://www.npmjs.com/package/socket.io", expected: 'low'},
    {url: "https://github.com/prathameshnetake/libvlc", expected: 'high'},
    {url: "https://www.npmjs.com/package/react", expected: 'low'}]
    
const urlHandler = new URLHandler();

describe('Ramp Up', () => {
    urls.forEach(({url, expected}) => {
        test(`Expecting ${expected} score for ${url}`, async () => {
            let owner: string;
            let repo: string;
            if(url.includes('github.com')) {
                ({owner, repo} = urlHandler.extractOwnerRepo(url));
            } else if(url.includes('npmjs.com')) {
                const packageName = await urlHandler.NPMHandler(url);
                ({owner, repo} = urlHandler.extractOwnerRepo(packageName));
            } else {
                throw new Error('Unsupported URL. Please provide a GitHub or NPM URL');
            }
            if(expected === 'low') {
                expect(parseFloat(await getRampUpTime(owner, repo))).toBeLessThanOrEqual(lowScore);
            } else if(expected === 'medium') {
                expect(parseFloat(await getRampUpTime(owner, repo))).toBeGreaterThan(lowScore);
                expect(parseFloat(await getRampUpTime(owner, repo))).toBeLessThanOrEqual(mediumScore);
            } else if(expected === 'high') {
                expect(parseFloat(await getRampUpTime(owner, repo))).toBeGreaterThan(mediumScore);
            }
        });
    });
});