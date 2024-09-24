import { describe, it, expect, vi } from 'vitest';
import { URLHandler } from '../../src/utils/urlHandler';
import * as busFactorModule from '../../src/models/busFactor';
import * as rampUpTimeModule from '../../src/models/rampUpTime';
import * as responsivenessModule from '../../src/models/responsiveness';
import * as correctnessModule from '../../src/models/correctness';
import * as licenseModule from '../../src/models/license';
import * as latencyModule from '../../src/models/latency';
import fetch from 'node-fetch';
import { N } from 'vitest/dist/chunks/reporters.WnPwkmgA.js';

vi.mock('node-fetch');
vi.mock('../src/models/busFactor');
vi.mock('../src/models/rampUpTime');
vi.mock('../src/models/responsiveness');
vi.mock('../src/models/latency');
vi.mock('../src/models/correctness');
vi.mock('../src/models/license');
vi.mock('../src/models/latency');

describe('URLHandler', () => {
    const urlHandler = new URLHandler();

    it('check GitHubHandler', async () => {
        const url = 'https://github.com/owner/repo';

        vi.spyOn(busFactorModule, 'getBusFactor').mockResolvedValue('0');
        vi.spyOn(rampUpTimeModule, 'getRampUpTime').mockResolvedValue('0');
        vi.spyOn(responsivenessModule, 'getResponsiveness').mockResolvedValue('0');
        vi.spyOn(correctnessModule, 'getCorrectness').mockResolvedValue('0');
        vi.spyOn(licenseModule, 'getRepoLicense').mockResolvedValue(0);
        vi.spyOn(latencyModule, 'getLatency').mockResolvedValue(0);

        const result = await urlHandler.handle(url);

        expect(result).toEqual({
            busFactor: expect.any(String),
            busFactorLatency: expect.any(Number),
            rampUpTime: expect.any(String),
            rampUpTimeLatency: expect.any(Number),
            responsiveness: expect.any(String),
            responsivenessLatency: expect.any(Number),
            correctness: expect.any(String),
            correctnessLatency: expect.any(Number),
            license: expect.any(Number),
            licenseLatency: expect.any(Number),
            netScore: expect.any(String),
            netScoreLatency: expect.any(Number)
        });
    });

    it('check NPMHandler', async () => {
        const url = 'https://www.npmjs.com/package/package-name';
        const mockMetadata = {
            repository: {
                url: 'git+https://github.com/owner/repo.git'
            }
        };

        (fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockMetadata)
        });

        vi.spyOn(busFactorModule, 'getBusFactor').mockResolvedValue('0');
        vi.spyOn(rampUpTimeModule, 'getRampUpTime').mockResolvedValue('0');
        vi.spyOn(responsivenessModule, 'getResponsiveness').mockResolvedValue('0');
        vi.spyOn(correctnessModule, 'getCorrectness').mockResolvedValue('0');
        vi.spyOn(licenseModule, 'getRepoLicense').mockResolvedValue(0);
        vi.spyOn(latencyModule, 'getLatency').mockResolvedValue(0);

        const result = await urlHandler.handle(url);

        expect(result).toEqual({
            busFactor: expect.any(String),
            busFactorLatency: expect.any(Number),
            rampUpTime: expect.any(String),
            rampUpTimeLatency: expect.any(Number),
            responsiveness: expect.any(String),
            responsivenessLatency: expect.any(Number),
            correctness: expect.any(String),
            correctnessLatency: expect.any(Number),
            license: expect.any(Number),
            licenseLatency: expect.any(Number),
            netScore: expect.any(String),
            netScoreLatency: expect.any(Number)
        });
    });

    it('check unsupported url', async () => {
        const url = 'https://unsupported.com/package-name';
        await expect(urlHandler.handle(url)).rejects.toThrow('Unsupported URL. Please provide a GitHub or NPM URL');
    });
});
