// Main entry point TypeScript file
import dotenv from 'dotenv';
import path from 'path';
import { program } from './utils/cli';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

if (!GITHUB_API_TOKEN) {
    console.error('Error: GITHUB_API_TOKEN is not set in the environment.');
    process.exit(1);
}

console.log(`GITHUB_API_TOKEN Loaded: ${GITHUB_API_TOKEN}`);

// Call CLI program
program.parse(process.argv);