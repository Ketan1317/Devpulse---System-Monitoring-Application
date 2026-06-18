import api from "./axios";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  active: boolean;
  createdAt: string;
}

export const getProfile = () => {
  return api.get<UserProfile>("/me");
};