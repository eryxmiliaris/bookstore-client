import queryString from "query-string";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
const sortOptions = [
  {
    label: "Title ascending",
    value: "title,asc",
  },
  {
    label: "Title descending",
    value: "title,desc",
  },
  {
    label: "Rating ascending",
    value: "rating,asc",
  },
  {
    label: "Rating descending",
    value: "rating,desc",
  },
  {
    label: "Publication date ascending",
    value: "publication_date,asc",
  },
  {
    label: "Publication date descending",
    value: "publication_date,desc",
  },
];

function Sorting() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOptionChange = function (selectedOption) {
    const [sortBy, sortOrder] = selectedOption.value.split(",");
    const stringParams = searchParams.toString();
    const params = queryString.parse(stringParams);
    const updatedParams = {
      ...params,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };
    setSearchParams(updatedParams);
  };

  const handleSearchClick = function () {
    if (!searchQuery.trim()) return;
    const stringParams = searchParams.toString();
    const params = queryString.parse(stringParams);
    const updatedParams = {
      ...params,
      bookTitle: searchQuery.trim(),
    };
    setSearchParams(queryString.stringify(updatedParams));
  };

  const handleSearchClear = function () {
    const stringParams = searchParams.toString();
    const params = queryString.parse(stringParams);
    delete params.bookTitle;
    setSearchQuery("");
    setSearchParams(queryString.stringify(params));
  };

  useEffect(
    function () {
      const sortBy = queryString.parse(searchParams.toString()).sortBy;
      if (sortBy !== undefined) {
        const sortOrder = queryString.parse(searchParams.toString()).sortOrder;
        const value = `${sortBy},${sortOrder}`;
        sortOptions.map((option) => {
          if (option.value === value) {
            setSelectedOption(option);
          }
          return option;
        });
      }
      const bookTitle = queryString.parse(searchParams.toString()).bookTitle;
      if (bookTitle !== undefined) {
        setSearchQuery(bookTitle);
      }
    },
    [setSearchQuery, setSelectedOption, searchParams],
  );

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchClick();
            }}
            placeholder="Search..."
            className="w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring"
          />
          {searchQuery && (
            <span
              className="absolute inset-y-0 right-10 flex cursor-pointer items-center pr-3"
              onClick={() => handleSearchClear()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          )}
          <span
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
            onClick={handleSearchClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.293 18.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 1.414L15 19.414a1 1 0 001.414 0z"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-end">
        <p className="text-lg font-semibold">Sort by:</p>
        <Select
          options={sortOptions}
          onChange={handleOptionChange}
          value={selectedOption}
          className="w-64"
        />
      </div>
    </div>
  );
}

export default Sorting;
