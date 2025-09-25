'use client';

import React from 'react';
import styles from '../checkout.module.css';
import PaymentMethods from '../PaymentMethods'; // Reutilizamos el componente que ya tenías

const PaymentStep = ({ selectedPaymentMethod, handlePaymentMethodChange, nextStep, prevStep, errors }) => {
  return (
    <div className={styles.formStep}>
      <h2>Método de Pago</h2>
      
      <PaymentMethods 
        selectedPaymentMethod={selectedPaymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />
      {errors.payment && <span className={styles.errorText}>{errors.payment}</span>}

      <div className={`${styles.stepActions} ${styles.stepActionsMultiple}`}>
        <button onClick={prevStep} className={styles.secondaryButton}>Volver a Envío</button>
        <button onClick={nextStep} className={styles.submitButton}>Revisar Pedido</button>
      </div>
    </div>
  );
};

export default PaymentStep;
