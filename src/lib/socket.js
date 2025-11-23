// src/lib/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "http://3.36.51.2:3000";

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

export function getChatSocket({id}) {

    const socket = getSocket();

    console.log("[socket] join room:", id);

    socket.emit("join room", {"roomId": id});
    
    socket.on("chat message", (data) => {
        console.log("Received chat message:", data);
    });

    socket.emit("chat message", (data) => {
        console.log("Send chat message:", data);
    });

    return socket;
}

export function sendMessage(message) {

    const socket = getSocket();

    console.log("[socket] emit chat message:", message);
      
    socket.emit("chat message", message);

}

export function disconnectSocket() {

    if (socket) {
        socket.disconnect();
        socket = null;
    }
}