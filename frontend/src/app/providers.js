'use client';

import { CartProvider } from './components/cart/CartContext';

export function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
