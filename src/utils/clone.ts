import * as fs from 'fs';
import * as path from 'path';
import { simpleGit } from 'simple-git';
// const repoDir = path.join(__dirname, '..', '..', 'repo');
// if (!fs.existsSync(repoDir)) {
//     fs.mkdirSync(repoDir);
// }

export async function cloneRepo(url: string, dir: string) {
    // TODO: Both versions super flow for big repos - need to figure out why ours is faster
    // await clone({
    //     fs,
    //     http,
    //     dir: dir,
    //     url: url,
    //     depth: 1,
    // });
    await simpleGit().clone(
        url,
        dir,
        ["--depth", "1"]
    );
}

export async function deleteRepo(dir: string) {
    try {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error deleting ${dir}: ${err.message}`);
        } else {
            console.error(`Unknown error deleting ${dir}: ${err}`);
        }
    }
}