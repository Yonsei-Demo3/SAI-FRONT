// src/lib/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://3.36.51.2:3000";

export function createSocket() {
    
    // const token = localStorage.getItem("accessToken");
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhYTY5ZjVhOC02Y2JlLTRiYTctYTg5NC1kOWEyNTYwMjIyNWMiLCJzdWIiOiI1OGIyZmUyMS1lZDlhLTRhMDctODY4Zi1iOWM2NDEzM2ZhOTAiLCJpYXQiOjE3NjM4MDE3OTksImV4cCI6MTc2MzgwMjY5OSwiaXNzIjoibXktYmFja2VuZC1hcGkiLCJhdWQiOiJ3ZWIiLCJ0eXAiOiJhY2Nlc3MiLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwicm9sZSI6IlVTRVIifQ.8v1nEJ05eDZiSnrLIPdIcNaPmk2LcD8epJQzkqZj6rU"

    const socket = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: {
            token : `Bearer ${token}`
        }
    });

  return socket;
}
