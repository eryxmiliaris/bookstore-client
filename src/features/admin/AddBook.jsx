import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";
import { AUDIOBOOK, EBOOK, PAPER_BOOK } from "../../constants/appConstants";

import Spinner from "../../components/Spinner";
import Form from "../../components/Form";

function AddBook() {
  const { isAdmin, isLoading: isLoadingUser } = useAuth();

  const navigate = useNavigate();

  const { data: categories, isLoading: categoriesIsLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/books/categories");
      return response.data;
    },
  });

  useEffect(() => {
    if (!isLoadingUser && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoadingUser, navigate]);

  const [selectedBookType, setSelectedBookType] = useState(PAPER_BOOK);
  const handleSelectBookType = (e) => {
    setSelectedBookType(e.target.value);
    setBookFile(null);
    setPreviewFile(null);
  };

  const [hasDiscount, setHasDiscount] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (data) => {
    const {
      title,
      author,
      description,
      publisher,
      publicationDate,
      categories,
      price,
      discountPercentage,
      discountEndDate,
      coverType,
      isbn,
      numOfPages,
      narrator,
      durationSeconds,
    } = data;
    let formData;

    setIsLoading(true);

    switch (selectedBookType) {
      case PAPER_BOOK:
        formData = new FormData();
        formData.append("coverImageFile", coverImageFile);
        formData.append(
          "newBook",
          JSON.stringify({
            bookType: selectedBookType,
            title: title || null,
            author,
            description,
            publisher,
            publicationDate,
            price,
            hasDiscount,
            discountPercentage,
            discountEndDate,
            isHidden,
            categories,
            coverType,
            isbn,
            isAvailable,
            numOfPages,
          }),
        );
        try {
          const response = await axios.post("/admin/books", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          navigate(`/books/${response.data}`);
        } catch (error) {
          toast.error(error.response.data.message);
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
        break;
      case EBOOK:
        formData = new FormData();
        formData.append("coverImageFile", coverImageFile);
        formData.append("bookFile", bookFile);
        formData.append("previewFile", previewFile);
        formData.append(
          "newBook",
          JSON.stringify({
            bookType: selectedBookType,
            title,
            author,
            description,
            publisher,
            publicationDate,
            price,
            hasDiscount,
            discountPercentage,
            discountEndDate,
            isHidden,
            categories,
            numOfPages,
          }),
        );
        try {
          const response = await axios.post("/admin/books", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          navigate(`/books/${response.data}`);
        } catch (error) {
          toast.error(error.response.data.message);
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
        break;
      case AUDIOBOOK:
        formData = new FormData();
        formData.append("coverImageFile", coverImageFile);
        formData.append("bookFile", bookFile);
        formData.append("previewFile", previewFile);
        formData.append(
          "newBook",
          JSON.stringify({
            bookType: selectedBookType,
            title,
            author,
            description,
            publisher,
            publicationDate,
            price,
            hasDiscount,
            discountPercentage,
            discountEndDate,
            isHidden,
            categories,
            narrator,
            durationSeconds,
          }),
        );
        try {
          const response = await axios.post("/admin/books", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          navigate(`/books/${response.data}`);
        } catch (error) {
          toast.error(error.response.data.message);
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
        break;
    }
  };

  if (isLoadingUser || categoriesIsLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto pb-10 pt-2">
      <h1 className="my-4 text-center text-2xl font-semibold">Add new book</h1>

      <div className="mb-2">
        <p className="block font-medium text-gray-600">Select book type:</p>
        <select
          className="mt-1 w-full rounded border p-2"
          value={selectedBookType}
          onChange={handleSelectBookType}
        >
          <option value={PAPER_BOOK}>Paper book</option>
          <option value={EBOOK}>Ebook</option>
          <option value={AUDIOBOOK}>Audiobook</option>
        </select>
      </div>

      <Form
        onSubmit={handleSubmit}
        submitButtonText="Add new book"
        isLoading={isLoading}
        submitButtonLoadingText="Adding..."
      >
        <div>
          <label>
            <input
              className="mr-2"
              type="checkbox"
              checked={isHidden}
              onChange={(e) => setIsHidden(e.target.checked)}
            />
            Hidden
          </label>
        </div>
        <Form.Input
          labelText="Title"
          fieldName="title"
          validation={{
            required: "This field is required",
            minLength: {
              value: 5,
              message: "Title length should be at least 5",
            },
            maxLength: {
              value: 100,
              message: "Title length can't be longer than 100",
            },
          }}
        />
        <Form.Input
          labelText="Author"
          fieldName="author"
          validation={{
            required: "This field is required",
            minLength: {
              value: 5,
              message: "Author length should be at least 5",
            },
            maxLength: {
              value: 100,
              message: "Author length can't be longer than 100",
            },
          }}
        />
        <Form.TextAreaInput
          labelText="Description"
          fieldName="description"
          validation={{
            required: "This field is required",
            minLength: {
              value: 20,
              message: "Description length should be at least 5",
            },
          }}
        />
        <Form.Input
          labelText="Publisher"
          fieldName="publisher"
          validation={{
            required: "This field is required",
            minLength: {
              value: 5,
              message: "Publisher length should be at least 5",
            },
            maxLength: {
              value: 100,
              message: "Publisher length can't be longer than 100",
            },
          }}
        />
        <Form.DateInput
          labelText="Publication date"
          fieldName="publicationDate"
          validation={{
            required: "This field is required",
          }}
        />
        <Form.CheckboxGroupInput
          labelText="Categories"
          fieldName="categories"
          validation={{
            required: "This field is required",
          }}
          options={categories.map((cat) => {
            return { label: cat.categoryName, value: cat.id };
          })}
        />
        <Form.Input
          labelText="Price"
          fieldName="price"
          validation={{
            required: "This field is required",
            min: {
              value: 0.01,
              message: "Price should be at least 0.01",
            },
            max: {
              value: 9999.99,
              message: "Price can't be greater than 9999.99",
            },
          }}
        />
        <div>
          <label>
            <input
              className="mr-2"
              type="checkbox"
              checked={hasDiscount}
              onChange={(e) => setHasDiscount(e.target.checked)}
            />
            Has discount
          </label>
        </div>
        {hasDiscount && (
          <Form.Input
            labelText="Discount percentage"
            fieldName="discountPercentage"
            validation={{
              required: "This field is required",
              min: {
                value: 1,
                message: "Discount percentage should be at least 1%",
              },
              max: {
                value: 100,
                message: "Discount percentage can't be greater than 100",
              },
            }}
          />
        )}
        {hasDiscount && (
          <Form.DateInput
            labelText="Discount end date"
            fieldName="discountEndDate"
            validation={{
              required: "This field is required",
            }}
          />
        )}
        {selectedBookType === PAPER_BOOK && (
          <Form.RadioButtonGroupInput
            labelText="Select cover type"
            fieldName="coverType"
            options={[
              { label: "Hardcover", value: "HARDCOVER" },
              { label: "Paperback", value: "PAPERBACK" },
            ]}
            validation={{
              required: "This field is required",
            }}
          />
        )}
        {selectedBookType === PAPER_BOOK && (
          <Form.Input
            labelText="ISBN"
            fieldName="isbn"
            validation={{
              required: "This field is required",
              minLength: {
                value: 13,
                message: "ISBN length should be exactly 13",
              },
              maxLength: {
                value: 13,
                message: "ISBN length should be exactly 13",
              },
              pattern: {
                value: /^\d*\.?\d+$/,
                message: "ISBN can contain only digits",
              },
            }}
          />
        )}
        {(selectedBookType === PAPER_BOOK || selectedBookType === EBOOK) && (
          <Form.Input
            labelText="Number of pages"
            fieldName="numOfPages"
            validation={{
              required: "This field is required",
              min: {
                value: 1,
                message: "Number of pages should be at least 1",
              },
              max: {
                value: 10000,
                message: "Number of pages can't be greater than 10000",
              },
            }}
          />
        )}
        {selectedBookType === PAPER_BOOK && (
          <label>
            <input
              className="mr-2"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Is available
          </label>
        )}
        {selectedBookType === AUDIOBOOK && (
          <Form.Input
            labelText="Narrator"
            fieldName="narrator"
            validation={{
              required: "This field is required",
              minLength: {
                value: 5,
                message: "Narrator length should be at least 5",
              },
              maxLength: {
                value: 100,
                message: "Narrator length can't be longer than 100",
              },
            }}
          />
        )}
        {selectedBookType === AUDIOBOOK && (
          <Form.Input
            labelText="Duration in seconds"
            fieldName="durationSeconds"
            validation={{
              required: "This field is required",
              min: {
                value: 1,
                message: "Duration should be at least 60",
              },
              max: {
                value: 360000,
                message: "Number of pages can't be greater than 360000",
              },
            }}
          />
        )}
        <div>
          <label className="block font-medium text-gray-600">
            Cover image file:
          </label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={(e) => setCoverImageFile(e.target.files[0])}
          />
        </div>
        {selectedBookType !== PAPER_BOOK && (
          <>
            <label className="block font-medium text-gray-600">
              Book file:
            </label>
            <input
              type="file"
              required
              accept={selectedBookType === EBOOK ? ".epub" : "audio/mp3"}
              onChange={(e) => setBookFile(e.target.files[0])}
            />
            <label className="block font-medium text-gray-600">
              Preview file:
            </label>
            <input
              type="file"
              required
              accept={selectedBookType === EBOOK ? ".epub" : "audio/mp3"}
              onChange={(e) => setPreviewFile(e.target.files[0])}
            />
          </>
        )}
      </Form>
    </div>
  );
}

export default AddBook;
