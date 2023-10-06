import { CircularProgress, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

import axios from "../../util/axios";
import FilterItem from "./FilterItem";

const types = ["Paper book", "Ebook", "Audio book"];

function Filters() {
  const { data: categories, isLoading: categoriesIsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/categories");
      return response.data;
    },
  });

  const [priceValue, setPriceValue] = useState([0, 100]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    function () {
      const stringParams = searchParams.toString();
      const params = queryString.parse(stringParams);

      const priceStart =
        params.priceStart === undefined ? 0 : Number(params.priceStart);
      const priceEnd =
        params.priceEnd === undefined ? 120 : Number(params.priceEnd);
      setPriceValue([priceStart, priceEnd]);
    },
    [searchParams],
  );

  if (categoriesIsLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <CircularProgress style={{ color: "rgb(139 92 246)" }} />
      </div>
    );
  }

  const handlePriceChange = function (event, newValue) {
    setPriceValue(newValue);
  };

  const handleApplyPriceRange = function () {
    const stringParams = searchParams.toString();
    const params = queryString.parse(stringParams);
    const updatedParams = {
      ...params,
      priceStart: priceValue[0],
      priceEnd: priceValue[1],
    };
    setSearchParams(queryString.stringify(updatedParams));
  };

  return (
    <div className="flex flex-col space-y-4 p-0.5">
      <FilterItem title={"Book types"} data={types} paramName={"bookType"} />
      <FilterItem
        title={"Categories"}
        data={categories.map((category) => category.categoryName)}
        paramName={"category"}
      />
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <p className="mb-2 text-xl font-semibold">Price Range</p>
        <Slider
          sx={{
            "& .MuiSlider-thumb": {
              color: "#8B5CF6",
            },
            "& .MuiSlider-track": {
              color: "#8B5CF6",
            },
            "& .MuiSlider-rail": {
              color: "##8B5CF6",
            },
            "& .MuiSlider-active": {
              color: "#8B5CF6",
            },
          }}
          value={priceValue}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          max={120}
        />
        <button
          onClick={handleApplyPriceRange}
          className="mt-2 rounded-lg bg-violet-500 px-4 py-2 text-white transition duration-300 hover:bg-violet-600"
        >
          Apply price range
        </button>
      </div>
    </div>
  );
}

export default Filters;
