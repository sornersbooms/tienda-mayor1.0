import React from 'react';
import styles from './ShippingBanner.module.css';

const ShippingBanner = () => {
  return (
    <div className={styles.shippingBanner}>
      <p>⚠️ ¡Atención! Actualmente, solo realizamos envíos dentro de Colombia.</p>
      <p>Los precios y envíos son válidos únicamente para Colombia.</p>
    </div>
  );
};

export default ShippingBanner;
