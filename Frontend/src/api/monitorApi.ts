import api from "@/api/axios"

import type {
  CreateMonitorRequest,
  UpdateMonitorRequest,
  MonitorResponse,
  MonitorHistoryResponse,
} from "@/types/monitor"

export const createMonitor = (data: CreateMonitorRequest) =>
  api.post<MonitorResponse>("/monitors", data)

export const getMonitors = () => api.get<MonitorResponse[]>("/monitors")

export const getMonitorById = (id: string) =>
  api.get<MonitorResponse>(`/monitors/${id}`)

export const updateMonitor = (id: string, data: UpdateMonitorRequest) =>
  api.put<MonitorResponse>(`/monitors/${id}`, data)

export const deleteMonitor = (id: string) => api.delete(`/monitors/${id}`)

export const getMonitorHistory = (monitorId: string) =>
  api.get<MonitorHistoryResponse[]>(`/monitors/${monitorId}/history`)
