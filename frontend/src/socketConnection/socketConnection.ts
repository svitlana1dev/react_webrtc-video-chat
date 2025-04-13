import io from "socket.io-client";
import {
  onlineUsersHandler,
  userDisconnectedHandler,
} from "../store/actions/usersActions";
import { call, disconnect } from "../realtimeCommunication/webRTCHandler";
import { chatMessageHandler } from "../store/actions/messengerActions";
import { videoRoomsListHandler } from "../store/actions/videoRoomActions";

let socket: any = null;

export const connectWithSocketIOServer = () => {
  socket = io("http://localhost:3001/");

  socket.on("connect", () => {
    console.log("connect to socket server");
  });

  socket.on("online-users", (userData: any) => {
    onlineUsersHandler(socket.id, userData);
  });

  socket.on("chat-message", (messageData: any) => {
    chatMessageHandler(messageData);
  });

  socket.on("video-rooms", (videoRooms: any) => {
    videoRoomsListHandler(videoRooms);
  });

  socket.on("video-room-init", (data: any) => {
    call(data);
  });

  socket.on("video-call-disconnect", () => {
    disconnect();
  });

  socket.on("user-disconnected", (disconnectedUserSocketId: string) => {
    userDisconnectedHandler(disconnectedUserSocketId);
  });
};

export const login = (data: any) => {
  socket.emit("user-login", data);
};

export const sendChatMessage = (data: any) => {
  socket.emit("chat-message", data);
};

export const createVideoRoom = (data: any) => {
  console.log("emitting");
  socket.emit("video-room-create", data);
};

export const joinVideoRoom = (data: any) => {
  console.log("emitting event to join a room");
  console.log(data);
  socket.emit("video-room-join", data);
};

export const leaveVideoRoom = (data: any) => {
  socket.emit("video-room-leave", data);
};
