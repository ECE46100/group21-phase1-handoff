// import { getBusFactor } from '../models/busFactor.js';
// import { getRampUpTime } from '../models/rampUpTime.js';
// import { getResponsiveness } from '../models/responsiveness.js';
// import { getCorrectness } from '../models/correctness.js';

import { logMessage } from '../utils/logging.js';
import { URLHandler } from '../utils/urlHandler.js';
import * as dotenv from 'dotenv';

export const analyze = async (packageURL: string) => {
    console.log(`==================================================`);
    console.log(`Fetching security metrics for package:\n${packageURL}`);
    console.log(`==================================================`);
    const handler = new URLHandler();
    const outMetrics = await handler.handle(packageURL)

    console.log(`Bus Factor: \t\t${outMetrics.busFactor}`);
    console.log(`Bus Factor Latency: \t\t${outMetrics.busFactorLatency} s`);
    console.log(`Ramp-Up Time: \t\t${outMetrics.rampUpTime}`);
    console.log(`Ramp-Up Time Latency: \t\t${outMetrics.rampUpTimeLatency} s`);
    console.log(`Responsiveness: \t${outMetrics.responsiveness}`);
    console.log(`Responsiveness Latency: \t${outMetrics.responsivenessLatency} s`);
    console.log(`==================================================\n`);

    parseInt(process.env.LOG_LEVEL || '0', 10) && console.log(`Logging information into '${process.env.LOG_FILE}'...\n`);
    await logMessage(outMetrics, packageURL);


};