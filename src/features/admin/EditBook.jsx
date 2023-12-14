import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";
import { useBook } from "../bookpage/useBook";
import { AUDIOBOOK, EBOOK } from "../../constants/appConstants";

import Spinner from "../../components/Spinner";
import Form from "../../components/Form";

function parseDate(input) {
  if (!input) return;
  if (input.includes(" ")) {
    let dateAndTime = input.split(" ");
    let dateParts = dateAndTime[0].split("-");
    let timeParts = dateAndTime[1].split(":");

    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(
      dateParts[0],
      dateParts[1] - 1, // Note: months are 0-based
      dateParts[2],
      timeParts[0],
      timeParts[1],
      timeParts[2],
    );
  } else {
    let parts = input.split("-");
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
}

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isAdmin, isLoading: isLoadingUser } = useAuth();

  const { book, isLoading: bookIsLoading } = useBook(id);

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

  const [selectedBookType, setSelectedBookType] = useState("Book");
  const [initialValues, setInitialValues] = useState(null);

  const [hasDiscount, setHasDiscount] = useState(false);

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async function (data) {
    const {
      isHidden,
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
      isAvailable,
      numOfPages,
      narrator,
      durationSeconds,
    } = data;
    let formData;

    setIsLoading(true);

    switch (selectedBookType) {
      case "Book":
        try {
          await axios.put(`/admin/books/${id}`, {
            title,
            author,
            description,
            publicationDate,
            categories,
          });
          toast.success("Book information has been updated successfully");
        } catch (error) {
          toast.error(error.response.data.message);
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
        break;
      default:
        formData = new FormData();
        formData.append("coverImageFile", coverImageFile);
        formData.append(
          "newPaperBook",
          JSON.stringify({
            id: selectedBookType === "0" ? null : selectedBookType,
            isHidden: isHidden || false,
            price,
            hasDiscount: hasDiscount || false,
            discountPercentage,
            discountEndDate,
            publisher,
            coverType,
            isbn,
            isAvailable: isAvailable || false,
            numOfPages,
          }),
        );
        try {
          await axios.put(`/admin/books/${id}/paperBook`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Paper book has been successfully added/updated");
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
          "newEbook",
          JSON.stringify({
            isHidden: isHidden || false,
            price,
            hasDiscount: hasDiscount || false,
            discountPercentage,
            discountEndDate,
            publisher,
            numOfPages,
          }),
        );
        try {
          await axios.put(`/admin/books/${id}/ebook`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Ebook has been successfully added/updated");
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
          "newAudiobook",
          JSON.stringify({
            isHidden: isHidden || false,
            price,
            hasDiscount: hasDiscount || false,
            discountPercentage,
            discountEndDate,
            publisher,
            narrator,
            durationSeconds,
          }),
        );
        try {
          await axios.put(`/admin/books/${id}/audiobook`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Audiobook has been successfully added/updated");
        } catch (error) {
          toast.error(error.response.data.message);
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
        break;
    }
    queryClient.invalidateQueries([`book${id}`]);
  };

  useEffect(
    function () {
      if (!bookIsLoading && !categoriesIsLoading && initialValues === null) {
        setInitialValues({
          ...book,
          publicationDate: parseDate(book.publicationDate),
          categories: categories
            .filter((cat) => book.categories.includes(cat.categoryName))
            .map((cat) => cat.id),
        });
      }
    },
    [
      bookIsLoading,
      initialValues,
      setInitialValues,
      book,
      categories,
      categoriesIsLoading,
    ],
  );

  if (isLoadingUser || bookIsLoading || categoriesIsLoading) {
    return <Spinner />;
  }

  const handleSelectBookType = function (e) {
    const bookType = e.target.value;
    let paperBook;
    setSelectedBookType(bookType);

    switch (bookType) {
      case "Book":
        setInitialValues({
          ...book,
          publicationDate: parseDate(book.publicationDate),
          categories: categories
            .filter((cat) => book.categories.includes(cat.categoryName))
            .map((cat) => cat.id),
        });
        break;

      default:
        paperBook = book.paperBooks.filter(
          (pb) => pb.id === Number(e.target.value),
        )[0];
        setInitialValues({
          ...paperBook,
          discountEndDate: parseDate(paperBook?.discountEndDate),
        });
        setHasDiscount(paperBook?.hasDiscount || false);
        break;

      case EBOOK:
        console.log(book.ebook);
        setInitialValues({
          ...book?.ebook,
          discountEndDate: parseDate(book.ebook?.discountEndDate),
        });
        setHasDiscount(book.ebook?.hasDiscount || false);
        break;

      case AUDIOBOOK:
        setInitialValues({
          ...book?.audiobook,
          discountEndDate: parseDate(book.audiobook?.discountEndDate),
        });
        setHasDiscount(book.audiobook?.hasDiscount || false);
        break;
    }
    setCoverImageFile(null);
    setBookFile(null);
    setPreviewFile(null);
  };

  return (
    <div className="container mx-auto pb-10 pt-2">
      <h1 className="my-4 text-center text-2xl font-semibold">Edit book</h1>
      <div className="mb-2">
        <p className="block font-medium text-gray-600">Select book type:</p>
        <select
          className="mt-1 w-full rounded border p-2"
          value={selectedBookType}
          onChange={handleSelectBookType}
        >
          <option value="Book">General book information</option>
          {book.paperBooks.length > 0 &&
            book.paperBooks.map((pb) => (
              <option key={pb.id} value={pb.id}>
                Paper book {pb.id}
              </option>
            ))}
          <option value={0}>New paper book</option>
          <option value={EBOOK}>Ebook</option>
          <option value={AUDIOBOOK}>Audiobook</option>
        </select>
      </div>

      <Form
        onSubmit={onSubmit}
        submitButtonText="Update book"
        isLoading={isLoading}
        submitButtonLoadingText="Adding..."
        initialValues={initialValues}
        formKey={selectedBookType}
      >
        {selectedBookType !== "Book" && (
          <Form.CheckboxInput labelText="Hidden" fieldName="isHidden" />
        )}
        {selectedBookType === "Book" && (
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
        )}
        {selectedBookType === "Book" && (
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
        )}
        {selectedBookType === "Book" && (
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
        )}
        {selectedBookType !== "Book" && (
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
        )}
        {selectedBookType === "Book" && (
          <Form.DateInput
            labelText="Publication date"
            fieldName="publicationDate"
          />
        )}
        {selectedBookType === "Book" && (
          <Form.CheckboxGroupInput
            labelText="Categories"
            fieldName="categories"
            options={categories.map((cat) => {
              return { label: cat.categoryName, value: cat.id };
            })}
          />
        )}
        {selectedBookType !== "Book" && (
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
        )}
        {selectedBookType !== "Book" && (
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
        )}
        {selectedBookType !== "Book" && hasDiscount && (
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
        {selectedBookType !== "Book" && hasDiscount && (
          <Form.DateInput
            labelText="Discount end date"
            fieldName="discountEndDate"
          />
        )}
        {(!isNaN(selectedBookType) || selectedBookType === EBOOK) && (
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
        {!isNaN(selectedBookType) && (
          <Form.RadioButtonGroupInput
            labelText="Select cover type"
            fieldName="coverType"
            options={[
              { label: "Hardcover", value: "HARDCOVER" },
              { label: "Paperback", value: "PAPERBACK" },
            ]}
          />
        )}
        {!isNaN(selectedBookType) && (
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
        {!isNaN(selectedBookType) && (
          <Form.CheckboxInput
            labelText="Is available"
            fieldName="isAvailable"
          />
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
        {selectedBookType !== "Book" && (
          <div>
            <label className="block font-medium text-gray-600">
              New cover image file:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files[0])}
            />
          </div>
        )}
        {(selectedBookType === EBOOK || selectedBookType === AUDIOBOOK) && (
          <>
            <label className="block font-medium text-gray-600">
              New book file:
            </label>
            <input
              type="file"
              accept={selectedBookType === EBOOK ? ".epub" : "audio/mp3"}
              onChange={(e) => setBookFile(e.target.files[0])}
            />
            <label className="block font-medium text-gray-600">
              New preview file:
            </label>
            <input
              type="file"
              accept={selectedBookType === EBOOK ? ".epub" : "audio/mp3"}
              onChange={(e) => setPreviewFile(e.target.files[0])}
            />
          </>
        )}
      </Form>
    </div>
  );
}

export default EditBook;
