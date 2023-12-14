import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Divider } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "../../util/axios";

import BookNote from "./BookNote";
import Form from "../../components/Form";
import ModalWindow from "../../components/ModalWindow";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

function Notes({ audioRef }) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: notesData, isLoading: isLoadingNotes } = useQuery({
    queryKey: ["bookNotes"],
    queryFn: async function () {
      const response = await axios.get(
        `/library/bookNotes?libraryItemId=${id}`,
      );
      return response.data;
    },
  });
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const { mutate: addNote, isLoading: isAddingNote } = useMutation({
    mutationFn: (data) => {
      const { name, text } = data;
      return axios.post(`/library/bookNotes?libraryItemId=${id}`, {
        name,
        text,
        position: audioRef.current.currentTime,
      });
    },
    onSuccess: () => {
      toast.success("Note has been added successfully");
      setAddNoteOpen(false);
      queryClient.invalidateQueries("bookNotes");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

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

  const handleGoTo = (position) => {
    audioRef.current.currentTime = position;
  };

  return (
    <>
      <div className="mt-4 flex max-h-[500px] w-full flex-col gap-2 overflow-y-auto px-2 sm:w-2/3">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-center text-2xl font-semibold">Notes</h1>

          <Button
            className="w-full sm:w-1/3"
            onClick={() => setAddNoteOpen(true)}
          >
            Add new note
          </Button>
        </div>

        {isLoadingNotes ? (
          <Spinner />
        ) : (
          notesData.map((note) => (
            <div key={note.id} className="mt-4">
              <Divider />
              <BookNote
                note={note}
                handleDelete={deleteNote}
                isLoading={isDeletingNote}
                handleGoTo={handleGoTo}
              />
            </div>
          ))
        )}
      </div>

      <ModalWindow open={addNoteOpen} onClose={() => setAddNoteOpen(false)}>
        <Form
          submitButtonText="Add new note"
          onSubmit={addNote}
          isLoading={isAddingNote}
        >
          <Form.Input labelText="Name" fieldName="name" />
          <Form.TextAreaInput labelText="Text" fieldName="text" cols={30} />
        </Form>
      </ModalWindow>
    </>
  );
}

export default Notes;
