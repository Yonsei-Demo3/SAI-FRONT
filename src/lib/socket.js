import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export function initSocket() {
    
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.warn("[socket] no token, skip init");
        return null;
    }

    if (socket) return socket;

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

export function subscribeToAlarm(handler) {
  
    const socket = getSocket();

    if (!socket) {
        console.warn("[socket] socket is null");
        return () => {};
    }

    const listener = (payload) => {
        console.log("[socket] new notification:", payload);
        if (typeof handler === "function") {
        handler(payload);
        }
    };

    socket.on("new notification", listener);

    return () => {
        socket.off("new notification", listener);
    };
}

export function sendMessageSocket({ roomId, content, type = "TEXT" }) {

    const socket = getSocket();

      const payload = {
        roomId,
        content,
        type,
    };

    console.log("[socket] send message:", payload);
      
    socket.emit("chat message", payload);

}

export function receiveMessageSocket(handler) {

    const socket = getSocket();
    
    const listener = (payload) => {
        console.log("[socket] chat message:", payload);
        if (typeof handler === "function") {
            handler(payload);
        }
    };

    socket.on("chat message", listener);

      return () => {
    socket.off("chat message", listener);
  };
}

export function joinRoomSocket({roomId}) {

    const socket = getSocket();

    socket.emit("join room", {"roomId": roomId});

}