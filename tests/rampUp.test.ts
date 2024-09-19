// Test TypeScript file
import { describe, test, expect } from 'vitest';
import { getBusFactor } from '../src/models/busFactor';
import { URLHandler } from '../src/utils/urlHandler';

const lowScore = 0.333;
const mediumScore = 0.666;
const highScore = 1;

const urls = [ 
    {url: "https://www.npmjs.com/package/wat4hjs", expected: 'medium'},
    {url: "https://github.com/mrdoob/three.js/", expected: 'low'},
    {url: "https://www.npmjs.com/package/socket.io", expected: 'low'},
    {url: "https://github.com/prathameshnetake/libvlc", expected: 'high'},
    {url: "https://www.npmjs.com/package/react", expected: 'high'}]

const urlHandler = new URLHandler();

describe('Ramp Up', () => {
    urls.forEach(({url, expected}) => {
    });
});