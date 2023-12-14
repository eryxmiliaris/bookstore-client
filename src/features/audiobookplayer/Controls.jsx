import { Slider } from "@mui/material";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import Forward30OutlinedIcon from "@mui/icons-material/Forward30Outlined";
import Replay30OutlinedIcon from "@mui/icons-material/Replay30Outlined";
import VolumeDownOutlinedIcon from "@mui/icons-material/VolumeDownOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import Select from "react-select";
import { useState } from "react";

const speedOptions = [
  { value: 0.5, label: "0.5x" },
  { value: 1.0, label: "1.0x" },
  { value: 1.5, label: "1.5x" },
  { value: 2.0, label: "2.0x" },
];

function Controls({ audioRef, position, setPosition, duration }) {
  const [paused, setPaused] = useState(true);

  const [selectedSpeed, setSelectedSpeed] = useState(speedOptions[1]);
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(75);

  const formatDuration = (value) => {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };

  const handlePlayButton = () => {
    setPaused(!paused);
    if (audioRef.current) {
      if (paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleTimeUpdate = (offset) => {
    if (audioRef.current) {
      const newPosition = audioRef.current.currentTime + offset;
      const newPositionClamped = Math.min(Math.max(newPosition, 0), duration);
      setPosition(newPositionClamped);
      audioRef.current.currentTime = newPositionClamped;
    }
  };

  const handleSpeedChange = (selectedOption) => {
    setSelectedSpeed(selectedOption);
    setSpeed(selectedOption.value);
    if (audioRef.current) {
      audioRef.current.playbackRate = selectedOption.value;
    }
  };

  const handleVolumeChange = (_, newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  return (
    <>
      <Slider
        size="small"
        value={Number(position) || 0}
        min={0}
        step={1}
        max={duration || 0}
        onChange={(_, value) => {
          setPosition(value);
          audioRef.current.currentTime = value;
        }}
      />
      <div className="flex w-full justify-between">
        <p>{formatDuration(position)}</p>
        <p>{formatDuration(duration)}</p>
      </div>

      <div className="flex flex-row items-center gap-4">
        <Replay30OutlinedIcon
          style={{ width: "45px", height: "45px" }}
          className="text-violet-600"
          onClick={() => handleTimeUpdate(-30)}
        />
        {paused ? (
          <PlayCircleOutlinedIcon
            style={{ width: "60px", height: "60px" }}
            className="text-violet-600"
            onClick={handlePlayButton}
          />
        ) : (
          <PauseCircleOutlinedIcon
            style={{ width: "60px", height: "60px" }}
            className="text-violet-600"
            onClick={handlePlayButton}
          />
        )}
        <Forward30OutlinedIcon
          style={{ width: "45px", height: "45px" }}
          className="text-violet-600"
          onClick={() => handleTimeUpdate(30)}
        />
      </div>

      <Select
        options={speedOptions}
        value={selectedSpeed}
        onChange={handleSpeedChange}
        isSearchable={false}
        className="my-4"
      />

      <div className="flex w-full items-center justify-between gap-4 sm:w-1/2">
        <VolumeDownOutlinedIcon className="text-gray-500" />
        <Slider
          aria-label="volume-slider"
          value={volume}
          onChange={handleVolumeChange}
        />
        <VolumeUpOutlinedIcon className="text-gray-500" />
      </div>
    </>
  );
}

export default Controls;
