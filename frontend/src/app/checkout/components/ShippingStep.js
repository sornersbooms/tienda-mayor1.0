'use client';

import React from 'react';
import styles from '../checkout.module.css';

const ShippingStep = ({ formData, handleInputChange, nextStep, errors }) => {
  return (
    <div className={styles.formStep}>
      <h2>Información de Envío</h2>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Nombre</label>
          <input id="name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tu nombre" className={styles.inputField} />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="lastName" className={styles.label}>Apellido</label>
          <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Tu apellido" className={styles.inputField} />
          {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
        </div>
      </div>
      <div className={styles.inputGroupFull}>
        <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
        <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@correo.com" className={styles.inputFieldFull} />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>
      <div className={styles.inputGroupFull}>
        <label htmlFor="phone" className={styles.label}>Teléfono</label>
        <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="3001234567" className={styles.inputFieldFull} />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
      </div>
      <div className={styles.inputGroupFull}>
        <label htmlFor="address" className={styles.label}>Dirección</label>
        <input id="address" type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Carrera 5 # 10-20" className={styles.inputFieldFull} />
        {errors.address && <span className={styles.errorText}>{errors.address}</span>}
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="city" className={styles.label}>Ciudad</label>
          <input id="city" type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ej: Bogotá" className={styles.inputField} />
          {errors.city && <span className={styles.errorText}>{errors.city}</span>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="country" className={styles.label}>País</label>
          <input id="country" type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Colombia" className={styles.inputField} disabled />
          {errors.country && <span className={styles.errorText}>{errors.country}</span>}
        </div>
      </div>
      <div className={styles.inputGroupFull}>
        <label htmlFor="moreDetails" className={styles.label}>Detalles Adicionales (Opcional)</label>
        <textarea id="moreDetails" name="moreDetails" value={formData.moreDetails} onChange={handleInputChange} placeholder="Apartamento, casa, etc.
" className={styles.inputFieldFull} rows="3"></textarea>
      </div>
      <div className={styles.stepActions}>
        <button onClick={nextStep} className={styles.submitButton}>Ir a Pago</button>
      </div>
    </div>
  );
};

export default ShippingStep;
