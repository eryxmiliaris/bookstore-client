import { useWishlist } from "../features/wishlist/useWishlist";

import Spinner from "../components/Spinner";
import WishlistItem from "../features/wishlist/WishlistItem";
import ErrorPage from "../components/ErrorPage";

function WishListPage() {
  const { wishlist, isLoading, error } = useWishlist();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="my-4 text-center text-4xl font-semibold">
        Wishlist ({wishlist.length} items)
      </h1>

      <ul className="flex-col">
        {wishlist.length > 0 ? (
          wishlist.map((w) => (
            <WishlistItem
              key={w.id}
              wishlistId={w.id}
              bookId={w.bookId}
              bookType={w.bookType}
              paperBookId={w.paperBookId}
            />
          ))
        ) : (
          <p className="p-4 text-center text-2xl">Your wishlist is empty!</p>
        )}
      </ul>
    </div>
  );
}

export default WishListPage;
