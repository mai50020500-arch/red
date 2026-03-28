export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  timestamp: number; // UTC normalized
  metadata?: Record<string, any>;
}

export interface AlertState {
  alerts: Alert[];
  lastUpdated: number;
}
