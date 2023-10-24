import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

import axios from "../../util/axios";
import FilterItem from "./FilterItem";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

const types = ["Paper book", "Ebook", "Audiobook"];

function Filters() {
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    error,
  } = useQuery({
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
    return <Spinner />;
  }

  if (error) {
    return <div>Error occured: {error.message}</div>;
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
          color="primary"
          value={priceValue}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          max={120}
        />
        <Button onClick={handleApplyPriceRange}>Apply price range</Button>
      </div>
    </div>
  );
}

export default Filters;
