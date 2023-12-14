import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ReactReader, ReactReaderStyle } from "react-reader";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { Drawer } from "@mui/material";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "../util/axios";
import { API_BASE_URL } from "../constants/appConstants";

import Spinner from "../components/Spinner";
import BookNote from "../features/ebookreader/BookNote";
import UpperMenu from "../features/ebookreader/UpperMenu";

function EbookReader() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const preview = searchParams.get("preview") === "true";

  const { data: bookData, isLoading: isLoadingBook } = useQuery({
    queryKey: ["bookData"],
    queryFn: async function () {
      const response = await axios.get(
        preview ? `/books/${id}` : `/library/${id}`,
      );
      if (!preview) {
        const { lastPosition } = response.data;
        setLocation(lastPosition);
      }
      return response.data;
    },
  });

  useEffect(
    function () {
      setLocation(bookData?.lastPosition || 0);
    },
    [bookData?.lastPosition],
  );

  const { data: notesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["bookNotes"],
    queryFn: async function () {
      const response = await axios.get(
        `/library/bookNotes?libraryItemId=${id}`,
      );
      return response.data;
    },
  });

  const rendition = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState(0);
  const [noteLocation, setNoteLocation] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);

  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const storedLargeText = localStorage.getItem("largeText") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);
  const [largeText, setLargeText] = useState(storedLargeText);

  const [notesOpen, setNotesOpen] = useState(false);

  const handleGoTo = (position) => {
    setLastLocation(location);
    setLocation(position);
    setNoteLocation(position);
    setNotesOpen(false);
    setMenuOpen(true);
  };

  const updateTheme = useCallback(
    function (rendition) {
      const themes = rendition.themes;
      themes.fontSize(largeText ? "140%" : "100%");
      if (darkMode) {
        themes.override("color", "#fff");
        themes.override("background", "#000");
      } else {
        themes.override("color", "#000");
        themes.override("background", "#fff");
      }
    },
    [darkMode, largeText],
  );

  const { mutate: deleteNote, isLoading: isDeletingNote } = useMutation({
    mutationFn: (id) => {
      return axios.delete(`/library/bookNotes/${id}`);
    },
    onSuccess: () => {
      toast.success("Note has been deleted successfully");
      queryClient.invalidateQueries("bookNotes");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  useEffect(() => {
    if (!isLoadingBook && rendition.current) {
      updateTheme(rendition.current);
      localStorage.setItem("darkMode", darkMode.toString());
      localStorage.setItem("largeText", largeText.toString());
      if (!preview) {
        axios.put(`/library/${id}`, {
          newPosition: location,
        });
      }
    }
  }, [id, location, darkMode, largeText, isLoadingBook, updateTheme, preview]);

  if (isLoadingBook) {
    return <Spinner />;
  }

  console.log(location);

  return (
    <div
      className={`relative h-full min-h-screen w-full overflow-hidden ${
        darkMode ? "bg-black" : "bg-white"
      }`}
    >
      {menuOpen && (
        <UpperMenu
          location={location}
          isLoadingBook={isLoadingBook}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          largeText={largeText}
          setLargeText={setLargeText}
          rendition={rendition}
          setLocation={setLocation}
          setNoteLocation={setNoteLocation}
          lastLocation={lastLocation}
          setLastLocation={setLastLocation}
          setNotesOpen={setNotesOpen}
          updateTheme={updateTheme}
        />
      )}

      {menuOpen ? (
        <KeyboardArrowUpOutlinedIcon
          fontSize="large"
          className={`absolute right-5 top-[70px] z-10
          text-gray-300`}
          onClick={() => setMenuOpen(false)}
        />
      ) : (
        <KeyboardArrowDownOutlinedIcon
          fontSize="large"
          className={`absolute right-5 top-3 z-10
          text-gray-300`}
          onClick={() => setMenuOpen(true)}
        />
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 ${
          menuOpen ? "top-[59px]" : "top-0"
        }`}
      >
        <ReactReader
          key={noteLocation}
          url={
            preview
              ? `${API_BASE_URL}/books/${id}/preview.epub`
              : `${API_BASE_URL}/library/${id}/book.epub`
          }
          epubInitOptions={{ requestCredentials: true }}
          title={bookData.title}
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
          getRendition={(r) => {
            rendition.current = r;
            updateTheme(r);
          }}
          readerStyles={darkMode ? darkReaderTheme : lightReaderTheme}
        />
      </div>

      <Drawer
        anchor="right"
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
      >
        <div
          className={`h-screen ${darkMode ? "bg-violet-950" : "bg-violet-500"}`}
        >
          <div
            className={`h-max min-w-[250px] max-w-[250px] space-y-4 p-10 sm:max-w-md ${
              darkMode ? "bg-violet-950" : "bg-violet-500"
            }`}
          >
            {isLoadingNotes ? (
              <Spinner />
            ) : notesData?.length > 0 ? (
              notesData.map((note) => (
                <BookNote
                  key={note.id}
                  note={note}
                  isLoading={isDeletingNote}
                  handleDelete={deleteNote}
                  handleGoTo={handleGoTo}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <p className="text-white">You don&apos;t have any notes yet</p>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

const lightReaderTheme = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
};

const darkReaderTheme = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "white",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#ccc",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#000",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#ccc",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#111",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#222",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#fff",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "white",
  },
};

export default EbookReader;
