'use client';

import React, { useState, useEffect } from 'react';
import styles from './ShippingBanner.module.css';

const ShippingBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

  useEffect(() => {
    const manuallyClosed = localStorage.getItem('bannerManuallyClosed') === 'true';
    if (manuallyClosed) {
      setIsVisible(false);
      return;
    }

    const bannerShownTime = localStorage.getItem('bannerShownTime');
    const now = new Date().getTime();

    if (!bannerShownTime) {
      // First time seeing the banner, and it wasn't manually closed before
      localStorage.setItem('bannerShownTime', now.toString());
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, FIVE_MINUTES_IN_MS);

      return () => clearTimeout(timer);
    } else {
      const timeElapsed = now - parseInt(bannerShownTime, 10);

      if (timeElapsed < FIVE_MINUTES_IN_MS) {
        // Still within the 5-minute window
        setIsVisible(true);

        const remainingTime = FIVE_MINUTES_IN_MS - timeElapsed;
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, remainingTime);

        return () => clearTimeout(timer);
      } else {
        // 5 minutes have passed
        setIsVisible(false);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('bannerManuallyClosed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.bannerModal}>
        <button onClick={handleClose} className={styles.closeButton} aria-label="Cerrar banner">
          &times;
        </button>
        <p>⚠️ ¡Atención! Actualmente, solo realizamos envíos dentro de Colombia.</p>
        <p>Los precios y envíos son válidos únicamente para Colombia.</p>
      </div>
    </div>
  );
};

export default ShippingBanner;
