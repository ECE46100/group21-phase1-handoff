// import { getBusFactor } from '../models/busFactor.js';
// import { getRampUpTime } from '../models/rampUpTime.js';
// import { getResponsiveness } from '../models/responsiveness.js';
// import { getCorrectness } from '../models/correctness.js';

import { URLHandler } from '../utils/urlHandler.js';

export const analyze = async (packageURL: string) => {
    // console.log(`==================================================`);
    // console.log(`Fetching security metrics for package:\n${packageURL}`);
    // console.log(`==================================================`);
    const handler = new URLHandler();
    const outMetrics = await handler.handle(packageURL)

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

    const formattedOutput = [
        { metric: "URL", value: packageURL },
        { metric: "NetScore", value: outMetrics.netScore },
        { metric: "NetScore_Latency", value: outMetrics.netScoreLatency },
        { metric: "RampUp", value: outMetrics.rampUpTime },
        { metric: "RampUp_Latency", value: outMetrics.rampUpTimeLatency },
        { metric: "Correctness", value: outMetrics.correctness },
        { metric: "Correctness_Latency", value: outMetrics.correctnessLatency },
        { metric: "BusFactor", value: outMetrics.busFactor },
        { metric: "BusFactor_Latency", value: outMetrics.busFactorLatency },
        { metric: "ResponsiveMaintainer", value: outMetrics.responsiveness },
        { metric: "ResponsiveMaintainer_Latency", value: outMetrics.responsivenessLatency },
        { metric: "License", value: outMetrics.license },
        { metric: "License_Latency", value: outMetrics.licenseLatency }
    ];

    const ndjsonOutput = formattedOutput.map(metric => JSON.stringify(metric)).join('\n');
    console.log(ndjsonOutput);
    // return ndjsonOutput;
};