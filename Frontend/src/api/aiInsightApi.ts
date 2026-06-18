import api from "@/api/axios"
import type { AIInsightResponse } from "@/types/monitor"

export const generateInsight = (monitorId: string) =>
  api.post<AIInsightResponse>(`/ai/monitors/${monitorId}`)
