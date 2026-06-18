import api from "@/api/axios";
import type { IncidentResponse } from "@/types/monitor";

export const getIncidents = () =>
  api.get<IncidentResponse[]>("/incidents");