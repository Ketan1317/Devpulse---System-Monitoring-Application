import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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