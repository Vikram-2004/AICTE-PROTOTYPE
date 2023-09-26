import { FC, useContext } from "react";
import { RoomContext } from "../context/RoomContext";

interface ButtonProps {}

const Button: FC<ButtonProps> = () => {
  const { ws, me } = useContext(RoomContext);
  const createRoom = () => {
    ws.emit("create-room", { peerId: me._id });
  };
  return (
    <button
      className="px-10 py-4 bg-rose-400 hover:bg-rose-600 rounded-lg text-white text-2xl"
      onClick={createRoom}
    >
      create room
    </button>
  );
};

export default Button;
