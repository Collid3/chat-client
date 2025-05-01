import "react";
import axios from "axios";

export const api = axios.create({
  baseURL: `${
    import.meta.env.VITE_ENV === "development"
      ? "http://localhost:5000/api"
      : "https://chat-server-e9hl.onrender.com/api"
  }`,
  withCredentials: true,
});
