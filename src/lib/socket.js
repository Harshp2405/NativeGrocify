import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:9000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  multiplex: true,
});

export const connectSocket = (roomId) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit("join-room", roomId);
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};