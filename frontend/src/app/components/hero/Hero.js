
'use client';

import React from 'react';
import Typewriter from 'typewriter-effect';
import styles from '../../page.module.css';

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroTitle}>
        <Typewriter
          options={{
            strings: [
              'Bienvenido a <strong>TiendaMayor</strong>',
              'Soluciones <strong>innovadoras</strong> para tu negocio.',
              'Tu puerta de entrada al <strong>comercio electrónico</strong>.',
              'Potencia tus ventas con <strong>nuestra plataforma</strong>.',
            ],
            autoStart: true,
            loop: true,
            delay: 75,
            deleteSpeed: 50,
          }}
        />
      </div>
      <p className={styles.heroSubtitle}>
        Los mejores productos, al mejor precio.
      </p>
    </div>
  );
};

export default Hero;
