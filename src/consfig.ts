process.env.BRETRICS_PERCENTILES ||= "[0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99]";
process.env.BRETRICS_MAXAGESECONDS ||= "600";
process.env.BRETRICS_AGEBUCKETS ||= "5";
process.env.BRETRICS_PREFIX ||= "bretrics_";
process.env.BRETRICS_LABELS ||= "device_type,path";

process.env.PROM_ELPRECISION ||= "100";
process.env.PROM_PREFIX ||= "";

export const config = {
    percentiles: JSON.parse(process.env.BRETRICS_PERCENTILES),
    maxAgeSeconds: JSON.parse(process.env.BRETRICS_MAXAGESECONDS),
    ageBuckets: JSON.parse(process.env.BRETRICS_AGEBUCKETS),
    prefix: process.env.BRETRICS_PREFIX,
    labels: process.env.BRETRICS_LABELS.split(","),

    eventLoopMonitoringPrecision: JSON.parse(process.env.PROM_ELPRECISION),
    promPrefix: process.env.PROM_PREFIX
};
