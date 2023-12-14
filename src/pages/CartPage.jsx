import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Divider } from "@mui/material";

import axios from "../util/axios";
import { useAuth } from "../features/auth/AuthContext";
import { useAddresses } from "../features/profile/useAddresses";

import Spinner from "../components/Spinner";
import CartBody from "../features/cart/CartBody";
import ErrorPage from "../components/ErrorPage";

function CartPage() {
  const [orderState, setOrderState] = useState("cart");

  const { user } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();

  const {
    data: cart,
    isLoading: isLoadingCart,
    error: cartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async function () {
      const response = await axios.get("/cart");
      return response.data;
    },
  });

  const {
    addresses,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useAddresses();

  const {
    data: shippingMethods,
    isLoading: shippingMethodsIsLoading,
    error: shippingMethodsError,
  } = useQuery({
    queryKey: [`shippingMethods`],
    queryFn: async () => {
      const response = await axios.get(`/cart/shippingMethod`);
      return response.data;
    },
  });

  useEffect(
    function () {
      if (user) {
        axios.get("/orders/payment/check").then((res) => {
          if (res.data.success === true) {
            navigate("/profile/orders");
            queryClient.invalidateQueries(["cart"]);
            queryClient.invalidateQueries(["addresses"]);
            queryClient.invalidateQueries(["shippingMethods"]);
            queryClient.invalidateQueries(["orders"]);
          }
        });
        if (searchParams.get("orderState") === "paymentSuccess") {
          axios
            .post("/orders")
            .then((res) => {
              if (res.data.success === true) {
                navigate("/profile/orders");
                queryClient.invalidateQueries(["cart"]);
                queryClient.invalidateQueries(["addresses"]);
                queryClient.invalidateQueries(["shippingMethods"]);
                queryClient.invalidateQueries(["orders"]);
              }
            })
            .catch((e) => {
              console.error(e);
            });
        }
      }
    },
    [navigate, queryClient, searchParams, user],
  );

  if (isLoadingCart || isLoadingAddresses || shippingMethodsIsLoading) {
    return <Spinner />;
  }

  if (cartError || addressesError || shippingMethodsError) {
    return (
      <ErrorPage error={cartError || addressesError || shippingMethodsError} />
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <p
          className={`${
            orderState === "cart" ? "block" : "hidden"
          } text-4xl font-semibold sm:block ${
            orderState === "cart" ? "" : "text-gray-500"
          } sm:text-3xl lg:text-4xl`}
        >
          Cart
        </p>
        <p
          className={`${
            orderState === "confirmation" ? "block" : "hidden"
          } text-4xl font-semibold sm:block ${
            orderState === "confirmation" ? "" : "text-gray-500"
          } ml-16 sm:text-3xl lg:text-4xl`}
        >
          Confirmation
        </p>
        <p
          className={`${
            orderState === "paymentSuccess" ? "block" : "hidden"
          } text-4xl font-semibold sm:block ${
            orderState === "paymentSuccess" ? "" : "text-gray-500"
          } ml-16 sm:text-3xl lg:text-4xl`}
        >
          Payment
        </p>
      </div>

      <Divider className="py-1" sx={{ borderBottomWidth: 2 }} />

      {searchParams.get("orderState") === "paymentSuccess" ? (
        <Spinner />
      ) : (
        <>
          <CartBody
            cart={cart}
            setOrderState={setOrderState}
            addresses={addresses}
            shippingMethods={shippingMethods}
            orderState={orderState}
          />
        </>
      )}
    </div>
  );
}

export default CartPage;
