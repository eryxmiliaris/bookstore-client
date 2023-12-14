import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axios from "../util/axios";
import { API_BASE_URL, EBOOK } from "../constants/appConstants";

import ModalWindow from "../components/ModalWindow";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import LibraryItem from "../features/library/LibraryItem";

function LibraryPage() {
  const queryClient = useQueryClient();

  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections"],
    queryFn: async function () {
      const response = await axios.get(`/library/collections`);
      return response.data;
    },
  });

  const [openBook, setOpenBook] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleOpenBook = function (index) {
    setSelectedIndex(index);
    setOpenBook(true);
  };
  const [isSettingCollection, setIsSettingCollection] = useState(false);
  const handleSetCollection = async function (e) {
    setIsSettingCollection(true);
    try {
      if (e.target.value) {
        await axios.post(
          `/library/collections/${e.target.value}/libraryItem/${library[selectedIndex].id}`,
        );
      } else {
        await axios.delete(
          `/library/collections/${library[selectedIndex].collectionId}/libraryItem/${library[selectedIndex].id}`,
        );
      }
      queryClient.invalidateQueries(["library", selectedCollection]);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsSettingCollection(false);
    }
  };
  const {
    mutate: removeSubscriptionItem,
    isLoading: isRemovingSubscriptionItem,
  } = useMutation({
    mutationFn: () => {
      return axios.delete(
        `/library/subscriptionItems/${library[selectedIndex].id}`,
      );
    },
    onSuccess: () => {
      toast.success("Subscription book has been removed from your library");
      setOpenBook(false);
      queryClient.invalidateQueries("library");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const [selectedCollection, setSelectedCollection] = useState("allBooks");
  const handleSelectCollection = function (e) {
    setSelectedCollection(e.target.value);
    queryClient.invalidateQueries("collections");
  };

  const { data: library, isLoading: isLoadingLibrary } = useQuery({
    queryKey: ["library", selectedCollection],
    queryFn: async function () {
      let request;
      switch (selectedCollection) {
        case "allBooks":
          request = "/library";
          break;
        case "ownedBooks":
          request = "/library?subscriptionItems=false";
          break;
        case "subscriptionBooks":
          request = "/library?subscriptionItems=true";
          break;
        default:
          request = `/library?collectionId=${selectedCollection}`;
          break;
      }
      const response = await axios.get(request);
      return response.data;
    },
  });

  const [openRemoveCollection, setOpenRemoveCollection] = useState(false);
  const { mutate: removeCollection, isLoading: isRemovingCollection } =
    useMutation({
      mutationFn: () => {
        return axios.delete(`/library/collections/${selectedCollection}`);
      },
      onSuccess: () => {
        toast.success("Collection has been deleted");
        setOpenRemoveCollection(false);
        setSelectedCollection("");
        queryClient.invalidateQueries("collections");
      },
      onError: (err) => toast.error(err.response.data.message),
    });

  const [openAddCollection, setOpenAddCollection] = useState(false);
  const [name, setName] = useState("");
  const { mutate: addCollection, isLoading: isAddingCollection } = useMutation({
    mutationFn: () => {
      return axios.post(`/library/collections`, { name });
    },
    onSuccess: () => {
      toast.success("Collection has been added");
      setOpenAddCollection(false);
      queryClient.invalidateQueries("collections");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const handleDownload = async function () {
    try {
      const response = await axios.get(
        `/library/${library[selectedIndex].id}/${
          library[selectedIndex].bookType === EBOOK ? "book.epub" : "book.mp3"
        }`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${library[selectedIndex].title}.${
        library[selectedIndex].bookType === EBOOK ? "epub" : "mp3"
      }`;
      link.click();

      window.URL.revokeObjectURL(link.href);
      toast.success("Download has started");
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (isLoadingLibrary || isLoadingCollections) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="my-4 text-center text-4xl font-semibold">Library</h1>
      <div className="my-6 flex flex-col gap-4 md:flex-row">
        <div className="flex items-center gap-4 md:w-1/2">
          <p className="w-[230px] text-xl">Select collection:</p>
          <Select
            onChange={handleSelectCollection}
            value={selectedCollection}
            className="w-full"
          >
            <MenuItem value="allBooks">All books</MenuItem>
            <MenuItem value="ownedBooks">Owned books</MenuItem>
            <MenuItem value="subscriptionBooks">Subscription books</MenuItem>
            {collections.map((collection) => (
              <MenuItem key={collection.id} value={collection.id}>
                {collection.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <Button
          className="md:w-1/4"
          onClick={() => {
            setName("");
            setOpenAddCollection(true);
          }}
        >
          Add new collection
        </Button>
        <Button
          type="red"
          onClick={() => setOpenRemoveCollection(true)}
          className="md:w-1/4"
          disabled={selectedCollection === ""}
        >
          Delete this collection
        </Button>
      </div>

      {library.length > 0 && (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {library?.length === 0 ? (
              <p className="text-center text-xl font-semibold">
                No books available
              </p>
            ) : (
              library.map((libraryItem, index) => (
                <LibraryItem
                  key={libraryItem.id}
                  book={libraryItem}
                  handleOpenBook={() => handleOpenBook(index)}
                />
              ))
            )}
          </ul>

          <ModalWindow
            open={openBook}
            onClose={() => setOpenBook(false)}
            width="w-auto sm:w-[500px]"
          >
            <div className="flex w-full flex-col items-center justify-between gap-4 p-4 md:flex-row">
              <img
                src={`${API_BASE_URL}/books/${library[selectedIndex]?.bookId}/coverImage?bookType=${library[selectedIndex]?.bookType}`}
                alt={`Cover of ${library[selectedIndex]?.title}`}
                className="mx-auto max-h-[350px] max-w-[300px] rounded-xl object-cover p-2"
              />
              <div className="flex w-full flex-col gap-4">
                <p className="text-xl font-semibold">
                  {library[selectedIndex]?.title}
                </p>
                <p className="text-xl">{library[selectedIndex]?.bookType}</p>
                {library[selectedIndex]?.isSubscriptionItem ? (
                  <Button
                    type="red"
                    disabled={isRemovingSubscriptionItem}
                    onClick={removeSubscriptionItem}
                  >
                    Remove book from library
                  </Button>
                ) : (
                  <Button onClick={handleDownload}>Download</Button>
                )}
                <Button
                  onClick={() => {
                    window.location.assign(
                      library[selectedIndex]?.bookType === EBOOK
                        ? `/reader/${library[selectedIndex].id}`
                        : `/player/${library[selectedIndex].id}`,
                    );
                  }}
                >
                  {library[selectedIndex]?.bookType === EBOOK
                    ? "Read"
                    : "Listen"}
                </Button>
                <div>
                  <p className="text-lg">Set collection:</p>
                  <Select
                    onChange={handleSetCollection}
                    value={library[selectedIndex]?.collectionId || ""}
                    className="w-full"
                    disabled={isSettingCollection}
                  >
                    <MenuItem value="">None</MenuItem>
                    {collections.map((collection) => (
                      <MenuItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <Button type="red" onClick={() => setOpenBook(false)}>
                  Close
                </Button>
              </div>
            </div>
          </ModalWindow>
        </>
      )}

      <ModalWindow
        open={openAddCollection}
        onClose={() => setOpenAddCollection(false)}
      >
        <label>New collection name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2"
        />
        <Button disabled={isAddingCollection} onClick={addCollection}>
          Add
        </Button>
        <Button type="red" onClick={() => setOpenAddCollection(false)}>
          Close
        </Button>
      </ModalWindow>
      <ModalWindow
        open={openRemoveCollection}
        onClose={() => setOpenRemoveCollection(false)}
      >
        <p>
          Do you want to remove collection{" "}
          {collections?.filter((c) => c.id === selectedCollection)[0]?.name}?
        </p>
        <Button disabled={isRemovingCollection} onClick={removeCollection}>
          Remove
        </Button>
        <Button type="red" onClick={() => setOpenRemoveCollection(false)}>
          Close
        </Button>
      </ModalWindow>
    </div>
  );
}

export default LibraryPage;
