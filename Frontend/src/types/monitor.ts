export type MonitorType = "WEBSITE" | "API";

export interface CreateMonitorRequest {
  name: string;
  url: string;
  type: MonitorType;
  intervalSeconds: number;
}

export interface UpdateMonitorRequest {
  name: string;
  url: string;
  type: MonitorType;
  intervalSeconds: number;
  active: boolean;
}

export interface MonitorResponse {
  id: string;
  name: string;
  url: string;
  type: MonitorType;
  intervalSeconds: number;
  active: boolean;

  sslExpiryDate: string | null;
  sslDaysRemaining: number | null;
  sslIssuer: string | null;
}

export interface MonitorHistoryResponse {
  checkedAt: string;
  statusCode: number;
  latencyMs: number;
  healthy: boolean;
  errorMessage: string | null;
}

export interface IncidentResponse {
  id: string;
  monitorId: string;
  monitorName: string;
  status: "OPEN" | "RESOLVED";
  reason: string;
  startedAt: string;
  resolvedAt: string | null;
}

export interface AIInsightResponse {
  summary: string;
  possibleCause: string[];
  recommendation: string[];
}