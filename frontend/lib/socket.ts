import { io, Socket } from "socket.io-client";
import { getCookie } from "cookies-next";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const token = getCookie("token");

    socket = io("http://localhost:5000", {
      autoConnect: false,
      auth: { token },
    });
  }

  return socket;
};