import { getBusFactor } from '../models/busFactor.js';
import { getRampUpTime } from '../models/rampUpTime.js';
import { getResponsiveness } from '../models/responsiveness.js';
import { getCorrectness } from '../models/correctness.js';

export const analyze = async (packageURL: string) => {
    console.log(`==================================================\nFetching security metrics for package:\n${packageURL}\n==================================================`);

    const busFactor = await getBusFactor(packageURL);
    const rampUpTime = await getRampUpTime(packageURL);
    const responsiveness = await getResponsiveness(packageURL);
    const correctness = await getCorrectness(packageURL);

    console.log(`Bus Factor: \t\t${busFactor}`);
    console.log(`Ramp-Up Time: \t\t${rampUpTime}`);
    console.log(`Responsiveness: \t${responsiveness}`);
    console.log(`Correctness: \t\t${correctness}`);
};