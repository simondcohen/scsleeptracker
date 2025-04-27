export type MetricType = 'number' | 'time' | 'score';

export interface MetricConfig {
  type: MetricType;
  higherIsBetter: boolean;
}

export interface Metric {
  id: string;
  name: string;
  config: MetricConfig;
}