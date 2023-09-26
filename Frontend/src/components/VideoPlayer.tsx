import { FC, useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream;
  className?: string;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ stream, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  });
  return (
    <div className={className}>
      <video ref={videoRef} autoPlay muted={true} playsInline />
    </div>
  );
};

export default VideoPlayer;
