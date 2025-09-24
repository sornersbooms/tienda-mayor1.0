
'use client';

import React from 'react';
import styles from './PaymentMethods.module.css';

const PaymentMethods = ({ selectedPaymentMethod, handlePaymentMethodChange }) => {
  return (
    <div className={styles.paymentContainer}>
      <h2>Método de Pago</h2>
      <p>Por favor, realiza el pago a una de las siguientes cuentas y selecciona el método que utilizaste.</p>
      
      <div className={styles.paymentOption}>
        <input
          type="radio"
          id="davivienda"
          name="paymentMethod"
          value="davivienda"
          checked={selectedPaymentMethod === 'davivienda'}
          onChange={handlePaymentMethodChange}
          className={styles.radioInput}
        />
        <label htmlFor="davivienda" className={styles.radioLabel}>
          <span className={styles.paymentMethodName}>Davivienda (Cuenta de Ahorros)</span>
          <span className={styles.paymentMethodDetails}>Número de cuenta: 488430518990</span>
        </label>
      </div>

      <div className={styles.paymentOption}>
        <input
          type="radio"
          id="nequi"
          name="paymentMethod"
          value="nequi"
          checked={selectedPaymentMethod === 'nequi'}
          onChange={handlePaymentMethodChange}
          className={styles.radioInput}
        />
        <label htmlFor="nequi" className={styles.radioLabel}>
          <span className={styles.paymentMethodName}>Nequi</span>
          <span className={styles.paymentMethodDetails}>Número de celular: 3017375421</span>
        </label>
      </div>

      <div className={`${styles.paymentOption} ${styles.recommendedOption}`}>
        <input
          type="radio"
          id="contraentrega"
          name="paymentMethod"
          value="contraentrega"
          checked={selectedPaymentMethod === 'contraentrega'}
          onChange={handlePaymentMethodChange}
          className={styles.radioInput}
        />
        <label htmlFor="contraentrega" className={styles.radioLabel}>
          <span className={styles.paymentMethodName}>Contraentrega <span className={styles.recommendedTag}>(Recomendado)</span></span>
          <span className={styles.paymentMethodDetails}>Paga en casa cuando recibas el producto.</span>
        </label>
      </div>

      <p className={styles.confirmationText}>
        Una vez realizado el pago, selecciona el método y haz clic en "Realizar Pedido". 
        Nosotros verificaremos la transacción y procederemos con el envío, revisa tu correo, hay te vamos a estar avisando sobre el estado de tu pedido.
      </p>
    </div>
  );
};

export default PaymentMethods;
