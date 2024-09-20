
export async function getLatency(start: number, end: number) {
    const latency = (end - start) / 1000;
    return parseFloat(latency.toFixed(3));
}