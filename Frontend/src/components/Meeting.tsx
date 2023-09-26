import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import VideoPlayer from "./VideoPlayer";

interface MeetingProps {}

const Meeting: FC<MeetingProps> = ({}) => {
  const { roomId } = useParams();
  const { ws, me, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    me?.on("open", () => {
      ws.emit("join-room", { roomId, peerId: me._id });
    });
  }, [roomId, ws, me]);

  return (
    <div>
      <>Room id {roomId}</>
      <div className="grid grid-cols-4 gap-4">
        <VideoPlayer className="me" key={"me"} stream={stream} />

        {Object.values(peers).map((peer: any) => (
          <VideoPlayer key={peer.id} stream={peer.stream} />
        ))}
      </div>
    </div>
  );
};

export default Meeting;
