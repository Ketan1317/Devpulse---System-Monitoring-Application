import api from "@/api/axios";

export interface MonitorSummary {
  id: string;
  name: string;
  url: string;
  status: "UP" | "DOWN";
  uptime: number;
  avgLatency: number;
  lastCheckedAt: string;
  incidentsCount: number;
}

export interface DashboardResponse {
  totalMonitors: number;
  healthyMonitors: number;
  downMonitors: number;
  activeIncidents: number;
  overallUptime: number;
  averageLatency: number;
  monitors: MonitorSummary[];
}

export const getDashboard = () =>
  api.get<DashboardResponse>("/dashboard");