import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "../util/axios";
import { useAuth } from "../features/auth/AuthContext";
import { useLocalCart } from "../features/cart/LocalCartContext";
import { useWishlist } from "../features/wishlist/useWishlist";
import { useBook } from "../features/bookpage/useBook";
import { useAddToCart } from "../features/cart/useAddToCart";
import {
  API_BASE_URL,
  AUDIOBOOK,
  EBOOK,
  PAPER_BOOK,
} from "../constants/appConstants";

import Versions from "../features/bookpage/Versions";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import ModalWindow from "../components/ModalWindow";
import ErrorPage from "../components/ErrorPage";
import ReviewList from "../features/bookpage/ReviewList";

function BookPage() {
  const { id } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const [paperBookId, setPaperBookId] = useState(
    Number(searchParams.get("paperBookId")) || 0,
  );
  const { book, isLoading: isLoadingBook, error: bookError } = useBook(id);
  const { wishlist, isLoading: isLoadingWishlist } = useWishlist();

  const { user } = useAuth();
  const { addItemToLocalCart } = useLocalCart();
  const { isAdding: isAddingToCart, addToCart } = useAddToCart();

  const [isOrdered, setIsOrdered] = useState(false);
  useEffect(() => {
    const isBookOrdered = async () => {
      try {
        const response = await axios.get(`/orders/book/${id}`);
        if (response.data) {
          setIsOrdered(true);
        }
      } catch (e) {
        console.log(e.data);
      }
    };
    isBookOrdered();
  }, [setIsOrdered, id]);

  const [addToLibraryOpen, setAddToLibraryOpen] = useState(false);
  const { mutate: addToLibrary, isLoading: isAddingToLibrary } = useMutation({
    mutationFn: () => {
      return axios.post(
        `/library/subscriptionItems?bookId=${id}&bookType=${bookType}`,
      );
    },
    onSuccess: () => {
      toast.success("Book has been successfully added to your library");
      setAddToLibraryOpen(false);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const [wishlistClickProcessing, setWishlistClickProcessing] = useState(false);

  if (isLoadingBook || isLoadingWishlist) {
    return <Spinner />;
  }

  if (bookError) {
    return <ErrorPage error={bookError} />;
  }

  const {
    title,
    author,
    rating,
    numOfReviews,
    reviews,
    categories,
    description,
    publicationDate,
    paperBooks,
    ebook,
    audiobook,
  } = book;

  if (!paperBooks.length && !ebook && !audiobook) {
    window.location.replace("/books");
  }

  const bookType =
    searchParams.get("bookType") ||
    (paperBooks?.length > 0 ? PAPER_BOOK : ebook ? EBOOK : AUDIOBOOK);

  const inWishlist = user
    ? wishlist.filter(
        (w) =>
          w.bookId === Number(id) &&
          w.bookType === bookType &&
          (w.paperBookId === null ||
            w.paperBookId === paperBooks[0]?.id ||
            w.paperBookId === paperBookId),
      ).length > 0
    : false;

  const handleWishlistClick = async () => {
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
            w.bookType === bookType &&
            (w.paperBookId === null ||
              w.paperBookId === paperBooks[0]?.id ||
              w.paperBookId === paperBookId),
        )
        .at(0).id;
      try {
        await axios.delete(`/wishlist/${wishlistId}`);
        queryClient.invalidateQueries("wishlist");
        toast.success("Book has been successfully removed from your wishlist!");
      } catch (error) {
        toast.error(error.response.data.message);
        console.error(error);
      } finally {
        setWishlistClickProcessing(false);
      }
    } else {
      try {
        await axios.post("/wishlist", {
          bookId: id,
          bookType: bookType,
          paperBookId: paperBookId || paperBooks[0]?.id || null,
        });
        toast.success("Book has been successfully added to your wishlist!");
        queryClient.invalidateQueries("wishlist");
      } catch (error) {
        toast.error(error.response.data.message);
        console.error(error);
      } finally {
        setWishlistClickProcessing(false);
      }
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      const price =
        bookType === PAPER_BOOK
          ? paperBooks?.filter((pb) => pb.id === paperBookId)[0]?.price ||
            paperBooks[0].price
          : bookType === EBOOK
          ? ebook.price
          : audiobook.price;
      if (
        addItemToLocalCart({
          bookId: Number(id),
          bookType,
          paperBookId: paperBookId || paperBooks[0]?.id || null,
          quantity: 1,
          hasDiscount: false,
          priceWithDiscount: 0,
          price: price,
          totalPrice: price,
        })
      ) {
        toast.success("Book added to your cart");
      } else {
        toast.error("You already have that book in your cart");
      }
    } else {
      addToCart({
        bookId: id,
        bookType,
        paperBookId: paperBookId || paperBooks[0]?.id || null,
      });
    }
  };

  const renderSwitch = (bookType) => {
    let pb;
    switch (bookType) {
      case PAPER_BOOK:
        pb =
          paperBooks.filter((pb) => pb.id === paperBookId)[0] || paperBooks[0];
        return (
          <>
            <p>Publisher: {pb.publisher}</p>
            <p>Number of pages: {pb.numOfPages}</p>
            <p>ISBN: {pb.isbn}</p>
          </>
        );
      case EBOOK:
        return (
          <>
            <p>Publisher: {ebook.publisher}</p>
            <p>Number of pages: {ebook.numOfPages}</p>
          </>
        );
      case AUDIOBOOK:
        return (
          <>
            <p>Publisher: {audiobook.publisher}</p>
            <p>Narrator: {audiobook.narrator}</p>
            <p>
              Duration: {Math.floor(audiobook.durationSeconds / 3600)}:
              {String(
                Math.floor((audiobook.durationSeconds % 3600) / 60),
              ).padStart(2, "0")}
              :{String(audiobook.durationSeconds % 60).padStart(2, "0")}
            </p>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto py-8 ">
      <div className="flex flex-col items-center gap-4 space-y-4 sm:flex-row sm:items-start sm:space-x-5">
        <div className="flex flex-col items-center gap-2 sm:w-1/4">
          <img
            src={`${API_BASE_URL}/books/${id}/coverImage?bookType=${bookType}&paperBookId=${
              paperBookId || paperBooks[0]?.id || 0
            }`}
            alt={title}
            className="max-h-[600px] max-w-[250px] rounded-md sm:max-h-[350px] sm:max-w-full"
          />

          <Button
            onClick={handleWishlistClick}
            disabled={wishlistClickProcessing}
          >
            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
          <Button
            type="green"
            disabled={isAddingToCart}
            onClick={handleAddToCart}
          >
            Buy
          </Button>
          {bookType !== PAPER_BOOK && user?.hasActiveSubscription && (
            <>
              <Button onClick={() => setAddToLibraryOpen(true)}>
                Add to library
              </Button>
            </>
          )}
        </div>

        <div className="w-full sm:w-1/3">
          <p className="mb-4 text-3xl font-semibold">{title}</p>
          <p>Author: {author}</p>
          <p>
            Rating: {rating} ({numOfReviews})
          </p>
          <p>Categories: {categories.join(", ")}</p>
          <p>Publication date: {publicationDate}</p>
          {renderSwitch(bookType)}
        </div>

        <Versions
          bookId={id}
          bookType={bookType}
          paperBooks={paperBooks}
          paperBookId={paperBookId}
          setPaperBookId={setPaperBookId}
          ebook={ebook}
          audiobook={audiobook}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Description</h2>
        <p>{description}</p>
      </div>

      <ReviewList reviews={reviews} isOrdered={isOrdered} />

      <ModalWindow
        open={addToLibraryOpen}
        onClose={() => setAddToLibraryOpen(false)}
      >
        <p className="text-2xl font-semibold">Add book to the library?</p>
        <p className="text-lg">
          This book can be added to your library, because you have an active
          subscription. You will lose access to the book as soon as the
          subscription ends, but you can always buy a book or prolong your
          subscription.
        </p>
        <Button disabled={isAddingToLibrary} onClick={addToLibrary}>
          Confirm
        </Button>
        <Button type="red" onClick={() => setAddToLibraryOpen(false)}>
          Cancel
        </Button>
      </ModalWindow>
    </div>
  );
}

export default BookPage;
