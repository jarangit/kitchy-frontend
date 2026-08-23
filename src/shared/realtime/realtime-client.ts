import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;
let isConnected = false;

const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};

const getRealtimeUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
  return apiUrl.replace(/\/api\/v\d+\/?$/, "");
};

const getAuthToken = () => {
  return localStorage.getItem("token") ?? localStorage.getItem("device_token");
};

export const getRealtimeClient = () => {
  if (socket) return socket;

  socket = io(getRealtimeUrl(), {
    transports: ["websocket"],
    autoConnect: false,
    auth: {
      token: getAuthToken(),
    },
  });

  socket.on("connect_error", (error) => {
    console.warn("Realtime connection failed", error.message);
  });

  socket.on("connect", () => {
    isConnected = true;
    notify();
  });

  socket.on("disconnect", () => {
    isConnected = false;
    notify();
  });

  return socket;
};

export const refreshRealtimeAuth = () => {
  const client = getRealtimeClient();
  client.auth = {
    token: getAuthToken(),
  };
  return client;
};

export const subscribeRealtimeConnection = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getRealtimeConnectionState = () => isConnected;
