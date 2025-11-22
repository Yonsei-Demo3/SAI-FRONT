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
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OGIyZmUyMS1lZDlhLTRhMDctODY4Zi1iOWM2NDEzM2ZhOTAiLCJyb2xlIjoiVVNFUiIsInR5cCI6ImFjY2VzcyIsInRva2VuX3R5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NjM4MTAyOTcsImV4cCI6MTc5NTM0NjI5NywiYXVkIjoid2ViIiwiaXNzIjoibXktYmFja2VuZC1hcGkifQ.IqcRquANqPend0843pWGqyIglxdEE6JJA5N-wLgimbc"
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
