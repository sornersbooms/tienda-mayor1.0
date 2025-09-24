'use client';

import React from 'react';
import { useCart } from './CartContext';
import styles from './CartItem.module.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className={styles.cartItem}>
      <Image src={item.image} alt={item.name} className={styles.itemImage} width={80} height={80} />
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemPrice}>{item.price ? `${item.price.toFixed(2)}` : 'Precio no disponible'}</p>
        <div className={styles.itemActions}>
          <div className={styles.quantityControl}>
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.quantityButton}>-</button>
            <span className={styles.quantityText}>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.quantityButton}>+</button>
          </div>
          <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
