export interface IMetric {
    value: number;
    labels: Record<string, string | number>;
}
