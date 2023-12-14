import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axios from "../util/axios";
import { API_BASE_URL } from "../constants/appConstants";

import Spinner from "../components/Spinner";
import AudioElement from "../features/audiobookplayer/AudioElement";
import Controls from "../features/audiobookplayer/Controls";
import Notes from "../features/audiobookplayer/Notes";

const AudiobookPlayer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const preview = searchParams.get("preview") === "true";

  const audioRef = useRef(null);

  const [audioSrc, setAudioSrc] = useState(null);

  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [updateLastPosition, setUpdateLastPosition] = useState(false);

  //init audio
  const [audioIsLoading, setAudioIsLoading] = useState(true);
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await axios.get(
          preview ? `/books/${id}/preview.mp3` : `/library/${id}/book.mp3`,
          {
            responseType: "blob",
          },
        );

        const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioSrc(audioUrl);
      } catch (error) {
        console.error("Error fetching audio:", error);
      } finally {
        setAudioIsLoading(false);
      }
    };
    fetchAudio();
  }, [id, preview, setAudioSrc]);

  const { data: bookData, isLoading: bookIsLoading } = useQuery({
    queryKey: ["bookData"],
    queryFn: async function () {
      const response = await axios.get(
        preview ? `/books/${id}` : `/library/${id}`,
      );
      if (!preview) {
        setPosition(response.data.lastPosition);
      }
      return response.data;
    },
  });

  //synchronize slider
  useEffect(() => {
    const updatePosition = () => {
      if (audioRef.current) {
        setPosition(audioRef.current.currentTime);
      }
    };

    const updateDuration = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const updateSlider = () => {
      audioRef.current.addEventListener("timeupdate", updatePosition);
      audioRef.current.addEventListener("loadedmetadata", updateDuration);

      return () => {
        audioRef.current.removeEventListener("timeupdate", updatePosition);
        audioRef.current.removeEventListener("loadedmetadata", updateDuration);
      };
    };

    if (!bookIsLoading && !audioIsLoading) {
      updateSlider();
    }
  }, [bookIsLoading, audioIsLoading]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUpdateLastPosition(true);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (!preview && updateLastPosition) {
      axios.put(`/library/${id}`, {
        newPosition: position,
      });
      setUpdateLastPosition(false);
    }
  }, [id, position, preview, updateLastPosition]);

  if (bookIsLoading || audioIsLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto mb-10 flex flex-col items-center justify-between px-4 py-4">
      <AudioElement
        audioRef={audioRef}
        initialTime={position}
        audioSrc={audioSrc}
      />

      <h1 className="my-4 text-center text-3xl font-semibold">
        {bookData.title}
      </h1>

      <img
        className="mb-6 max-w-[200px] rounded-2xl border border-violet-900 shadow-md sm:max-w-[300px]"
        src={`${API_BASE_URL}/books/${
          bookData.bookId || bookData.id
        }/coverImage?bookType=Audiobook`}
      ></img>

      <Controls
        audioRef={audioRef}
        position={position}
        setPosition={setPosition}
        duration={duration}
      />

      {!preview && <Notes audioRef={audioRef} />}
    </div>
  );
};

export default AudiobookPlayer;
