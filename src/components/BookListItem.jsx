import { Link } from "react-router-dom";

const BookListItem = ({ book }) => {
  return (
    <li className="rounded-md bg-white shadow-md">
      <Link to={`/books/${book.id}`} className="block">
        <img
          // src={book.coverImageUrl}
          src={"https://picsum.photos/200/300"}
          alt={`Cover of ${book.title}`}
          className="mx-auto my-2 h-64 w-48 object-cover"
        />
        <div className="p-4">
          <p className="mb-2 text-xl font-semibold text-gray-800">
            {book.title}
          </p>
          <p className="text-gray-600">Author: {book.author}</p>
          <p className="text-gray-600">{book.bookTypes.join(", ")}</p>
        </div>
      </Link>
    </li>
  );
};

export default BookListItem;
