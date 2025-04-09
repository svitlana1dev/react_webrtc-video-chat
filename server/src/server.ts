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

io.on("connection", (socket: Socket) => {
  console.log("a user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
