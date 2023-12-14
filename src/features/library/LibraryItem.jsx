import { API_BASE_URL } from "../../constants/appConstants";

function LibraryItem({ book, handleOpenBook }) {
  return (
    <li className="rounded-xl bg-white shadow-md">
      <span onClick={handleOpenBook}>
        <img
          src={`${API_BASE_URL}/books/${book.bookId}/coverImage?bookType=${book.bookType}`}
          alt={`Cover of ${book.title}`}
          className="mx-auto max-h-64 w-max rounded-xl object-cover p-2"
        />
        <div className="space-y-2 p-3">
          <p className="mb-2 text-lg font-semibold text-gray-800">
            {book.title}
          </p>
          <p className="text-lg">{book.bookType}</p>
          <p className="text-gray-600">Author: {book.author}</p>
          {book.isSubscriptionItem && (
            <p className="font-semibold italic text-gray-500">
              Subscription book
            </p>
          )}
        </div>
      </span>
    </li>
  );
}

export default LibraryItem;
