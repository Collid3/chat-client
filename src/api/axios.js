import "react";
import axios from "axios";

console.log(import.meta.env.VITE_ENV);

export const api = axios.create({
  baseURL: `${
    import.meta.env.VITE_ENV === "development"
      ? "http://localhost:5000/api"
      : "https://chat-server-e9hl.onrender.com/api"
  }`,
  withCredentials: true,
});
