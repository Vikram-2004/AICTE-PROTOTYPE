import { v4 as uuidv4 } from "uuid";
const rooms = {};
const roomHandler = (socket) => {
  const createRoom = ({ peerId }) => {
    const roomId = uuidv4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    joinRoom({ roomId, peerId });
  };
  const leaveRoom = ({ roomId, peerId }) => {
    rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);

    socket.to(roomId).emit("user-disconnected", peerId);
  };
  const joinRoom = ({ roomId, peerId }) => {
    if (rooms[roomId]) {
      console.log(`user joined the meeting ${roomId} ${peerId}`);
      rooms[roomId].push(peerId);
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { roomId, peerId });
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    } else {
      createRoom({ peerId });
    }

    socket.on("disconnect", () => {
      console.log("user disconnnected", peerId);
      leaveRoom({ roomId, peerId });
    });
  };
  socket.on("join-room", joinRoom);
  socket.on("create-room", createRoom);
  socket.on("leave-room", leaveRoom);
};

export default roomHandler;
