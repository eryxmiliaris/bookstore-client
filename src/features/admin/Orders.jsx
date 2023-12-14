import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";

import ModalWindow from "../../components/ModalWindow";
import Spinner from "../../components/Spinner";
import OrderItem from "./OrderItem";

function Orders() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isAdmin, userIsLoading } = useAuth();

  useEffect(() => {
    if (!userIsLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, userIsLoading, navigate]);

  const [pageNumber, setPageNumber] = useState(0);
  const handlePageChange = function (event, value) {
    setPageNumber(value - 1);
    queryClient.invalidateQueries(["orders"]);
  };

  const [findById, setFindById] = useState("");

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: [`orders`, pageNumber, findById],
    queryFn: async () => {
      const response = await axios.get(
        `/admin/orders?pageNumber=${pageNumber}${
          findById !== null ? `&id=${findById}` : ""
        }`,
      );
      return response.data;
    },
  });

  const orders = orderResponse?.content;

  const [isOpen, setIsOpen] = useState(false);
  const [openedOrder, setOpenedOrder] = useState(null);
  const handleOpen = function (index) {
    setOpenedOrder(orders[index]);
    setIsOpen(true);
  };

  return (
    <div className="my-5 space-y-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={findById}
          onChange={(e) => setFindById(e.target.value)}
          placeholder="Find by id..."
          className="w-full rounded border p-2 focus:border-blue-300 focus:outline-none focus:ring"
        />
        {findById && (
          <span
            className="absolute inset-y-0 right-10 flex cursor-pointer items-center pr-3"
            onClick={() => setFindById("")}
          >
            <ClearIcon />
          </span>
        )}
        <span className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
          <SearchIcon />
        </span>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
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
                  Order by
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Order Status
                </th>
              </tr>
            </thead>
            {orders.length > 0 ? (
              <tbody className="bg-white">
                {orders.map((order, index) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    handleOpen={() => handleOpen(index)}
                  />
                ))}
              </tbody>
            ) : (
              "order list is empty"
            )}
          </table>

          <div className="my-10 flex items-center justify-center">
            <Pagination
              count={
                orderResponse.totalPages === 0 ? 1 : orderResponse.totalPages
              }
              page={orderResponse.pageNumber + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
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
                <td className="whitespace-nowrap px-6 py-4">Payment ID</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {openedOrder.paymentId}
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

export default Orders;
