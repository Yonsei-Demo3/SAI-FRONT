// src/api/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://3.36.131.35:8080/", 
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error);
    return Promise.reject(error);
  }
);

export default instance;
