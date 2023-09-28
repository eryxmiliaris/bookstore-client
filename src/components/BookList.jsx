import { useQuery } from "@tanstack/react-query";

import axios from "../util/axios";
import BookListItem from "./BookListItem";

function BookList() {
  const { data: books, isLoading } = useQuery(["allBooks"], async () => {
    const response = await axios.get("/books");
    return response.data;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="mb-4 text-3xl font-semibold">All Books</p>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <p className="mx-2 mb-4 text-3xl font-semibold">Book list</p>
      <ul className="grid grid-cols-1 gap-8 p-12 sm:grid-cols-2 sm:p-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookListItem key={book.id} book={book} />
        ))}
      </ul>
    </div>
  );
}

export default BookList;
