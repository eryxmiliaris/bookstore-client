import { createContext, useContext, useEffect, useState } from "react";

const LocalCartContext = createContext();

function LocalCartProvider({ children }) {
  const [localCart, setLocalCart] = useState(null);

  useEffect(() => {
    initLocalCart();
  }, []);

  function initLocalCart() {
    const localCart = localStorage.getItem("cart");
    if (!localCart) {
      const newCart = { cartItems: [], totalPrice: 0, idCounter: 0 };
      localStorage.setItem("cart", JSON.stringify(newCart));
      setLocalCart(newCart);
    } else {
      const parsedLocalCart = JSON.parse(localCart);
      setLocalCart(parsedLocalCart);
    }
  }

  function areCartItemsEqual(cartItem1, cartItem2) {
    for (const key in cartItem1) {
      if (key !== "id" && cartItem1[key] !== cartItem2[key]) {
        return false;
      }
    }
    return true;
  }

  function addItemToLocalCart(cartItem) {
    const newCartItem = { ...cartItem, id: localCart.idCounter++ };

    for (let i = 0; i < localCart.cartItems.length; i++) {
      if (areCartItemsEqual(newCartItem, localCart.cartItems[i])) {
        return false;
      }
    }

    const updatedCart = {
      ...localCart,
      totalPrice: localCart.totalPrice + newCartItem.totalPrice,
      cartItems: [...localCart.cartItems, newCartItem],
    };
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setLocalCart(updatedCart);

    return true;
  }

  function removeItemFromLocalCart(id) {
    const cartItem = localCart.cartItems.filter(
      (cartItem) => cartItem.id === id,
    )[0];
    const updatedCart = {
      ...localCart,
      totalPrice: localCart.totalPrice - cartItem.price * cartItem.quantity,
      cartItems: localCart.cartItems.filter((cartItem) => cartItem.id !== id),
    };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setLocalCart(updatedCart);
  }

  function updateLocalCartQuantity(id, newQuantity) {
    const cartItem = localCart.cartItems.filter(
      (cartItem) => cartItem.id === id,
    )[0];
    const updatedCart = {
      ...localCart,
      totalPrice:
        localCart.totalPrice -
        cartItem.price * cartItem.quantity +
        cartItem.price * newQuantity,
      cartItems: localCart.cartItems.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, quantity: newQuantity } : cartItem,
      ),
    };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setLocalCart(updatedCart);
  }

  function clearLocalCart() {
    const clearCart = { cartItems: [], totalPrice: 0, idCounter: 0 };
    localStorage.setItem("cart", JSON.stringify(clearCart));
    setLocalCart(clearCart);
  }

  return (
    <LocalCartContext.Provider
      value={{
        localCart,
        addItemToLocalCart,
        removeItemFromLocalCart,
        updateLocalCartQuantity,
        clearLocalCart,
      }}
    >
      {children}
    </LocalCartContext.Provider>
  );
}

function useLocalCart() {
  const context = useContext(LocalCartContext);
  if (context === undefined)
    throw new Error("This context was used outside of provider");
  return context;
}

export { LocalCartProvider, useLocalCart };
