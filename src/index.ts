// Main entry point TypeScript file
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { program } from './utils/cli.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const LOG_FILE = process.env.LOG_FILE;
const LOG_LEVEL = process.env.LOG_LEVEL;

if (!GITHUB_TOKEN || GITHUB_TOKEN == '') {
    console.error('Error: GITHUB_TOKEN is not set in the environment.');
    process.exit(1);
}

if (!LOG_FILE || LOG_FILE == '') {
    console.error('Error: LOG_FILE is not set in the environment.');
    process.exit(1);
}

// console.log(`GITHUB_TOKEN Loaded: ${GITHUB_TOKEN}`);

// Call CLI program
program.parse(process.argv);