// Main entry point TypeScript file
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { program } from './utils/cli.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('Error: GITHUB_TOKEN is not set in the environment.');
    process.exit(1);
}

// console.log(`GITHUB_TOKEN Loaded: ${GITHUB_TOKEN}`);

// Call CLI program
program.parse(process.argv);