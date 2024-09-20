import { describe, test, expect } from 'vitest';
import { URLHandler } from '../src/utils/urlHandler';
import { getResponsiveness } from '../src/models/responsiveness';

const lowScore = 0.333;
const mediumScore = 0.666;
const highScore = 1;

const urls = [ 
    {url: "https://github.com/mrdoob/three.js/", expected: 'high'},
    {url: "https://www.npmjs.com/package/socket.io", expected: 'medium'},
    {url: "https://www.npmjs.com/package/react", expected: 'high'}]

const urlHandler = new URLHandler();

describe('Responsiveness', () => {
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
                expect(parseFloat(await getResponsiveness(owner, repo))).toBeLessThanOrEqual(lowScore);
            } else if(expected === 'medium') {
                expect(parseFloat(await getResponsiveness(owner, repo))).toBeGreaterThan(lowScore);
                expect(parseFloat(await getResponsiveness(owner, repo))).toBeLessThanOrEqual(mediumScore);
            } else if(expected === 'high') {
                expect(parseFloat(await getResponsiveness(owner, repo))).toBeGreaterThan(mediumScore);
            }
        });
    });
});