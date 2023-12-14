import { Link } from "react-router-dom";
import { PAPER_BOOK } from "../../constants/appConstants";

function OrderHistoryItem({ order, handleOpen }) {
  const { id, orderItems, orderDate, hasPaperBooks, totalPrice, orderStatus } =
    order;

  return (
    <tr className="border">
      <td className="whitespace-nowrap border px-2">
        {hasPaperBooks ? (
          <button onClick={handleOpen} className="w-full underline">
            {id}
          </button>
        ) : (
          <p className="w-full text-center">{id}</p>
        )}
      </td>
      <td className="flex flex-col gap-1 px-6 py-4">
        {orderItems.map((orderItem) => (
          <Link
            to={`/books/${orderItem.book.id}?bookType=${orderItem.bookType}&paperBookId=${orderItem?.paperBookId}`}
            key={orderItem.id}
          >
            {orderItem.book.title},{" "}
            <span className="italic text-gray-500">
              {orderItem.bookType}
              {`${
                orderItem.bookType === PAPER_BOOK
                  ? `, ${orderItem.quantity}x`
                  : ""
              }`}
            </span>
          </Link>
        ))}
      </td>
      <td className="border px-6">{orderDate}</td>
      <td className="border px-6">{totalPrice} PLN</td>
      <td className="border px-6">{orderStatus}</td>
    </tr>
  );
}

export default OrderHistoryItem;
