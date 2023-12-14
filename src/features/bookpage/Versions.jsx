import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { AUDIOBOOK, EBOOK, PAPER_BOOK } from "../../constants/appConstants";

import Button from "../../components/Button";

const versionButtonStyle = `flex w-full flex-col items-center border border-violet-400 bg-violet-200 px-4 py-2 hover:bg-violet-300`;
const versionActiveButtonStyle = `flex w-full flex-col items-center border-2 border-violet-500 bg-violet-400 px-4 py-2`;

function Versions({
  bookId,
  bookType,
  paperBooks,
  paperBookId,
  setPaperBookId,
  ebook,
  audiobook,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { isAdmin } = useAuth();

  const navigate = useNavigate();

  const onVersionButtonClick = (newBookType) => {
    if (newBookType === PAPER_BOOK) {
      setSearchParams({ bookType: newBookType, paperBookId });
    } else {
      setSearchParams({ bookType: newBookType });
    }
  };

  const versionButton = (name, price) => {
    return (
      <button
        onClick={() => onVersionButtonClick(name)}
        className={
          bookType === name ? versionActiveButtonStyle : versionButtonStyle
        }
      >
        <span className={bookType === name ? "font-bold" : ""}>{name}</span>
        <span className="font-bold">{price} PLN</span>
      </button>
    );
  };

  const versionButtonDiscount = (
    name,
    price,
    priceWithDiscount,
    discountPercentage,
    discountEndDate,
  ) => {
    return (
      <button
        onClick={() => onVersionButtonClick(name)}
        className={
          bookType === name ? versionActiveButtonStyle : versionButtonStyle
        }
      >
        <span className={bookType === name ? "font-bold" : ""}>{name}</span>
        <span className="line-through">{price} PLN</span>
        <span className="font-bold">
          {priceWithDiscount} PLN (save {discountPercentage}%)
        </span>
        <span className="italic">
          Ends{" "}
          {new Date(discountEndDate).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </button>
    );
  };

  const paperBook =
    paperBooks?.filter((pb) => pb.id === paperBookId)[0] || paperBooks[0];
  if (!paperBookId) paperBookId = paperBooks[0]?.id;

  return (
    <div className="w-full sm:w-1/3">
      {isAdmin && (
        <Button
          className="mb-5"
          onClick={() => navigate(`/admin/editBook/${bookId}`)}
        >
          Edit book information
        </Button>
      )}

      <p className="mb-4 text-3xl font-semibold sm:text-center">Versions</p>
      <div className="flex flex-col justify-center space-y-2">
        {paperBooks?.length > 0 &&
          (paperBook.hasDiscount
            ? versionButtonDiscount(
                PAPER_BOOK,
                paperBook.price,
                paperBook.priceWithDiscount,
                paperBook.discountPercentage,
                paperBook.discountEndDate,
              )
            : versionButton(PAPER_BOOK, paperBook.price))}
        {ebook &&
          (ebook.hasDiscount
            ? versionButtonDiscount(
                EBOOK,
                ebook.price,
                ebook.priceWithDiscount,
                ebook.discountPercentage,
                ebook.discountEndDate,
              )
            : versionButton(EBOOK, ebook.price))}
        {audiobook &&
          (audiobook.hasDiscount
            ? versionButtonDiscount(
                AUDIOBOOK,
                audiobook.price,
                audiobook.priceWithDiscount,
                audiobook.discountPercentage,
                audiobook.discountEndDate,
              )
            : versionButton(AUDIOBOOK, audiobook.price))}
      </div>

      <div className="mt-4">
        {bookType === PAPER_BOOK &&
          paperBooks.map((pb) => (
            <label
              key={pb.id}
              className={`mb-2 flex items-center justify-center border border-violet-400 p-2 text-center ${
                pb.isAvailable ? "" : "line-through"
              }`}
            >
              <input
                name="paperbook"
                type="radio"
                checked={pb.id === paperBookId}
                value={pb.id}
                onChange={() => {
                  setPaperBookId(pb.id);
                  setSearchParams({
                    bookType: PAPER_BOOK,
                    paperBookId: pb.id,
                  });
                }}
                className="h-4 w-4"
              />
              {pb.hasDiscount ? (
                <span className="ml-2 font-medium">
                  {pb.coverType},{" "}
                  <span className="line-through">{pb.price} PLN</span>,{" "}
                  {pb.priceWithDiscount} PLN
                </span>
              ) : (
                <span className="ml-2 font-medium">
                  {pb.coverType}, {pb.price} PLN
                </span>
              )}
            </label>
          ))}

        {bookType === EBOOK && (
          <Button
            onClick={() =>
              window.location.assign(`/reader/${bookId}?preview=true`)
            }
          >
            Read the excerpt
          </Button>
        )}

        {bookType === AUDIOBOOK && (
          <Button
            onClick={() =>
              window.location.assign(`/player/${bookId}?preview=true`)
            }
          >
            Listen to the fragment
          </Button>
        )}
      </div>
    </div>
  );
}

export default Versions;
