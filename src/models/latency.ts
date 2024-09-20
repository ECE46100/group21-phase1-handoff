
export async function getLatency(start: number, end: number) {
    const latency = end - start;
    return parseFloat(latency.toFixed(2));
}