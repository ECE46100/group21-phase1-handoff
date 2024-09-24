import { describe, it, expect, vi } from 'vitest';
import { program } from '../../src/utils/cli';
import { install } from '../../src/commands/install';
import { analyze } from '../../src/commands/analyze';

vi.mock('../../src/commands/install');
vi.mock('../../src/commands/analyze');

describe('CLI', () => {
    it('check install', async () => {
        await program.parseAsync(['install'], {from: 'user'});
        expect(install).toHaveBeenCalled();
    });

    const packageURL = 'https://www.npmjs.com/package/wat4hjs';

    it('check analyze', async () => {
        await program.parseAsync([packageURL], {from: 'user'});
        expect(analyze).toHaveBeenCalledWith(packageURL, expect.any(Object), expect.any(Object));
    });
});