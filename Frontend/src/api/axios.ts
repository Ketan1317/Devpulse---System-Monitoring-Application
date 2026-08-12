import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials:true,
});

api.interceptors.request.use((config) => {
  const auth =localStorage.getItem("auth");

  if (auth) {
    const parsedAuth = JSON.parse(auth);
    config.headers.Authorization =`Bearer ${parsedAuth.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;