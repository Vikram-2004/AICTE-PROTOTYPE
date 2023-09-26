import { Socket, io } from "socket.io-client";

const WS = "http://localhost:3000";
export const ws: Socket = io(WS);
