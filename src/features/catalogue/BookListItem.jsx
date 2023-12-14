import { Link } from "react-router-dom";

import { API_BASE_URL } from "../../constants/appConstants";

const BookListItem = ({ book, types }) => {
  const bookType = book.bookTypes.filter((bookType) =>
    types?.includes(bookType),
  )[0];
  return (
    <li className="rounded-xl bg-white text-center shadow-md sm:text-left">
      <Link
        to={`/books/${book.id}${
          types.length === 1 && types[0] !== undefined
            ? `?bookType=${types[0]}`
            : ""
        }`}
        className="block"
      >
        <img
          src={`${API_BASE_URL}/books/${book.id}/coverImage?bookType=${bookType}`}
          alt={`Cover of ${book.title}`}
          className="mx-auto max-h-64 w-max rounded-xl object-cover p-2"
        />
        <div className="p-3">
          <p className="mb-2 text-lg font-semibold text-gray-800">
            {book.title}
          </p>
          <p className="text-gray-600">Author: {book.author}</p>
          <p className="italic text-gray-600">{book.bookTypes.join(", ")}</p>
        </div>
      </Link>
    </li>
  );
};

export default BookListItem;
