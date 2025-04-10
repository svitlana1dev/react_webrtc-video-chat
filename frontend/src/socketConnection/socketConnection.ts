import io from "socket.io-client";

let socket = null;

export const connectWithSocketIOServer = () => {
  socket = io("http://localhost:3001/");

  socket.on("connect", () => {
    console.log("connect to socket server");
  });
};
