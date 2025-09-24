'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../components/cart/CartContext';
import { useRouter } from 'next/navigation';
import styles from './checkout.module.css';
import CheckoutItem from './CheckoutItem';
import PaymentMethods from './PaymentMethods';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Colombia',
    moreDetails: '',
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.lastName) newErrors.lastName = 'El apellido es obligatorio.';
    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }
    if (!formData.phone) {
      newErrors.phone = 'El teléfono es obligatorio.';
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono solo debe contener números.';
    }
    if (!formData.address) newErrors.address = 'La dirección es obligatoria.';
    if (!formData.city) newErrors.city = 'La ciudad es obligatoria.';
    if (!formData.country) newErrors.country = 'El país es obligatorio.';
    if (!selectedPaymentMethod) newErrors.payment = 'Debes seleccionar un método de pago.';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log('Validación del formulario fallida. No se procede con el pedido.'); // Nuevo log
      return; // Detiene el envío si hay errores
    }

    const orderData = {
      customer: formData,
      items: cartItems,
      total: cartTotal,
      paymentMethod: selectedPaymentMethod,
    };

    console.log('Pedido enviado:', orderData);

    try {
      const response = await fetch('http://localhost:4000/api/orders', { // URL del nuevo endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log('Pedido enviado a MongoDB con éxito');
        const result = await response.json();
        localStorage.setItem('latestOrder', JSON.stringify({ ...orderData, _id: result.orderId })); // Guardar el ID del pedido de MongoDB
      } else {
        console.error('Error al enviar el pedido a MongoDB:', await response.text());
        // Aunque haya un error al guardar en MongoDB, aún redirigimos para no bloquear al usuario
        localStorage.setItem('latestOrder', JSON.stringify(orderData));
      }
    } catch (error) {
      console.error('Error de red al contactar el backend:', error);
      // Si hay un error de red, aún redirigimos para no bloquear al usuario
      localStorage.setItem('latestOrder', JSON.stringify(orderData));
    }

    console.log('Redirigiendo a /order-confirmation'); // Nuevo log
    router.push('/order-confirmation'); 
    clearCart(); 
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Finalizar Compra</h1>
      <div className={styles.checkoutLayout}>
        <div className={styles.formContainer}>
          <h2>Información de Envío</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre" className={styles.inputField} />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Apellido" className={styles.inputField} />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
              </div>
            </div>
            <div className={styles.inputGroupFull}>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Correo Electrónico" className={styles.inputFieldFull} />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            <div className={styles.inputGroupFull}>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Teléfono" className={styles.inputFieldFull} />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
            <div className={styles.inputGroupFull}>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Dirección" className={styles.inputFieldFull} />
              {errors.address && <span className={styles.errorText}>{errors.address}</span>}
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ciudad" className={styles.inputField} />
                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
              </div>
              <div className={styles.inputGroup}>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="País" className={styles.inputField} />
                {errors.country && <span className={styles.errorText}>{errors.country}</span>}
              </div>
            </div>
            <div className={styles.inputGroupFull}>
              <textarea name="moreDetails" value={formData.moreDetails} onChange={handleInputChange} placeholder="Más detalles sobre el pedido" className={styles.inputFieldFull} rows="4"></textarea>
            </div>
            
            <PaymentMethods 
              selectedPaymentMethod={selectedPaymentMethod}
              handlePaymentMethodChange={handlePaymentMethodChange}
            />
            {errors.payment && <span className={styles.errorText}>{errors.payment}</span>}

            <button type="submit" className={styles.submitButton}>Realizar Pedido</button>
          </form>
        </div>

        <div className={styles.summaryContainer}>
          <h2>Resumen del Pedido</h2>
          <div className={styles.summaryItems}>
            {cartItems.map(item => (
              <CheckoutItem key={item.id} item={item} />
            ))}
          </div>
          <div className={styles.summaryTotal}>
            <strong>Total:</strong>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
