import { collectDefaultMetrics, Registry, Summary } from "prom-client";
import { config } from "../config";
import { IMetric } from "../models/IMetric.interface";

export class PrometheusService {
    public readonly register: Registry;

    public readonly metrics: Map<string, Summary> = new Map();

    public readonly timers: Map<string, NodeJS.Timeout> = new Map();

    public constructor() {
        this.register = new Registry();
        collectDefaultMetrics({
            register: this.register,
            prefix: config.promPrefix,
            eventLoopMonitoringPrecision: config.eventLoopMonitoringPrecision
        });
    }

    public setMetrics(metrics: Record<string, number | IMetric>): void {
        const metricNames = Reflect.ownKeys(metrics) as string[];
        for (const metricName of metricNames) {
            // create metric
            if (!this.metrics.has(metricName)) {
                const summary = new Summary({
                    name: config.prefix + metricName,
                    help: config.prefix + metricName,
                    registers: [this.register],
                    percentiles: config.percentiles,
                    maxAgeSeconds: config.maxAgeSeconds,
                    ageBuckets: config.ageBuckets,
                    labelNames: config.labels
                });

                this.metrics.set(metricName, summary);
            }

            // set metrics
            const summary = this.metrics.get(metricName) as Summary;
            const metricValue = Reflect.get(metrics, metricName);

            if (typeof metricValue === "number") {
                summary.observe(metricValue);
            } else if ("value" in metricValue) {
                summary.observe(metricValue.labels, metricValue.value);
            }

            // set cleaner timer
            const timer = this.timers.get(metricName);
            if (timer) {
                clearTimeout(timer);
            }

            const timerNum = setTimeout(() => {
                this.register.removeSingleMetric(config.prefix + metricName);
                this.metrics.delete(metricName);
            }, config.maxAgeSeconds * 1000);
            this.timers.set(metricName, timerNum);
        }
    }
}
