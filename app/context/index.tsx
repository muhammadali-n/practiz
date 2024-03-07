'use client'
import React, { createContext, useEffect, useState } from "react";

export const Context = createContext<{
  cartItems: any[];
  handleAddToCart: (getCurrectItem: any) => void;
  handleRemoveFromCart: (itemId: string) => void;
} | null>(null);

function GlobalState({ children }: { children: any }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : {};
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  function handleAddToCart(getCurrectItem: any) {
    const itemId = getCurrectItem.id;

    if (cartItems.hasOwnProperty(itemId)) {
      const updatedCart = {
        ...cartItems,
        [itemId]: { ...cartItems[itemId], quantity: cartItems[itemId].quantity + 1 },
      };
      setCartItems(updatedCart);
    } else {
      setCartItems({ ...cartItems, [itemId]: { ...getCurrectItem, quantity: 1 } });
    }
  }


  function handleRemoveFromCart(itemId: string,) {
    const updatedCart = { ...cartItems };
    
    if (updatedCart.hasOwnProperty(itemId)) {
      if (updatedCart[itemId].quantity > 1) {
        updatedCart[itemId].quantity -= 1;
      } else {
        delete updatedCart[itemId];
      }

      setCartItems(updatedCart);
    }
   
  }

  return <Context.Provider value={{ cartItems, handleAddToCart, handleRemoveFromCart }}>{children}</Context.Provider>;
}


export default GlobalState;
