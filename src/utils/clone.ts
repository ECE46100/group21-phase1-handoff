import * as fs from 'fs';
import * as path from 'path';
import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const repoDir = path.join(__dirname, '..', '..', 'repo');
if (!fs.existsSync(repoDir)) {
    fs.mkdirSync(repoDir);
}

export async function cloneRepo(url: string, dir: string) {
    await git.clone({
        fs,
        http,
        dir,
        url,
        depth: 1,
    });
    console.log(`Cloned ${url} to ${dir}`);
}

export async function deleteRepo(dir: string) {
    try {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
            console.log(`Deleted ${dir}`);
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error deleting ${dir}: ${err.message}`);
        } else {
            console.error(`Unknown error deleting ${dir}: ${err}`);
        }
    }
}