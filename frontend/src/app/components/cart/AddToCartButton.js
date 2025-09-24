
'use client';

import { useCart } from './CartContext';
import styles from '../../page.module.css';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  return (
    <button
      className={styles.addToCartButton}
      onClick={(e) => {
        e.preventDefault();
        addToCart(product);
      }}
    >
      Agregar al Carrito
    </button>
  );
}
