import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {

    const accessToken =
      localStorage.getItem(
        "access_token"
      );

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);
