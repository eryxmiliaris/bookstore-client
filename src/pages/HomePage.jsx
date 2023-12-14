import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import axios from "../util/axios";
import { useAuth } from "../features/auth/AuthContext";

import Spinner from "../components/Spinner";
import ErrorPage from "../components/ErrorPage";
import BookList from "../features/homepage/BookList";

function HomePage() {
  const { user } = useAuth();

  const {
    data: categories,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/books/categories");
      return response.data;
    },
  });

  const getBooksPerPage = () => {
    if (window.innerWidth < 768) {
      return 2;
    } else if (window.innerWidth < 1024) {
      return 3;
    } else {
      return 4;
    }
  };
  const [booksPerPage, setBooksPerPage] = useState(getBooksPerPage());

  useEffect(() => {
    const handleResize = () => {
      setBooksPerPage(getBooksPerPage());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (categoriesIsLoading) {
    return <Spinner />;
  }

  if (categoriesError) {
    return <ErrorPage error={categoriesError} />;
  }

  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)]?.categoryName;

  return (
    <div className="container mx-auto mb-10 px-4 py-4">
      <div className="my-4 flex w-full flex-col justify-between gap-3 border border-violet-300 bg-white px-8 py-6">
        <p className="text-3xl font-semibold">Recent news</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
          facilisis facilisis lorem, a congue purus eleifend vestibulum.
          Phasellus in justo consequat, elementum augue sit amet, vestibulum mi.
          Ut nulla libero, consectetur id rutrum ut, eleifend vitae sapien.
          Fusce diam risus, lacinia vel finibus in, accumsan at sem. Suspendisse
          elit arcu, tristique eu arcu a, iaculis euismod libero. In hac
          habitasse platea dictumst. Nullam in turpis at sem eleifend
          vestibulum. In pellentesque nec elit et tempus.
        </p>
      </div>
      <div className="space-y-8">
        {user && (
          <BookList
            requestUrl="/books/recommended"
            booksPerPage={booksPerPage}
            title="Recommended books"
          />
        )}

        <BookList
          requestUrl="/books/popular"
          booksPerPage={booksPerPage}
          title="Popular books"
        />

        <BookList
          requestUrl={`/books?category=${randomCategory}`}
          booksPerPage={booksPerPage}
          title={`Find more books from "${randomCategory}" category!`}
          seeMoreUrl={`/books?category=${randomCategory}`}
        />
      </div>
    </div>
  );
}

export default HomePage;
