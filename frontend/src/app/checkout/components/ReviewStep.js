'use client';

import React from 'react';
import styles from '../checkout.module.css';

const ReviewStep = ({ formData, selectedPaymentMethod, prevStep, handleSubmit }) => {
  return (
    <div className={styles.formStep}>
      <h2>Revisar y Confirmar Pedido</h2>
      
      <div className={styles.reviewSection}>
        <h4>Información de Envío</h4>
        <p><strong>Nombre:</strong> {formData.name} {formData.lastName}</p>
        <p><strong>Correo:</strong> {formData.email}</p>
        <p><strong>Teléfono:</strong> {formData.phone}</p>
        <p><strong>Dirección:</strong> {formData.address}, {formData.city}</p>
        {formData.moreDetails && <p><strong>Detalles:</strong> {formData.moreDetails}</p>}
        <button onClick={prevStep} className={styles.editButton}>Editar Envío</button>
      </div>

      <div className={styles.reviewSection}>
        <h4>Método de Pago</h4>
        <p>{selectedPaymentMethod}</p>
        <button onClick={() => prevStep()} className={styles.editButton}>Editar Pago</button>
      </div>

      <div className={styles.stepActions}>
        <button onClick={handleSubmit} className={styles.submitButton}>Realizar Pedido</button>
      </div>
    </div>
  );
};

export default ReviewStep;
