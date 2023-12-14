import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";

import Button from "../../components/Button";
import { useLocalCart } from "./LocalCartContext";

function Total({
  totalPrice,
  hasPaperBooks,
  hasPromoCode,
  promoCode: cartPromoCode,
  totalPriceWithPromoCode,
  setOrderState,
  address,
  cartItems,
  orderState,
  shippingPrice,
}) {
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { localCart } = useLocalCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState(cartPromoCode || "");
  const { mutate: applyPromoCode, isLoading: isApplying } = useMutation({
    mutationFn: ({ promoCode }) => {
      return axios.post(`cart/promoCode?promoCode=${promoCode}`);
    },
    onSuccess: () => {
      toast.success("Promo code has been successfully applied!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const handleApplyPromoCode = () => {
    if (!user) {
      navigate("/signin");
    }
    if (promoCode !== "") {
      applyPromoCode({ promoCode });
    }
  };

  const { mutate: removePromoCode, isLoading: isRemoving } = useMutation({
    mutationFn: () => {
      return axios.delete("/cart/promoCode");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Promo code has been successfully removed!");
      setPromoCode("");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const handleProceedWithOrder = () => {
    if (!user) {
      navigate("/signin");
    }
    if (hasPaperBooks && address === null) {
      toast.error("Choose or add an address!");
    } else {
      setOrderState("confirmation");
    }
  };

  return (
    <div
      className={`my-4 flex w-full flex-col justify-between border border-violet-300 bg-violet-200 px-4 py-4`}
    >
      <div className="flex w-full justify-between">
        <p>Total cart cost: </p>
        {user ? (
          <p>{totalPrice && totalPrice.toFixed(2)} PLN</p>
        ) : (
          <p>{localCart.totalPrice} PLN</p>
        )}
      </div>
      <div className="flex w-full justify-between">
        <p>You're saving:</p>
        <p>
          {hasPromoCode ? (totalPrice - totalPriceWithPromoCode).toFixed(2) : 0}{" "}
          PLN
        </p>
      </div>

      {hasPaperBooks && orderState === "confirmation" && (
        <div className="flex w-full justify-between">
          <p>Shipping price: </p>
          <p>{shippingPrice} PLN</p>
        </div>
      )}

      <div className="flex w-full items-center justify-between">
        <p>To be paid:</p>
        {user ? (
          orderState === "cart" ? (
            <p className="text-lg font-semibold">
              {hasPromoCode
                ? totalPriceWithPromoCode
                : totalPrice && totalPrice.toFixed(2)}{" "}
              PLN
            </p>
          ) : (
            <p className="text-lg font-semibold">
              {(
                (hasPromoCode ? totalPriceWithPromoCode : totalPrice) +
                (hasPaperBooks ? shippingPrice : 0)
              ).toFixed(2)}{" "}
              PLN
            </p>
          )
        ) : (
          <p>{localCart.totalPrice} PLN</p>
        )}
      </div>

      {orderState === "cart" && (
        <>
          <p>Input promocode:</p>
          <input
            className="w-full p-2"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Button
              className="w-full"
              disabled={isApplying}
              onClick={handleApplyPromoCode}
            >
              Apply
            </Button>
            {hasPromoCode && (
              <Button
                type="red"
                className="w-full"
                disabled={isRemoving}
                disabledText="Removing..."
                onClick={removePromoCode}
              >
                Remove
              </Button>
            )}
          </div>
          <Button
            type="green"
            disabled={!cartItems?.length > 0}
            onClick={handleProceedWithOrder}
            className="mt-2"
          >
            Proceed with order
          </Button>
        </>
      )}
    </div>
  );
}

export default Total;
