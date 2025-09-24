'use client';

import React from 'react';
import { useCart } from '../components/cart/CartContext';
import styles from './CheckoutItem.module.css';

const CheckoutItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className={styles.checkoutItem}>
      <Image src={item.image} alt={item.name} className={styles.itemImage} width={80} height={80} />
      <div className={styles.itemDetails}>
        <span className={styles.itemName}>{item.name}</span>
        <div className={styles.quantityControl}>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.quantityButton}>-</button>
          <span className={styles.quantityText}>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.quantityButton}>+</button>
        </div>
        <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
        <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>&times;</button>
      </div>
    </div>
  );
};

export default CheckoutItem;
