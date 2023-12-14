import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import axios from "../../util/axios";
import { PAPER_BOOK } from "../../constants/appConstants";

function OrderItem({ order, handleOpen }) {
  const { id, username, orderItems, orderDate, orderStatus } = order;

  const [selectedOrderStatus, setSelectedOrderStatus] = useState(orderStatus);
  const handleOrderStatusChange = async (newStatus) => {
    try {
      await axios.put(`/admin/orders/${id}?status=${newStatus}`);
      setSelectedOrderStatus(newStatus);
      toast.success("Order status changed successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <tr className="border">
      <td className="whitespace-nowrap border px-2">
        <button onClick={handleOpen} className="w-full underline">
          {id}
        </button>
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
      <td className="border px-6">{username}</td>
      <td className="border px-6">
        <select
          value={selectedOrderStatus}
          onChange={(e) => handleOrderStatusChange(e.target.value)}
        >
          <option value="Done">Done</option>
          <option value="Processing">Processing</option>
          <option value="Delivering">Delivering</option>
          <option value="Canceled">Canceled</option>
        </select>
      </td>
    </tr>
  );
}

export default OrderItem;
