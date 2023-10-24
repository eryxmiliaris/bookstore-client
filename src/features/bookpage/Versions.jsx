import { useSearchParams } from "react-router-dom";

function Versions({
  bookType,
  paperBooks,
  paperBookId,
  setPaperBookId,
  ebook,
  audioBook,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const versionButtonStyle = `flex w-full flex-col items-center border border-violet-400 bg-violet-200 px-4 py-2 hover:bg-violet-300`;
  const versionActiveButtonStyle = `flex w-full flex-col items-center border-2 border-violet-500 bg-violet-400 px-4 py-2`;
  const onVersionButtonClick = function (newBookType) {
    if (newBookType === "Paper book") {
      setSearchParams({ bookType: newBookType, paperBookId: paperBooks[0].id });
    } else {
      setSearchParams({ bookType: newBookType });
    }
  };
  const versionButton = function (name, price) {
    return (
      <button
        onClick={() => onVersionButtonClick(name)}
        className={
          bookType === name ? versionActiveButtonStyle : versionButtonStyle
        }
      >
        <span className={bookType === name ? "font-bold" : ""}>{name}</span>
        <span className="font-bold">{price}</span>
      </button>
    );
  };
  const versionButtonDiscount = function (
    name,
    price,
    priceWithDiscount,
    discountPercentage,
    discountEndDate,
  ) {
    return (
      <button
        onClick={() => onVersionButtonClick(name)}
        className={
          bookType === name ? versionActiveButtonStyle : versionButtonStyle
        }
      >
        <span className={bookType === name ? "font-bold" : ""}>{name}</span>
        <span className="line-through">{price}</span>
        <span className="font-bold">
          {priceWithDiscount} (save {discountPercentage}%)
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

  return (
    <div className="w-full sm:w-1/3">
      <p className="mb-4 text-3xl font-semibold sm:text-center">Versions</p>

      <div className="flex flex-col justify-center space-y-2">
        {paperBooks?.length > 0 &&
          (paperBooks[paperBookId].hasDiscount
            ? versionButtonDiscount(
                "Paper book",
                paperBooks[paperBookId].price,
                paperBooks[paperBookId].priceWithDiscount,
                paperBooks[paperBookId].discountPercentage,
                paperBooks[paperBookId].discountEndDate,
              )
            : versionButton("Paper book", paperBooks[paperBookId].price))}
        {ebook &&
          (ebook.hasDiscount
            ? versionButtonDiscount(
                "Ebook",
                ebook.price,
                ebook.priceWithDiscount,
                ebook.discountPercentage,
                ebook.discountEndDate,
              )
            : versionButton("Ebook", ebook.price))}
        {audioBook &&
          (audioBook.hasDiscount
            ? versionButtonDiscount(
                "Audiobook",
                audioBook.price,
                audioBook.priceWithDiscount,
                audioBook.discountPercentage,
                audioBook.discountEndDate,
              )
            : versionButton("Audiobook", audioBook.price))}
      </div>

      <div className="mt-4">
        {bookType === "Paper book" &&
          paperBooks.map((pb, i) => (
            <label
              key={i}
              className="mb-2 flex items-center justify-center border border-violet-400 p-2"
            >
              <input
                name="paperbook"
                type="radio"
                checked={paperBookId === i}
                value={i}
                onChange={() => {
                  setPaperBookId(i);
                  setSearchParams({ bookType: "Paper book", paperBookId: i });
                }}
                className="h-4 w-4"
              />
              {pb.hasDiscount ? (
                <span className="ml-2 font-medium">
                  {pb.coverType},{" "}
                  <span className="line-through">{pb.price}</span>,{" "}
                  {pb.priceWithDiscount}
                </span>
              ) : (
                <span className="ml-2 font-medium">
                  {pb.coverType}, {pb.price}
                </span>
              )}
            </label>
          ))}

        {bookType === "Ebook" && (
          <button className="mr-2 w-full bg-violet-500 px-4 py-2 text-white">
            Read the excerpt
          </button>
        )}

        {bookType === "Audiobook" && (
          <button className="mr-2 w-full bg-violet-500 px-4 py-2 text-white">
            Listen to the fragment
          </button>
        )}
      </div>
    </div>
  );
}

export default Versions;
