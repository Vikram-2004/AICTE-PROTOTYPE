import React, { createContext, useEffect, useState, useReducer } from "react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { ws } from "../lib/ws";
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

export const RoomContext = createContext<null | any>(null);

interface RoomContextProps {
  children: React.ReactNode;
}

const RoomProvider: FC<RoomContextProps> = ({ children }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});

  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  };

  const handleUserList = ({ participants }: { participants: string[] }) => {
    participants.map((peerId) => {
      const call = stream && me?.call(peerId, stream);
      console.log("call", call);
      call?.on("stream", (userVideoStream: MediaStream) => {
        console.log({ addPeerAction });
        dispatch(addPeerAction(peerId, userVideoStream));
      });
    });
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", handleUserList);
    ws.on("user-disconnected", removePeer);
  }, []);

  useEffect(() => {
    if (!stream) return;
    if (!me) return;

    ws.on("user-joined", ({ peerId }: { roomId: string; peerId: string }) => {
      const call = stream && me.call(peerId, stream);
      call.on("stream", (userVideoStream: MediaStream) => {
        dispatch(addPeerAction(peerId, userVideoStream));
      });
    });

    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        dispatch(addPeerAction(call.peer, userVideoStream));
      });
    });
  }, [me, stream]);

  console.log({ peers });
  return (
    <RoomContext.Provider value={{ ws, me, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
