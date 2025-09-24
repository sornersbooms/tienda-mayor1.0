'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // New state to track if cart has been loaded

  // Load cart from localStorage on initial render
  useEffect(() => {
    console.log('Attempting to load cart from localStorage...');
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        console.log('Cart loaded from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartItems([]);
      }
    } else {
      console.log('No cart found in localStorage.');
    }
    setIsLoaded(true); // Mark cart as loaded
  }, []);

  // Save cart to localStorage whenever it changes, but only after it has been loaded
  useEffect(() => {
    if (!isLoaded) return; // Don't save until cart has been loaded

    if (cartItems.length > 0) {
      console.log('Saving cart to localStorage:', cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      console.log('Cart is empty, clearing from localStorage.');
      localStorage.removeItem('cart');
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const itemToAdd = {
          id: product.id,
          name: product.title,
          image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png', // Provide a placeholder if no image
          price: (product.providerPrice || 0) * 2.5, // Use suggestedPrice, then providerPrice, default to 0
          quantity: 1,
          url_source: product.url_source,
        };
        return [...prevItems, itemToAdd];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    cartTotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};