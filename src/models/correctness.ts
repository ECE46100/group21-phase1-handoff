import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as acorn from 'acorn';
import { exec } from 'child_process';
import { cloneRepo, deleteRepo } from '../utils/clone.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PassThrough } from 'stream';
import { rejects } from 'assert';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoDir = path.join(__dirname, '..', '..', 'repo');
if (!fs.existsSync(repoDir)) {
    fs.mkdirSync(repoDir);
}

export async function getCorrectness(url: string) {
    await cloneRepo(url, repoDir);

    try {
        const { totalFiles, syntaxErrors } = await analyzeFiles(repoDir);
        // const testsPassed = await runTests(repoDir);

        const staticScore = Math.max(0, (totalFiles - syntaxErrors) / (totalFiles > 0 ? totalFiles : 1));
        // const dynamicScore = testsPassed ? 1 : 0;
        // console.log(staticScore);
        // const correctnessScore = (staticScore + dynamicScore) / 2;
        const correctnessScore = staticScore;

        return correctnessScore.toFixed(3);
    } finally {
        await deleteRepo(repoDir);
    }
};

async function analyzeFiles(dir: string): Promise<{ totalFiles: number, syntaxErrors:number }> {
    const jsFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    let syntaxErrors = 0;

    jsFiles.forEach(file => {
        const filePath = path.join(dir, file);
        const code = fs.readFileSync(filePath, 'utf-8');

        try {
            acorn.parse(code, { ecmaVersion: 2020 });
            // console.log(`${filePath} is syntactically correct`);
        } catch (err) {
            if (err instanceof Error) {
                // console.error(`${filePath} is syntactically incorrect: ${err.message}`);
            } else {
                console.error(`Unknown error occurred: ${err}`);
            }
            syntaxErrors++;
        }
    });

    return { totalFiles: jsFiles.length, syntaxErrors };
}

// function runTests(dir: string): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//         const packageJsonPath = path.join(dir, 'package.json');

//         if (fs.existsSync(packageJsonPath)) {
//             const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
//             if (packageJson.scripts && packageJson.scripts.test) {
//                 exec('npm test', { cwd: dir }, (err, stdout, stderr) => {
//                     if (err) {
//                         console.error(`Error running tests: ${err.message}`);
//                         resolve(false);
//                     } else {
//                         console.log(`Test output:\n${stdout}`);
//                         resolve(true);
//                     }
//                 });
//             } else {
//                 console.log(`No tests found in package.json`);
//                 resolve(false);
//             }
//         } else {
//             console.log(`No package.json found`);
//             resolve(false);
//         }
//     });
// }

// function installDependencies(dir: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//         exec('npm install', { cwd: dir }, (err, stdout, stderr) => {
//             if (err) {
//                 // console.error(`Error installing dependencies: ${err.message}`);
//                 reject(err);
//             } else {
//                 // console.log(`Dependencies installed:\n${stdout}`);
//                 resolve();
//             }
//         });
//     }
// }