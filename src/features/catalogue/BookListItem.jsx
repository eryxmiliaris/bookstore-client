import { Link } from "react-router-dom";

const BookListItem = ({ book }) => {
  return (
    <li className="rounded-xl bg-white shadow-md">
      <Link to={`/books/${book.id}`} className="block">
        <img
          // src={book.coverImageUrl}
          src={"https://picsum.photos/200/300"}
          alt={`Cover of ${book.title}`}
          className="mx-auto h-max w-max rounded-xl object-cover p-2"
        />
        <div className="p-3">
          <p className="mb-2 text-lg font-semibold text-gray-800">
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
