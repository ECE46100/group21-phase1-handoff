// import { getBusFactor } from '../models/busFactor.js';
// import { getRampUpTime } from '../models/rampUpTime.js';
// import { getResponsiveness } from '../models/responsiveness.js';
// import { getCorrectness } from '../models/correctness.js';

import { logMessage } from '../utils/logging.js';
import { URLHandler } from '../utils/urlHandler.js';
import * as dotenv from 'dotenv';

export const analyze = async (packageURL: string) => {
    // console.log(`==================================================`);
    // console.log(`Fetching security metrics for package:\n${packageURL}`);
    // console.log(`==================================================`);
    const handler = new URLHandler();
    const outMetrics = await handler.handle(packageURL)

//     console.log(`Bus Factor: \t\t${outMetrics.busFactor}`);
//     console.log(`Bus Factor Latency: \t\t${outMetrics.busFactorLatency} s`);
//     console.log(`Ramp-Up Time: \t\t${outMetrics.rampUpTime}`);
//     console.log(`Ramp-Up Time Latency: \t\t${outMetrics.rampUpTimeLatency} s`);
//     console.log(`Responsiveness: \t${outMetrics.responsiveness}`);
//     console.log(`Responsiveness Latency: \t${outMetrics.responsivenessLatency} s`);

    parseInt(process.env.LOG_LEVEL || '0', 10)
    // console.log(`Logging information into '${process.env.LOG_FILE}'...\n`);
    await logMessage(outMetrics, packageURL);

    // console.log(`Bus Factor: \t\t${outMetrics.busFactor}`);
    // console.log(`Bus Factor Latency: \t\t${outMetrics.busFactorLatency} s`);
    // console.log(`Ramp-Up Time: \t\t${outMetrics.rampUpTime}`);
    // console.log(`Ramp-Up Time Latency: \t\t${outMetrics.rampUpTimeLatency} s`);
    // console.log(`Responsiveness: \t${outMetrics.responsiveness}`);
    // console.log(`Responsiveness Latency: \t${outMetrics.responsivenessLatency} s`);
    // console.log(`Correctness: \t${outMetrics.correctness}`);
    // console.log(`Correctness Latency: \t${outMetrics.correctnessLatency} s`);
    // console.log(`License: \t${outMetrics.license}`);
    // console.log(`License Latency: \t${outMetrics.licenseLatency} s`);
    // console.log(`==================================================\n`);

    const output = {
        NetScore: parseFloat(outMetrics.netScore),
        NetScoreLatency: outMetrics.netScoreLatency,
        RampUp: parseFloat(outMetrics.rampUpTime),
        RampUpLatency: outMetrics.rampUpTimeLatency,
        Correctness: parseFloat(outMetrics.correctness),
        CorrectnessLatency: outMetrics.correctnessLatency,
        BusFactor: parseFloat(outMetrics.busFactor),
        BusFactorLatency: outMetrics.busFactorLatency,
        ResponsiveMaintainer: parseFloat(outMetrics.responsiveness),
        ResponsiveMaintainerLatency: outMetrics.responsivenessLatency,
        PullRequest: parseFloat(outMetrics.reviewedMerge),
        PullRequestLatency: outMetrics.reviewedMergeLatency,
        GoodPinningPractices: parseFloat(outMetrics.pinnedDependencies),
        GoodPinningPracticesLatency: outMetrics.pinnedDependenciesLatency,
        License: outMetrics.license,
        LicenseLatency: outMetrics.licenseLatency
    }

    // const ndjsonOutput = formattedOutput.map(metric => JSON.stringify(metric)).join(',');
    // console.log(output);
    const ndjsonOutput = JSON.stringify(output);
    
    // console.log(ndjsonOutput);
    return ndjsonOutput;
};