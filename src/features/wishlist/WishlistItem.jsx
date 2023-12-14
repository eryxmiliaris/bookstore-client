import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "../../util/axios";
import {
  API_BASE_URL,
  AUDIOBOOK,
  EBOOK,
  PAPER_BOOK,
} from "../../constants/appConstants";
import { useBook } from "../bookpage/useBook";
import { useAddToCart } from "../cart/useAddToCart";

import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import ErrorPage from "../../components/ErrorPage";

function WishlistItem({ wishlistId, bookId, bookType, paperBookId }) {
  const queryClient = useQueryClient();

  const { book, isLoading, error } = useBook(bookId);
  const { isAdding, addToCart } = useAddToCart();

  const { mutate: removeFromWishlist, isLoading: isRemoving } = useMutation({
    mutationFn: ({ wishlistId }) => {
      return axios.delete(`/wishlist/${wishlistId}`);
    },
    onSuccess: () => {
      toast.success("Book has been successfully removed from your wishlist!");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  const { title, author, rating, numOfReviews, description } = book;

  const priceRenderSwitch = () => {
    let paperBook;
    switch (bookType) {
      case PAPER_BOOK:
        paperBook = book.paperBooks.filter((pb) => pb.id === paperBookId).at(0);
        return (
          <>
            <p
              className={`text-xl sm:text-2xl ${
                paperBook.hasDiscount ? "line-through" : "font-semibold"
              }`}
            >
              {paperBook.price} PLN
            </p>
            {paperBook.hasDiscount && (
              <p className="text-xl font-semibold sm:text-2xl">
                {paperBook.priceWithDiscount} PLN (-
                {paperBook.discountPercentage}%)
              </p>
            )}
          </>
        );
      case EBOOK:
        return (
          <>
            <p
              className={`text-xl sm:text-2xl ${
                book.ebook.hasDiscount ? "line-through" : "font-semibold"
              }`}
            >
              {book.ebook.price} PLN
            </p>
            {book.ebook.hasDiscount && (
              <p className="text-xl font-semibold sm:text-2xl">
                {book.ebook.priceWithDiscount} PLN (-
                {book.ebook.discountPercentage}
                %)
              </p>
            )}
          </>
        );
      case AUDIOBOOK:
        return (
          <>
            <p
              className={`text-xl sm:text-2xl ${
                book.audiobook.hasDiscount ? "line-through" : "font-semibold"
              }`}
            >
              {book.audiobook.price} PLN
            </p>
            {book.audiobook.hasDiscount && (
              <p className="text-xl font-semibold sm:text-2xl">
                {book.audiobook.priceWithDiscount} PLN (-
                {book.audiobook.discountPercentage}
                %)
              </p>
            )}
          </>
        );
    }
  };

  return (
    <li className="my-4 flex flex-col items-center justify-between gap-4 border border-violet-300 bg-violet-200 py-4 sm:flex-row sm:items-start">
      <div>
        <Link to={`/books/${bookId}?bookType=${bookType}`}>
          <img
            src={`${API_BASE_URL}/books/${bookId}/coverImage?bookType=${bookType}&paperBookId=${
              paperBookId || 0
            }`}
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
        <p>
          {rating} ({numOfReviews})
        </p>
        <p className="hidden sm:block lg:hidden">
          {description.slice(0, 200) + "..."}
        </p>
        <p className="hidden lg:block">{description.slice(0, 300) + "..."}</p>
      </div>

      <div className="mt-0 flex w-full flex-col items-center justify-between gap-2 px-4 sm:mr-4 sm:mt-4 sm:px-0">
        <div className="flex flex-col items-center">
          <p className="text-xl">
            {bookType}
            {bookType === PAPER_BOOK
              ? `, ${book.paperBooks
                  .filter((pb) => pb.id === paperBookId)
                  .at(0)
                  .coverType.toLowerCase()}`
              : ""}
          </p>
          {priceRenderSwitch()}
        </div>
        <Button
          disabled={isAdding}
          disabledText="Adding..."
          onClick={() => addToCart({ bookId, bookType, paperBookId })}
          type="green"
        >
          Add to cart
        </Button>
        <Button
          type="red"
          onClick={() => removeFromWishlist({ wishlistId })}
          disabled={isRemoving}
        >
          Remove from wishlist
        </Button>
      </div>
    </li>
  );
}

export default WishlistItem;
