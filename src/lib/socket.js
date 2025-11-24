// src/lib/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export function initSocket() {
    
    const token = localStorage.getItem("accessToken");

    if (socket) {
        socket.disconnect();
        socket = null;
    }

      socket = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: {
            token : `Bearer ${token}`
        }
    });

    socket.on("connect", () => {
        console.log("[socket] connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("[socket] disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
        console.error("[socket] connect_error:", err.message);
    });

    return socket;
    }

export function getSocket() {

    if (!socket) {
        socket = initSocket();
    }

    return socket;
}


export function sendMessageSocket(message) {

    const socket = getSocket();

    console.log("[socket] emit chat message:", message);
      
    socket.emit("chat message", message);

}

export function joinSocket({roomId}) {

    const socket = getSocket();

    socket.emit("join room", {"roomId": roomId});

}

export function disconnectSocket() {

    if (socket) {
        socket.disconnect();
        socket = null;
    }
}