import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { vi } from 'vitest';
import * as fs from 'fs';
import * as git from 'isomorphic-git';
import { cloneRepo, deleteRepo } from '../../src/utils/clone';

vi.mock('fs');
vi.mock('isomorphic-git');

describe('cloneRepo', () => {
    const url = 'https://github.com/user/repo.git';
    const dir = '/path/to/repo';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('check clone', async () => {
        await cloneRepo(url, dir);

        expect(git.clone).toHaveBeenCalledWith({
            fs,
            http: expect.anything(),
            dir,
            url,
            depth: 1,
        });
    });
});
