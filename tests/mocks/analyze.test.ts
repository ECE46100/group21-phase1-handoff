import { describe, it, expect, vi } from 'vitest';
import { analyze } from '../../src/commands/analyze';
import { URLHandler } from '../../src/utils/urlHandler';
vi.mock('../src/utils/urlHandler');

describe('analyze', () => {
    it('check ndjson output format', async () => {
        const packageURL = 'https://github.com/package';
        const mockHandle = vi.fn().mockResolvedValue({
            netScore: '0.0',
            netScoreLatency: expect.any(Number),
            rampUpTime: '0.0',
            rampUpTimeLatency: expect.any(Number),
            correctness: '0.0',
            correctnessLatency: expect.any(Number),
            busFactor: '0.0',
            busFactorLatency: expect.any(Number),
            responsiveness: '0.0',
            responsivenessLatency: expect.any(Number),
            license: expect.any(Number),
            licenseLatency: expect.any(Number)
        });
        
        URLHandler.prototype.handle = mockHandle;
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        await analyze(packageURL);

        const expectedOutput = {
            URL: packageURL,
            NetScore: 0,
            NetScore_Latency: expect.any(Number),
            RampUp: 0,
            RampUp_Latency: expect.any(Number),
            Correctness: 0,
            Correctness_Latency: expect.any(Number),
            BusFactor: 0,
            BusFactor_Latency: expect.any(Number),
            ResponsiveMaintainer: 0,
            ResponsiveMaintainer_Latency: expect.any(Number),
            License: expect.any(Number),
            License_Latency: expect.any(Number)
        };

        expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(expectedOutput) + '\n');
        consoleSpy.mockRestore();
    });
});
