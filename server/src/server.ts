import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";

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

io.on("connection", (socket: Socket) => {
  console.log("a user connected", socket.id);
  socket.on("user-login", (data) => loginEventHandle(socket, data));

  socket.on("disconnect", (id) => {
    console.log("user disconnected", id);
    removeOnlineUser(id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const removeOnlineUser = (id: string) => {
  if (onlineUsers[id]) {
    delete onlineUsers[id];
  }
  console.log(onlineUsers);
};

const loginEventHandle = (
  socket: Socket,
  data: { userName: string; coords: { lat: number; lng: number } }
) => {
  onlineUsers[socket.id] = {
    userName: data.userName,
    coords: data.coords,
  };
};
