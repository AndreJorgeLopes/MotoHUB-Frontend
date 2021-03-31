import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "http://fudeu.duckdns.org:8000/api/JAzC@dqWgX5GY4ex",
});

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;