import { useWishlist } from "../features/wishlist/useWishlist";
import axios from "../util/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

function WishList() {
  const { wishlist, isLoading, error } = useWishlist();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto py-8 ">
      <h1 className="my-4 text-center text-4xl font-semibold">
        My Wishlist ({wishlist.length} items)
      </h1>
      <ul className="flex-col">
        {wishlist.length > 0
          ? wishlist.map((w) => (
              <WishListItem
                key={w.id}
                wishlistId={w.id}
                bookId={w.bookId}
                bookType={w.bookType}
                paperBookId={w.paperBookId}
              />
            ))
          : "Your wishlist is empty!"}
      </ul>
    </div>
  );
}

function WishListItem({ wishlistId, bookId, bookType, paperBookId }) {
  const {
    data: book,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`book${bookId}`],
    queryFn: async () => {
      const response = await axios.get(`/books/${bookId}`);
      return response.data;
    },
  });

  const [isRemoving, setIsRemoving] = useState(false);

  const queryClient = useQueryClient();

  if (isLoading) {
    return <Spinner />;
  }

  const { title, author, rating, description } = book;

  const priceRenderSwitch = function () {
    switch (bookType) {
      case "Paper book":
        const paperBook = book.paperBooks
          .filter((pb) => pb.id === paperBookId)
          .at(0);
        return (
          <>
            <p
              className={`text-xl sm:text-2xl ${
                paperBook.hasDiscount ? "line-through" : "font-semibold"
              }`}
            >
              {paperBook.price}
            </p>
            {paperBook.hasDiscount && (
              <p className="text-xl font-semibold sm:text-2xl">
                {paperBook.priceWithDiscount} (-{paperBook.discountPercentage}%)
              </p>
            )}
          </>
        );
      case "Ebook":
        return (
          <>
            <p
              className={`text-xl sm:text-2xl ${
                book.ebook.hasDiscount ? "line-through" : "font-semibold"
              }`}
            >
              {book.ebook.price}
            </p>
            {book.ebook.hasDiscount && (
              <p className="text-xl font-semibold sm:text-2xl">
                {book.ebook.priceWithDiscount} (-{book.ebook.discountPercentage}
                %)
              </p>
            )}
          </>
        );
      case "Audiobook":
        return (
          <>
            <p
              className={`text-xl sm:text-2xl ${
                book.audioBook.hasDiscount ? "line-through" : "font-semibold"
              }`}
            >
              {book.audioBook.price}
            </p>
            {book.audioBook.hasDiscount && (
              <p className="text-xl font-semibold sm:text-2xl">
                {book.audioBook.priceWithDiscount} (-
                {book.audioBook.discountPercentage}
                %)
              </p>
            )}
          </>
        );
    }
  };

  const handleRemove = async function () {
    try {
      setIsRemoving(true);
      await axios.delete(`/user/wishlist/${wishlistId}`);
      queryClient.invalidateQueries("wishlist");
      toast.success("Book has been successfully removed from your wishlist!");
    } catch (error) {
      toast.error("Error occured while removing book from your wishlist.");
      console.error(error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <li className="my-4 flex flex-col items-center justify-between gap-3 border border-violet-300 bg-violet-200 py-4 sm:flex-row sm:items-start">
      <div>
        <Link to={`/books/${bookId}?bookType=${bookType}`}>
          <img
            src={"https://picsum.photos/400/600"}
            alt={book.title}
            className="max-h-[250px] max-w-[150px] sm:max-h-[300px] sm:max-w-[200px] sm:p-4"
          />
        </Link>
      </div>

      <div className="mt-0 flex w-full flex-col items-center justify-center sm:mt-4 sm:items-start">
        <Link to={`/books/${bookId}?bookType=${bookType}`}>
          <p className="text-2xl font-semibold">{title}</p>
        </Link>
        <p className="text-gray-600">{author}</p>
        <p>{rating}</p>
        <p className="hidden sm:block lg:hidden">
          {description.slice(0, 200) + "..."}
        </p>
        <p className="hidden lg:block">{description.slice(0, 300) + "..."}</p>
      </div>

      <div className="mt-0 flex w-full flex-col items-center justify-between gap-2 px-4 sm:mr-4 sm:mt-4 sm:px-0">
        <div className="flex flex-col items-center">
          <p className="text-xl">
            {bookType}
            {bookType === "Paper book"
              ? `, ${book.paperBooks
                  .filter((pb) => pb.id === paperBookId)
                  .at(0)
                  .coverType.toLowerCase()}`
              : ""}
          </p>
          {priceRenderSwitch()}
        </div>
        <button className="w-full bg-green-500 px-4 py-2 text-white">
          Add to Cart
        </button>
        <button
          className="w-full bg-red-400 px-4 py-2 text-white"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          Remove from wishlist
        </button>
      </div>
    </li>
  );
}

export default WishList;
