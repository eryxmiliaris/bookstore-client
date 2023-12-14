import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";

import Button from "../../components/Button";
import ModalWindow from "../../components/ModalWindow";
import CartItem from "./CartItem";
import Total from "./Total";
import AddressItem from "../profile/AddressItem";
import { useLocalCart } from "./LocalCartContext";

function CartBody({
  cart: userCart,
  setOrderState,
  addresses,
  shippingMethods,
  orderState,
}) {
  const [cart, setCart] = useState(userCart);
  const { localCart, clearLocalCart } = useLocalCart();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [combineCartsOpen, setCombineCartsOpen] = useState(false);
  const combineCarts = async () => {
    const cartItems = localCart.cartItems;
    for (let i = 0; i < cartItems.length; i++) {
      try {
        await axios.post("/cart", {
          bookId: cartItems[i].bookId,
          bookType: cartItems[i].bookType,
          paperBookId: cartItems[i].paperBookId,
        });
      } catch (e) {
        console.log(e);
      }
    }
    toast.success("Carts were successfully combined");
    setCombineCartsOpen(false);
    queryClient.invalidateQueries(["cart"]);
    clearLocalCart();
  };

  useEffect(() => {
    if (user === null && cart === undefined) {
      setCart(localCart);
    } else if (user !== null) {
      setCart(userCart);
    }
    if (user !== null && localCart.cartItems.length > 0) {
      setCombineCartsOpen(true);
    }
  }, [user, cart, setCart, userCart, localCart]);

  const { mutate: updateAddress, isLoading: isUpdatingAddress } = useMutation({
    mutationFn: (addressId) => {
      return axios.put(`/cart/address?addressId=${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      queryClient.invalidateQueries(["addresses"]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const { mutate: updateShippingMethod, isLoading: isUpdatingShippingMethod } =
    useMutation({
      mutationFn: (shippingMethodId) => {
        return axios.put(
          `/cart/shippingMethod?shippingMethodId=${shippingMethodId}`,
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["cart"]);
        queryClient.invalidateQueries(["shippingMethods"]);
      },
      onError: (err) => toast.error(err.response.data.message),
    });

  const { mutate: order, isLoading: isOrdering } = useMutation({
    mutationFn: () => {
      return axios.post(`/orders`);
    },
    onSuccess: (response) => {
      if (response.data.success === false) {
        window.location.href = response.data.message;
      } else {
        navigate(`/profile/orders`);
        queryClient.invalidateQueries(["cart"]);
      }
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return (
    <div className="flex flex-col items-start justify-between lg:flex-row lg:gap-4">
      <ul className="flex w-full flex-col items-center">
        {cart?.cartItems.length > 0 ? (
          cart?.cartItems.map((cartItem) => (
            <CartItem
              key={cartItem.id}
              cartItem={cartItem}
              orderState={orderState}
              setCart={setCart}
            />
          ))
        ) : (
          <p className="p-5 text-2xl">Your cart is empty!</p>
        )}
      </ul>

      <div className="w-full lg:w-2/5">
        {user && cart.hasPaperBooks && (
          <>
            <div className="my-4 flex w-full flex-col justify-between border border-violet-300 bg-violet-200 px-4 py-4">
              {addresses?.length > 0 ? (
                <div className="flex flex-col gap-2 px-2">
                  {orderState === "cart" ? (
                    <select
                      disabled={isUpdatingAddress}
                      value={cart?.address?.id || ""}
                      onChange={(e) => updateAddress(e.target.value)}
                    >
                      <option value={null} disabled={cart.address}>
                        Choose address
                      </option>
                      {addresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          Address &quot;{a.name}&quot;
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-lg font-semibold">Delivery address:</p>
                  )}
                  {cart.address && <AddressItem address={cart.address} />}
                </div>
              ) : (
                <>
                  {orderState === "cart" && (
                    <div className="flex flex-col gap-2">
                      <p className="text-center">
                        You don&apos;t have any saved addresses
                      </p>
                      <Link to="/profile">
                        <Button>Add new address</Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="my-4 flex w-full flex-col justify-between border border-violet-300 bg-violet-200 px-4 py-4">
              <div className="flex flex-col gap-2 px-2">
                {orderState === "cart" ? (
                  <select
                    disabled={isUpdatingShippingMethod}
                    value={cart?.shippingMethod?.id}
                    onChange={(e) => updateShippingMethod(e.target.value)}
                  >
                    {shippingMethods.map((sm) => (
                      <option key={sm.id} value={sm.id}>
                        {sm.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg font-semibold">Shipping method:</p>
                )}
                <div className="flex flex-col gap-2">
                  <div>
                    <p>
                      <span className="font-medium">Name: </span>
                      {cart.shippingMethod.name}
                    </p>
                    <p>
                      <span className="font-medium">Price: </span>
                      {cart.shippingMethod.price} PLN
                    </p>
                    <p>
                      <span className="font-medium">Shipping time: </span>
                      {cart.shippingMethod.durationDays} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Total
          totalPrice={cart?.totalPrice}
          hasPaperBooks={cart?.hasPaperBooks}
          hasPromoCode={cart?.hasPromoCode}
          promoCode={cart?.promoCode}
          totalPriceWithPromoCode={cart?.totalPriceWithPromoCode}
          setOrderState={setOrderState}
          address={cart?.address}
          cartItems={cart?.cartItems}
          orderState={orderState}
          shippingPrice={cart?.shippingMethod?.price}
        />

        {orderState === "confirmation" && (
          <>
            <Button
              onClick={order}
              disabled={isOrdering}
              disabledText="Processing order..."
              className="mt-2"
            >
              Order
            </Button>
            <Button
              onClick={() => setOrderState("cart")}
              type="red"
              className="mt-4"
            >
              Go back
            </Button>
          </>
        )}
      </div>

      <ModalWindow disableEscapeKeyDown open={combineCartsOpen}>
        <p>Would you like to combine your cart with items from local cart?</p>
        <Button onClick={() => combineCarts()}>Yes!</Button>
        <Button
          type="red"
          onClick={() => {
            clearLocalCart();
            setCombineCartsOpen(false);
          }}
        >
          No, forget about it
        </Button>
      </ModalWindow>
    </div>
  );
}

export default CartBody;
