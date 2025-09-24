'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import CartItem from './CartItem';
import styles from './CartSidebar.module.css';

const CartSidebar = () => {
  const { isCartOpen, toggleCart, cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart(); // Cierra el sidebar
    router.push('/checkout'); // Navega a la página de checkout
  };

  return (
    <div className={`${styles.cartSidebar} ${isCartOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2>Tu Carrito</h2>
        <button onClick={toggleCart} className={styles.closeButton}>
          &times;
        </button>
      </div>
      <div className={styles.cartItemsContainer}>
        {cartItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          cartItems.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>
      {cartItems.length > 0 && (
        <div className={styles.sidebarFooter}>
          <div className={styles.cartSummary}>
            <span>Subtotal:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className={styles.checkoutButton}>
            Proceder al Pago
          </button>
          <button onClick={clearCart} className={styles.clearCartButton}>
            Vaciar Carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
