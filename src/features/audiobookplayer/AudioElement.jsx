import { useEffect } from "react";

function AudioElement({ initialTime, audioRef, audioSrc }) {
  useEffect(() => {
    audioRef.current.currentTime = initialTime;
  }, [audioRef]);
  return <audio ref={audioRef} src={audioSrc} />;
}

export default AudioElement;
