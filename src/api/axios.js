import "react";
import axios from "axios";

const api = axios.create({
  baseURL: `${
    import.meta.env.VITE_ENV === "development"
      ? "http://localhost:5000/api"
      : "https://chat-server-e9hl.onrender.com/api"
  }`,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("bright-chat-token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
