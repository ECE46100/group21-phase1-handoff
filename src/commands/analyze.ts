// import { getBusFactor } from '../models/busFactor.js';
// import { getRampUpTime } from '../models/rampUpTime.js';
// import { getResponsiveness } from '../models/responsiveness.js';
// import { getCorrectness } from '../models/correctness.js';
import { URLHandler } from '../utils/urlHandler.js';

export const analyze = async (packageURL: string) => {
    console.log(`==================================================`);
    console.log(`Fetching security metrics for package:\n${packageURL}`);
    console.log(`==================================================`);
    const handler = new URLHandler();
    const outMetrics = await handler.handle(packageURL)

    console.log(`Bus Factor: \t\t${outMetrics.busFactor}`);
    console.log(`Ramp-Up Time: \t\t${outMetrics.rampUpTime}`);
    console.log(`Responsiveness: \t${outMetrics.responsiveness}`);
    console.log(`==================================================\n`);
};