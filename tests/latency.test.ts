import { describe, test, expect } from 'vitest';
import { getLatency } from '../src/models/latency';


describe('Latency', () => {
    let start = performance.now();
    test(`Expecting a score for latency`, async () => {
        const latency = await getLatency(start, performance.now());
        expect(latency).toBeTypeOf('number');
    });
});