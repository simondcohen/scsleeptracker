export type MetricType = 'number' | 'time' | 'score';

export interface MetricConfig {
  type: MetricType;
  higherIsBetter: boolean;
}

export interface Metric {
  id: string;
  name: string;
  config?: {
    type: 'time' | 'score' | 'number';
    higherIsBetter: boolean;
  };
}

export interface SleepDataEntry {
  [metricId: string]: string;
}

export interface SleepDataTarget {
  [targetId: string]: string;
}

export interface SleepData {
  target: SleepDataTarget;
  [date: string]: SleepDataEntry;
}