import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { PeerServer } from "peer";

const app = express();
const port = 3001;
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers: { [key: string]: any } = {};
let videoRooms: { [key: string]: any } = {};

const chatMessageHandler = (socket: Socket, data: any) => {
  const { receiverSocketId, content, id } = data;

  if (onlineUsers[receiverSocketId]) {
    console.log("message received");
    console.log("sending message to other user");

    io.to(receiverSocketId).emit("chat-message", {
      senderSocketId: socket.id,
      content,
      id,
    });
  }
};

const videoRoomCreateHandler = (socket: Socket, data: any) => {
  const { peerId, newRoomId } = data;

  // adding new room
  videoRooms[newRoomId] = {
    participants: [
      {
        socketId: socket.id,
        username: onlineUsers[socket.id].username,
        peerId,
      },
    ],
  };

  broadcastVideoRooms();

  console.log("new room", data);
};

const videoRoomJoinHandler = (socket: Socket, data: any) => {
  const { roomId, peerId } = data;

  if (videoRooms[roomId]) {
    videoRooms[roomId].participants.forEach((participant: any) => {
      socket.to(participant.socketId).emit("video-room-init", {
        newParticipantPeerId: peerId,
      });
    });

    videoRooms[roomId].participants = [
      ...videoRooms[roomId].participants,
      {
        socketId: socket.id,
        username: onlineUsers[socket.id].username,
        peerId,
      },
    ];

    broadcastVideoRooms();
  }
};

const videoRoomLeaveHandler = (socket: Socket, data: any) => {
  const { roomId } = data;

  if (videoRooms[roomId]) {
    videoRooms[roomId].participants = videoRooms[roomId].participants.filter(
      ({ socketId }: { socketId: string }) => socketId !== socket.id
    );
  }

  if (videoRooms[roomId].participants.length > 0) {
    socket
      .to(videoRooms[roomId].participants[0].socketId)
      .emit("video-call-disconnect");
  }

  if (videoRooms[roomId].participants.length < 1) {
    delete videoRooms[roomId];
  }

  broadcastVideoRooms();
};

io.on("connection", (socket: Socket) => {
  console.log("a user connected", socket.id);
  socket.on("user-login", (data) => loginEventHandle(socket, data));

  socket.on("chat-message", (data) => chatMessageHandler(socket, data));

  socket.on("video-room-create", (data) =>
    videoRoomCreateHandler(socket, data)
  );

  socket.on("video-room-join", (data) => {
    videoRoomJoinHandler(socket, data);
  });

  socket.on("video-room-leave", (data) => {
    videoRoomLeaveHandler(socket, data);
  });

  socket.on("disconnect", (id) => {
    disconnectEventHandler(id, socket);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const peerServer = PeerServer({ port: 9000, path: "/peer" });

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const removeOnlineUser = (id: string) => {
  if (onlineUsers[id]) {
    delete onlineUsers[id];
  }
  console.log(onlineUsers);
};

const broadcastDisconnectedDetails = (socketId: string) => {
  io.to("logged-users").emit("user-disconnected", socketId);
};

const removeUserFromTheVideoRoom = (socketId: string, roomId: string) => {
  videoRooms[roomId].participants = videoRooms[roomId].participants.filter(
    ({ socketId }: { socketId: string }) => socketId !== socketId
  );

  // remove room if no participants left in the room
  if (videoRooms[roomId].participants.length < 1) {
    delete videoRooms[roomId];
  } else {
    // if still there is a user in the room - inform him to clear his peer connection

    io.to(videoRooms[roomId].participants[0].socketId).emit(
      "video-call-disconnect"
    );
  }

  broadcastVideoRooms();
};

const checkIfUserIsInCall = (socket: Socket) => {
  Object.entries(videoRooms).forEach(([key, value]) => {
    const participant = value.participants.find(
      ({ socketId }: { socketId: string }) => socketId === socket.id
    );

    if (participant) {
      removeUserFromTheVideoRoom(socket.id, key);
    }
  });
};

const disconnectEventHandler = (id: string, socket: Socket) => {
  console.log(`user disconnected of the id: ${id}`);
  checkIfUserIsInCall(socket);
  removeOnlineUser(id);
  broadcastDisconnectedDetails(id);
};

const broadcastVideoRooms = () => {
  io.to("logged-users").emit("video-rooms", videoRooms);
};

const loginEventHandle = (
  socket: Socket,
  data: { userName: string; coords: { lat: number; lng: number } }
) => {
  socket.join("logged-users");

  onlineUsers[socket.id] = {
    userName: data.userName,
    coords: data.coords,
  };

  io.to("logged-users").emit("online-users", convertOnlineUsersToArray());
  broadcastVideoRooms();
};

const broadcastDisconnectedUserDetails = (disconnectedUserSocketId: string) => {
  io.to("logged-users").emit("user-disconnected", disconnectedUserSocketId);
};

const convertOnlineUsersToArray = () => {
  const onlineUsersArray: { socketId: string; userName: any; coords: any }[] =
    [];

  Object.entries(onlineUsers).forEach(([key, value]) => {
    onlineUsersArray.push({
      socketId: key,
      userName: value.userName,
      coords: value.coords,
    });
  });

  return onlineUsersArray;
};
