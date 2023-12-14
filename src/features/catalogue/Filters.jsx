import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import queryString from "query-string";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Slider } from "@mui/material";
import toast from "react-hot-toast";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";
import { AUDIOBOOK, EBOOK, PAPER_BOOK } from "../../constants/appConstants";

import FilterItem from "./FilterItem";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import ErrorPage from "../../components/ErrorPage";
import ModalWindow from "../../components/ModalWindow";
import Form from "../../components/Form";

const types = [PAPER_BOOK, EBOOK, AUDIOBOOK];

function Filters() {
  const queryClient = useQueryClient();

  const { isAdmin } = useAuth();

  const {
    data: categories,
    isLoading: categoriesIsLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/books/categories");
      return response.data;
    },
  });

  const { mutate: addCategory, isLoading: isAddingCategory } = useMutation({
    mutationFn: (data) => {
      return axios.post(`/admin/categories`, {
        categoryName: data.categoryName,
      });
    },
    onSuccess: () => {
      toast.success("Category has been succeffully added");
      setAddCategoryOpen(false);
      queryClient.invalidateQueries([`categories`]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const stringParams = searchParams.toString();
  const params = queryString.parse(stringParams);

  const priceStart =
    params.priceStart === undefined ? 0 : Number(params.priceStart);
  const priceEnd =
    params.priceEnd === undefined
      ? 200
      : Math.min(200, Number(params.priceEnd));

  const [minValue, setMinValue] = useState(priceStart);
  const [maxValue, setMaxValue] = useState(priceEnd);
  const [priceValue, setPriceValue] = useState([priceStart, priceEnd]);

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  if (categoriesIsLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  const handlePriceChange = (event, newValue) => {
    setPriceValue(newValue);
    setMinValue(newValue[0]);
    setMaxValue(newValue[1]);
  };

  const handleMinInputChange = (e) => {
    const minValue = e.target.value;
    if (minValue >= 200 || minValue < 0) {
      return;
    }
    setMinValue(minValue);
    setPriceValue([minValue, maxValue]);
  };

  const handleMaxInputChange = (e) => {
    const maxValue = e.target.value;
    if (maxValue >= 200 || maxValue < 0) {
      return;
    }
    setMaxValue(maxValue);
    setPriceValue([minValue, maxValue]);
  };

  const handleApplyPriceRange = () => {
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
      <FilterItem title="Book types" data={types} paramName="bookType" />
      <FilterItem
        title="Categories"
        data={categories.map((category) => category.categoryName)}
        paramName="category"
      />
      {isAdmin && (
        <Button onClick={() => setAddCategoryOpen(true)}>
          Add new category
        </Button>
      )}
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <p className="mb-2 text-xl font-semibold">Price Range</p>

        <Slider
          color="primary"
          value={priceValue}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          max={200}
        />
        <div className="flex items-center justify-between gap-2">
          <input
            type="number"
            value={minValue}
            onChange={handleMinInputChange}
            className="w-full border p-1"
          />
          <input
            type="number"
            value={maxValue}
            onChange={handleMaxInputChange}
            className="w-full border p-1"
          />
        </div>
        <Button className="mt-4" onClick={handleApplyPriceRange}>
          Apply price range
        </Button>
      </div>

      {isAdmin && (
        <ModalWindow
          open={addCategoryOpen}
          onClose={() => setAddCategoryOpen(false)}
        >
          <Form
            onSubmit={addCategory}
            isLoading={isAddingCategory}
            submitButtonText="Add category"
            submitButtonLoadingText="Adding..."
          >
            <Form.Input
              fieldName="categoryName"
              labelText="Category name"
              validation={{
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Category name length should be at least 5",
                },
                maxLength: {
                  value: 100,
                  message: "Category name length can't be longer than 100",
                },
              }}
            ></Form.Input>
          </Form>
        </ModalWindow>
      )}
    </div>
  );
}

export default Filters;
