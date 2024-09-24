import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();
const logFile = process.env.LOG_FILE || 'logfile.log';
const logLevel = parseInt(process.env.LOG_LEVEL || '0', 10);

interface Metric {
    busFactor : string,
    busFactorLatency: number,
    rampUpTime: string,
    rampUpTimeLatency: number,
    responsiveness: string,
    responsivenessLatency: number,
}

export async function logMessage(metrics: Metric, packageURL: string) { // expected metrics: bus, busL, ramp, rampL, resp, respL, corr, corrL
    let message = '';

    const timestamp = new Date().toISOString(); // Get the current timestamp
    switch (logLevel) {
        case 2: // debug (include timestamp)
            message += 'Log Level 2\n';
            message += `[${timestamp}]\n\n`;
            message += `Bus Factor: ${metrics.busFactor} | Latency: ${metrics.busFactorLatency}\n`;
            message += `Ramp Up Time: ${metrics.rampUpTime} | Latency: ${metrics.rampUpTimeLatency}\n`;
            message += `Responsiveness: ${metrics.responsiveness} | Latency: ${metrics.responsivenessLatency}\n\n`;
            break;
        case 1: // informational
            message += 'Log Level 1\n\n'
            message += `Bus Factor: ${metrics.busFactor} | Latency: ${metrics.busFactorLatency}\n`;
            message += `Ramp Up Time: ${metrics.rampUpTime} | Latency: ${metrics.rampUpTimeLatency}\n`;
            message += `Responsiveness: ${metrics.responsiveness} | Latency: ${metrics.responsivenessLatency}\n\n`;
            break;
        case 0: // silent
        default:
            return;
    }
    
    message = `Starting analysis for package: ${packageURL}\n` + message;
    fs.appendFile(logFile, message, (err) => {
        if (err) {
            // console.error('Error writing to file:', err);
            // console.log(`==================================================\n`);
        } else {
            // console.log('Log entry successfully written to logfile.log.\n')
            // console.log(`==================================================\n`);
        }
    }); 
}
