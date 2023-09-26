import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import roomHandler from "./room/index.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user is connected.");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("user is disconnected.");
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
