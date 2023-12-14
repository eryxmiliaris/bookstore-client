import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FontDownloadOutlinedIcon from "@mui/icons-material/FontDownloadOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axios from "../../util/axios";

import ModalWindow from "../../components/ModalWindow";
import Form from "../../components/Form";

function UpperMenu({
  darkMode,
  setDarkMode,
  setLargeText,
  location,
  setLocation,
  setNoteLocation,
  lastLocation,
  setLastLocation,
  setNotesOpen,
}) {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get("preview") === "true";

  const handleGoBack = () => {
    setLocation(lastLocation);
    setNoteLocation(lastLocation);
    setLastLocation(null);
  };

  const [addNoteOpen, setAddNoteOpen] = useState(false);

  const { mutate: addNote, isLoading: isAddingNote } = useMutation({
    mutationFn: (data) => {
      const { name, text } = data;
      return axios.post(`/library/bookNotes?libraryItemId=${id}`, {
        name,
        text,
        position: location,
      });
    },
    onSuccess: () => {
      toast.success("Note has been added successfully");
      setAddNoteOpen(false);
      queryClient.invalidateQueries("bookNotes");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return (
    <div
      className={`flex justify-between text-white ${
        darkMode ? "bg-violet-950" : "bg-violet-500"
      }`}
    >
      <Link
        to="/home"
        className={`hidden px-5 py-3 text-2xl font-semibold sm:block`}
      >
        Bookstore
      </Link>
      <div
        className={`aboslute flex w-full justify-between px-5 py-3 sm:justify-end sm:gap-4`}
      >
        {lastLocation && (
          <div className="flex w-20 justify-between">
            <UndoOutlinedIcon
              fontSize="large"
              className="cursor-pointer"
              onClick={() => handleGoBack()}
            />
            <CloseOutlinedIcon
              fontSize="large"
              className="cursor-pointer"
              onClick={() => setLastLocation(null)}
            />
          </div>
        )}
        <BookmarkAddOutlinedIcon
          fontSize="large"
          className="cursor-pointer"
          onClick={
            preview
              ? () => toast.error("You need to buy a book to add notes")
              : () => setAddNoteOpen(true)
          }
        />
        <BookmarksOutlinedIcon
          fontSize="large"
          className="cursor-pointer"
          onClick={() => setNotesOpen(true)}
        />
        <DarkModeOutlinedIcon
          fontSize="large"
          onClick={() => setDarkMode((prevMode) => !prevMode)}
          className="cursor-pointer"
        />
        <FontDownloadOutlinedIcon
          fontSize="large"
          onClick={() => setLargeText((prevLargeText) => !prevLargeText)}
          className="cursor-pointer"
        />
        <Link to="/profile/library">
          <ExitToAppOutlinedIcon fontSize="large" className="cursor-pointer" />
        </Link>
      </div>

      <ModalWindow open={addNoteOpen} onClose={() => setAddNoteOpen(false)}>
        <Form
          submitButtonText="Add new note"
          isLoading={isAddingNote}
          onSubmit={addNote}
        >
          <Form.Input labelText="Name" fieldName="name" />
          <Form.TextAreaInput labelText="Text" fieldName="text" cols={30} />
        </Form>
      </ModalWindow>
    </div>
  );
}

export default UpperMenu;
