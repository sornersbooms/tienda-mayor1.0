'use client';

import React from 'react';
import { useCart } from './CartContext';
import styles from './CartIcon.module.css'; // Assuming you'll create this CSS module

const CartIcon = () => {
  const { totalItems, toggleCart } = useCart();

  return (
    <button className={styles.cartIconContainer} onClick={toggleCart} aria-label={`Carrito de compras con ${totalItems} artículos`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={styles.cartSvg}
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {totalItems > 0 && <span className={styles.itemCount}>{totalItems}</span>}
    </button>
  );
};

export default CartIcon;
