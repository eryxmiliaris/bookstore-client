import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ModalWindow from "../components/ModalWindow";
import Spinner from "../components/Spinner";

import axios from "../util/axios";
import ErrorPage from "../components/ErrorPage";
import OrderHistoryItem from "../features/orders/OrderHistoryItem";

function OrderHistoryPage() {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`orders`],
    queryFn: async () => {
      const response = await axios.get(`/orders`);
      return response.data;
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [openedOrder, setOpenedOrder] = useState(null);
  const handleOpen = (index) => {
    setOpenedOrder(orders[index]);
    setIsOpen(true);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div>
      {orders.length > 0 ? (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Order Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Total Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Order Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {orders.map((order, index) => (
              <OrderHistoryItem
                key={order.id}
                order={order}
                handleOpen={() => handleOpen(index)}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="p-4 text-center text-2xl">
          You haven&apos;t made any orders yet!
        </p>
      )}

      {openedOrder && (
        <ModalWindow
          open={isOpen}
          onClose={() => setIsOpen(false)}
          width=" w-auto"
        >
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="whitespace-nowrap px-6 py-4">Order ID</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {openedOrder.id}
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4">Order Date</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {openedOrder.orderDate}
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4">Cart Price</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {openedOrder.cartPrice} PLN
                </td>
              </tr>
              {openedOrder.hasPaperBooks && (
                <>
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4">
                      Shipping Date
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {openedOrder.shippingDate}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4">
                      Shipping Price
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {openedOrder.shippingPrice} PLN
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4">
                      Receiver&apos;s full name:
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {openedOrder.addressUserFullName}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4">
                      Delivery address:
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {openedOrder.addressLocation}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4">
                      Receiver&apos;s phone number:
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {openedOrder.addressPhoneNumber}
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4">Total Price</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {openedOrder.totalPrice} PLN
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td className="whitespace-nowrap px-6 py-4">Order Status</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {openedOrder.orderStatus}
                </td>
              </tr>
            </tbody>
          </table>
        </ModalWindow>
      )}
    </div>
  );
}

export default OrderHistoryPage;
