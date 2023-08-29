import axios from "axios";

export const protectedApi = axios.create({
  baseURL: "https://seroba-chat-api.onrender.com",
  withCredentials: true,
});

export const api = axios.create({
  baseURL: "https://seroba-chat-api.onrender.com",
});
