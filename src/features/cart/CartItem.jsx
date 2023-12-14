import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Divider } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import axios from "../../util/axios";
import { useAuth } from "../auth/AuthContext";
import { useBook } from "../bookpage/useBook";
import { useLocalCart } from "./LocalCartContext";
import { API_BASE_URL, PAPER_BOOK } from "../../constants/appConstants";

import ModalWindow from "../../components/ModalWindow";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

const re = /^[0-9\b]+$/;

function CartItem({ cartItem, orderState, setCart }) {
  const {
    id: cartItemId,
    bookId,
    bookType,
    paperBookId,
    price,
    quantity,
    hasDiscount,
    priceWithDiscount,
  } = cartItem;

  const { localCart, removeItemFromLocalCart, updateLocalCartQuantity } =
    useLocalCart();

  const { book, isLoading } = useBook(bookId);

  const queryClient = useQueryClient();

  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate: updateQuantity, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, newQuantity }) => {
      return axios.put(`/cart/${id}?newQuantity=${newQuantity}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const [bookQuantity, setBookQuantity] = useState(Number(quantity));
  const handleQuantityChange = (newQuantity) => {
    if (
      newQuantity !== "" &&
      re.test(newQuantity) &&
      Number(newQuantity) > 0 &&
      Number(newQuantity) < 100
    ) {
      if (!user) {
        updateLocalCartQuantity(cartItemId, newQuantity);
      } else {
        updateQuantity({
          id: cartItemId,
          newQuantity,
        });
      }
      setBookQuantity(newQuantity);
    } else {
      setBookQuantity(quantity);
    }
  };
  const handleQuantityKeyDown = (e) => {
    if (e.key === "Enter") {
      handleQuantityChange(e.target.value);
    }
  };
  const handleMinusClick = () => {
    if (bookQuantity > 1) {
      handleQuantityChange(bookQuantity - 1);
    }
  };
  const handlePlusClick = () => {
    if (bookQuantity < 100) {
      handleQuantityChange(bookQuantity + 1);
    }
  };

  const [removeFromCartOpen, setRemoveFromCartOpen] = useState(false);
  const { mutate: removeFromCart, isLoading: isRemoving } = useMutation({
    mutationFn: (variables) => {
      const { cartItemId } = variables;
      return axios.delete(`/cart/${cartItemId}`);
    },
    onSuccess: () => {
      toast.success("Book has been successfully removed from your cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });
  const handleRemoveFromCart = function () {
    setRemoveFromCartOpen(false);
    if (!user) {
      removeItemFromLocalCart(cartItemId);
      setCart(localCart);
      toast.success("Book has been successfully removed from your cart!");
    } else {
      removeFromCart({ cartItemId });
    }
  };

  const { mutate: moveToWishlist, isLoading: isMoving } = useMutation({
    mutationFn: ({ bookId, bookType, paperBookId, cartItemId }) => {
      return axios.post("/cart/moveToWishlist", {
        bookId,
        bookType,
        paperBookId,
        cartItemId,
      });
    },
    onSuccess: () => {
      toast.success("Book has been successfully moved to wishlist!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const handleMoveToWishlist = function () {
    if (!user) {
      navigate("/signin");
    } else {
      moveToWishlist({ bookId, bookType, paperBookId, cartItemId });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const { title, author, rating, description, numOfReviews } = book;

  return (
    <li className="my-4 flex w-full flex-col items-center justify-between gap-3 border border-violet-300 bg-violet-200 py-4 sm:flex-row sm:items-start">
      <div>
        <Link to={`/books/${bookId}?bookType=${bookType}`}>
          <img
            src={`${API_BASE_URL}/books/${bookId}/coverImage?bookType=${bookType}&paperBookId=${
              paperBookId || 0
            }`}
            alt={title}
            className={`max-h-[250px] max-w-[150px] sm:max-h-[300px] sm:max-w-[200px] sm:p-4 ${
              bookType === PAPER_BOOK &&
              !book.paperBooks.filter((pb) => pb.id === paperBookId)[0]
                ?.isAvailable
                ? "grayscale"
                : ""
            }`}
          />
        </Link>
      </div>

      <div className="mt-0 flex w-full flex-col items-center justify-center gap-3 px-4 sm:mt-4 sm:items-start sm:px-0 sm:pr-12">
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center justify-between gap-4 sm:items-start">
            <p className="text-gray-500">{bookType}</p>
            <Link to={`/books/${bookId}?bookType=${bookType}`}>
              <p className="text-2xl font-semibold">{title}</p>
            </Link>
            <p className="text-gray-600">{author}</p>
            <p>
              {rating} ({numOfReviews})
            </p>
            {orderState === "confirmation" && (
              <p>{description.slice(0, 200) + "..."}</p>
            )}
          </div>

          <Divider sx={{ borderBottomWidth: 2 }} />

          <div className="flex flex-col items-center whitespace-nowrap sm:items-end sm:gap-2">
            <p
              className={`text-xl sm:text-2xl ${
                hasDiscount ? "line-through" : "font-semibold"
              }`}
            >
              {price} PLN
            </p>
            {hasDiscount && (
              <p className="text-xl font-semibold sm:text-2xl">
                {priceWithDiscount} PLN
              </p>
            )}

            {bookType === PAPER_BOOK && (
              <div className="flex items-center">
                {orderState === "cart" && (
                  <button onClick={handleMinusClick} disabled={isUpdating}>
                    <RemoveIcon />
                  </button>
                )}
                <input
                  type="number"
                  value={bookQuantity}
                  onChange={(e) => setBookQuantity(e.target.value)}
                  onKeyDown={handleQuantityKeyDown}
                  onBlur={() => handleQuantityChange(bookQuantity)}
                  disabled={orderState === "confirmation" || isUpdating}
                  className="h-10 w-10 border bg-violet-100 text-center text-lg font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                {orderState === "cart" && (
                  <button onClick={handlePlusClick} disabled={isUpdating}>
                    <AddIcon />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {orderState === "cart" && (
          <div className="w-full">
            <Button
              disabledText="Removing..."
              disabled={isRemoving}
              onClick={() => setRemoveFromCartOpen(true)}
              type="red"
            >
              Remove from cart
            </Button>
            <Button
              disabledText="Moving..."
              disabled={isMoving}
              onClick={handleMoveToWishlist}
              className="mt-2"
            >
              Move to wishlist
            </Button>
          </div>
        )}
      </div>

      <ModalWindow
        open={removeFromCartOpen}
        onClose={() => setRemoveFromCartOpen(false)}
      >
        <p>
          Are you sure you want to remove{" "}
          <span className="font-semibold">{title}</span> from your cart?
        </p>
        <Button type="red" onClick={handleRemoveFromCart}>
          Remove
        </Button>
        <Button onClick={() => setRemoveFromCartOpen(false)}>Cancel</Button>
      </ModalWindow>
    </li>
  );
}

export default CartItem;
