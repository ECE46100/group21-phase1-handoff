import { getBusFactor } from '../models/busFactor.js';

export const analyze = async (packageURL: string) => {
    console.log(`Fetching security metrics for package: ${packageURL}`);
    const busFactor = await getBusFactor(packageURL);
    console.log(`Bus factor for package: ${busFactor}`);
};