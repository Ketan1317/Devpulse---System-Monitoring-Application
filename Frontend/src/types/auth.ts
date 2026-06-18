export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthData {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthContextType {
  auth: AuthData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (authData: AuthData) => void;
  logout: () => void;
}