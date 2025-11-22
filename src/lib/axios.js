// src/api/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://3.36.131.35:8080/",
  timeout: 5000,
});

// 공통 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 토큰 있으면 자동 삽입
    // const token = localStorage.getItem("accessToken");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6IlVTRVIiLCJ0eXAiOiJhY2Nlc3MiLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzYzNzAxODQ2LCJleHAiOjE3OTUyMzc4NDYsImF1ZCI6IndlYiIsImlzcyI6Im15LWJhY2tlbmQtYXBpIn0.AzIeDBqcvfDapbj79tEa0q8Ta3RQQDVy-Urtn2qUqbo"
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
