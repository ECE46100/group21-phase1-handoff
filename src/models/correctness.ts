import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { cloneRepo, deleteRepo } from '../utils/clone.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ESLint } from 'eslint';

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
        const staticScore = Math.max(0, 1 - (syntaxErrors / totalFiles / 10));
        const correctnessScore = staticScore;

        return correctnessScore.toFixed(3);
    } finally {
        await deleteRepo(repoDir);
    }
};

async function analyzeFiles(dir: string): Promise<{ totalFiles: number, syntaxErrors:number }> {
    const eslint = new ESLint(
        {
            allowInlineConfig: true,
            globInputPaths: true,
            ignore: true,
            overrideConfigFile: path.join(__dirname, '..', '..', 'eslint.config.mjs')
        }
    );
    const jsTsPattern = path.join(dir, '**', '*.{js,ts}');
    const resultJson = await eslint.lintFiles(jsTsPattern);
    const syntaxErrors = resultJson.reduce((acc, result) => acc + result.errorCount, 0);
    const totalFiles = resultJson.length;

    return { totalFiles: totalFiles, syntaxErrors };
}
