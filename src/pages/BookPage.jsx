import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import axios from "../util/axios";
import { useState } from "react";
import Versions from "../features/bookpage/Versions";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../features/wishlist/useWishlist";
import Spinner from "../components/Spinner";

function BookPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paperBookId, setPaperBookId] = useState(
    Number(searchParams.get("paperBookId")) || 0,
  );
  const [wishlistClickProcessing, setWishlistClickProcessing] = useState(false);

  const navigate = useNavigate();

  const {
    data: book,
    isLoading,
    error,
  } = useQuery([`book${id}`], async () => {
    const response = await axios.get(`/books/${id}`);
    return response.data;
  });

  const { user } = useAuth();
  const {
    wishlist,
    isLoading: isLoadingWishlist,
    error: wishlistError,
  } = useWishlist();
  const queryClient = useQueryClient();

  if (isLoading || isLoadingWishlist) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error occured: {error.message}</div>;
  }

  const {
    title,
    author,
    rating,
    categories,
    description,
    publicationDate,
    paperBooks,
    ebook,
    audioBook,
  } = book;
  const bookType =
    searchParams.get("bookType") ||
    (paperBooks?.length > 0 ? "Paper book" : ebook ? "Ebook" : "Audiobook");
  let fullBookType;
  switch (bookType) {
    case "Paper book":
      fullBookType = "Paper book";
      break;
    case "Ebook":
      fullBookType = "Ebook";
      break;
    case "Audiobook":
      fullBookType = "Audiobook";
      break;
  }

  // const inWishlist = false;
  const inWishlist = user
    ? wishlist.filter(
        (w) =>
          w.bookId === Number(id) &&
          w.bookType === fullBookType &&
          (w.paperBookId === null ||
            w.paperBookId === paperBooks[paperBookId].id),
      ).length > 0
    : false;

  const coverImageURL =
    bookType === "Paper book"
      ? paperBooks[paperBookId].coverImageUrl
      : bookType === "Ebook"
      ? ebook.coverImageUrl
      : audioBook.coverImageUrl;

  const handleWishlistClick = async function () {
    if (!user) {
      navigate("/signin");
      return;
    }
    if (inWishlist) {
      setWishlistClickProcessing(true);
      const wishlistId = wishlist
        .filter(
          (w) =>
            w.bookId === Number(id) &&
            w.bookType === fullBookType &&
            (w.paperBookId === null ||
              w.paperBookId === paperBooks[paperBookId].id),
        )
        .at(0).id;
      try {
        await axios.delete(`/user/wishlist/${wishlistId}`);
        queryClient.invalidateQueries("wishlist");
        toast.success("Book has been successfully removed from your wishlist!");
      } catch (error) {
        toast.error("Error occured while removing book from your wishlist.");
        console.error(error);
      } finally {
        setWishlistClickProcessing(false);
      }
    } else {
      try {
        await axios.post("/user/wishlist", {
          bookId: id,
          bookType: fullBookType,
          paperBookId:
            bookType === "Paper book" ? paperBooks[paperBookId].id : null,
        });
        toast.success("Book has been successfully added to your wishlist!");
        queryClient.invalidateQueries("wishlist");
      } catch (error) {
        toast.error("Error occured while adding book to your wishlist.");
        console.error(error);
      }
    }
  };

  const renderSwitch = function (bookType) {
    switch (bookType) {
      case "Paper book":
        return (
          <>
            <p>Publisher: {paperBooks.at(paperBookId).publisher}</p>
            <p>Number of pages: {paperBooks.at(paperBookId).numOfPages}</p>
            <p>ISBN: {paperBooks.at(paperBookId).isbn}</p>
          </>
        );
      case "Ebook":
        return (
          <>
            <p>Publisher: {ebook.publisher}</p>
            <p>Number of pages: {ebook.numOfPages}</p>
          </>
        );
      case "Audiobook":
        return (
          <>
            <p>Publisher: {audioBook.publisher}</p>
            <p>Narrator: {audioBook.narrator}</p>
            <p>Duration: {audioBook.durationSeconds}</p>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto py-8 ">
      <div className="flex flex-col items-start gap-4 space-y-4 sm:flex-row sm:space-x-5">
        <div className="flex w-full flex-col items-center sm:w-1/3">
          <img
            src={"https://picsum.photos/400/600"}
            // src={coverImageURL}
            alt={title}
            className="max-h-[600px] max-w-[250px] sm:max-h-[350px] sm:max-w-[230px]"
          />
          <div className="mt-4 flex flex-row">
            <button
              className="mr-2 bg-violet-500 px-4 py-2 text-white"
              onClick={handleWishlistClick}
              disabled={wishlistClickProcessing}
            >
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
            <button className="bg-green-600 px-4 py-2 text-white">Buy</button>
          </div>
        </div>

        <div className="w-full sm:w-1/3">
          <p className="mb-4 text-3xl font-semibold">{title}</p>
          <p>Author: {author}</p>
          <p>Rating: {rating}</p>
          <p>Categories: {categories.join(", ")}</p>
          <p>Publication date: {publicationDate}</p>
          {renderSwitch(bookType)}
        </div>

        <Versions
          bookType={bookType}
          paperBooks={paperBooks}
          paperBookId={paperBookId}
          setPaperBookId={setPaperBookId}
          ebook={ebook}
          audioBook={audioBook}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Description</h2>
        <p>{description}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Opinions</h2>
      </div>
    </div>
  );
}

export default BookPage;
