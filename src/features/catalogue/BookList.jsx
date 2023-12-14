import { Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

import axios from "../../util/axios";

import BookListItem from "./BookListItem";
import Spinner from "../../components/Spinner";
import ErrorPage from "../../components/ErrorPage";

function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get("pageNumber")) || 0;
  const categoriesSP =
    queryString.parse(searchParams.toString()).category === undefined ||
    queryString.parse(searchParams.toString()).category === null
      ? null
      : Array.isArray(queryString.parse(searchParams.toString()).category)
      ? queryString.parse(searchParams.toString()).category.sort()
      : new Array(queryString.parse(searchParams.toString()).category);
  const types =
    queryString.parse(searchParams.toString()).bookType === null
      ? null
      : Array.isArray(queryString.parse(searchParams.toString()).bookType)
      ? queryString.parse(searchParams.toString()).bookType.sort()
      : new Array(queryString.parse(searchParams.toString()).bookType);
  const priceStart = queryString.parse(searchParams.toString()).priceStart;
  const priceEnd = queryString.parse(searchParams.toString()).priceEnd;
  const sortBy = queryString.parse(searchParams.toString()).sortBy;
  const sortOrder = queryString.parse(searchParams.toString()).sortOrder;
  const bookTitle = queryString.parse(searchParams.toString()).bookTitle;

  const {
    data: booksData,
    isLoading: booksIsLoading,
    error,
  } = useQuery({
    queryKey: [
      "books",
      pageNumber,
      categoriesSP,
      types,
      priceStart,
      priceEnd,
      sortBy,
      sortOrder,
      bookTitle,
    ],
    queryFn: async () => {
      const paramString = searchParams.toString();
      const url = `/books${paramString ? `?${paramString}` : ""}`;

      const response = await axios.get(url);
      if (pageNumber >= response.data.totalPages) {
        const params = queryString.parse(paramString);
        const updatedParams = { ...params, pageNumber: 0 };
        setSearchParams(updatedParams);
      }
      return response.data;
    },
  });

  if (booksIsLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  const { content: books, totalPages } = booksData;

  const handlePageChange = (event, value) => {
    const query = queryString.parse(searchParams.toString());
    const queryStringified = queryString.stringify({
      ...query,
      pageNumber: value - 1,
    });
    setSearchParams(queryStringified);
  };

  return (
    <div className="flex flex-col">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.length === 0 ? (
          <p className="text-center text-xl font-semibold">
            No books available
          </p>
        ) : (
          books.map((book) => {
            return (
              <BookListItem
                key={book.id}
                book={book}
                types={types[0] === undefined ? book.bookTypes : types}
              />
            );
          })
        )}
      </ul>

      <div className="my-10 flex items-center justify-center">
        <Pagination
          count={totalPages === 0 ? 1 : totalPages}
          page={pageNumber + 1}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}

export default BookList;
