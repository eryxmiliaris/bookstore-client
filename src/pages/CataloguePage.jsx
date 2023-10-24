import BookList from "../features/catalogue/BookList";
import Filters from "../features/catalogue/Filters";
import Sorting from "../features/catalogue/Sorting";

function CataloguePage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="my-4 text-center text-4xl font-semibold">Catalogue</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
        <div className="w-full sm:w-2/5 sm:pr-4 lg:w-1/3">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-2 text-xl font-semibold">Filters</h2>
            <Filters />
          </div>
        </div>
        <div className="w-full">
          <Sorting />
          <BookList />
        </div>
      </div>
    </div>
  );
}

export default CataloguePage;
