import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT:
    // Do NOT set Content-Type here.
    // Axios/browser will automatically set
    // multipart/form-data with boundary for FormData.

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;