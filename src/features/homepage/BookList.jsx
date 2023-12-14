import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import axios from "../../util/axios";
import ErrorPage from "../../components/ErrorPage";
import Spinner from "../../components/Spinner";
import BookListItem from "../catalogue/BookListItem";

function BookList({ requestUrl, booksPerPage, title, seeMoreUrl }) {
  const {
    data: booksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [requestUrl],
    queryFn: async () => {
      const response = await axios.get(requestUrl);
      return response.data;
    },
  });

  const [startIndex, setStartIndex] = useState(0);
  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
  const handleNext = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, books.length - booksPerPage),
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  let books;
  if (booksData.content) {
    books = booksData.content;
  } else {
    books = booksData;
  }

  const visibleBooks = books.slice(
    startIndex,
    Math.min(books.length, startIndex + booksPerPage),
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-9">
        <p className="text-xl font-semibold">{title}</p>
        {seeMoreUrl && (
          <Link to={seeMoreUrl} className="underline">
            See more
          </Link>
        )}
      </div>

      <div className="flex items-center">
        <ArrowLeftIcon
          fontSize="large"
          className={startIndex === 0 ? `text-gray-500` : `cursor-pointer`}
          onClick={handlePrev}
        />

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visibleBooks?.length === 0 ? (
            <p className="text-center text-xl font-semibold">
              No books available
            </p>
          ) : (
            visibleBooks?.map((book) => (
              <BookListItem key={book.id} book={book} types={book.bookTypes} />
            ))
          )}
        </ul>

        <ArrowRightIcon
          fontSize="large"
          className={
            startIndex === books.length - booksPerPage
              ? `text-gray-500`
              : `cursor-pointer`
          }
          onClick={handleNext}
        />
      </div>
    </div>
  );
}

export default BookList;
