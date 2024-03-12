import axios from "axios";

export const protectedApi = axios.create({
  baseURL: "https://seroba-chat-api.onrender.com",
  // baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const api = axios.create({
  baseURL: "https://seroba-chat-api.onrender.com",
  // baseURL: "http://localhost:4000",
});
