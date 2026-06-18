import api from "./axios"

import type { LoginRequest, RegisterRequest, LoginResponse } from "@/types/auth"

export const loginUser = (data: LoginRequest) => {
  return api.post<LoginResponse>("/auth/login", data)
}

export const registerUser = (data: RegisterRequest) => {
  return api.post("/auth/register", data)
}
