'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../components/cart/CartContext';
import { useRouter } from 'next/navigation';
import styles from './checkout.module.css';
import CheckoutItem from './CheckoutItem';

// Importar los componentes de cada paso
import ShippingStep from './components/ShippingStep';
import PaymentStep from './components/PaymentStep';
import ReviewStep from './components/ReviewStep';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
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

  // --- Navegación entre pasos ---
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  // --- Validación --- 
  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'El nombre es obligatorio.';
      if (!formData.lastName) newErrors.lastName = 'El apellido es obligatorio.';
      if (!formData.email) {
        newErrors.email = 'El correo es obligatorio.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El formato del correo no es válido.';
      }
      if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio.';
      if (!formData.address) newErrors.address = 'La dirección es obligatoria.';
      if (!formData.city) newErrors.city = 'La ciudad es obligatoria.';
    }
    if (currentStep === 2) {
      if (!selectedPaymentMethod) newErrors.payment = 'Debes seleccionar un método de pago.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAll = () => {
    // Ejecuta todas las validaciones a la vez
    const shippingErrors = validateStep(1);
    const paymentErrors = validateStep(2);
    return shippingErrors && paymentErrors;
  }

  // --- Envío Final del Pedido ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      console.log('La validación final falló. No se puede enviar el pedido.');
      // Opcional: redirigir al primer paso con errores
      const firstErrorStep = errors.name || errors.lastName || errors.email || errors.phone || errors.address || errors.city ? 1 : 2;
      setStep(firstErrorStep);
      return;
    }

    const orderData = {
      customer: formData,
      items: cartItems,
      total: cartTotal,
      paymentMethod: selectedPaymentMethod,
    };

    console.log('Enviando pedido final:', orderData);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000') + '/api/orders';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('latestOrder', JSON.stringify({ ...orderData, _id: result.orderId }));
      } else {
        localStorage.setItem('latestOrder', JSON.stringify(orderData));
      }
    } catch (error) {
      localStorage.setItem('latestOrder', JSON.stringify(orderData));
    }

    router.push('/order-confirmation');
    clearCart();
  };

  // --- Renderizado de Pasos ---
  const renderStep = () => {
    switch (step) {
      case 1:
        return <ShippingStep formData={formData} handleInputChange={handleInputChange} nextStep={nextStep} errors={errors} />;
      case 2:
        return <PaymentStep selectedPaymentMethod={selectedPaymentMethod} handlePaymentMethodChange={handlePaymentMethodChange} nextStep={nextStep} prevStep={prevStep} errors={errors} />;
      case 3:
        return <ReviewStep formData={formData} selectedPaymentMethod={selectedPaymentMethod} prevStep={prevStep} handleSubmit={handleSubmit} />;
      default:
        setStep(1); // Si algo sale mal, vuelve al primer paso
        return null;
    }
  }

  if (cartItems.length === 0 && step !== 3) { // Evita la redirección si ya estamos en la página de confirmación
    useEffect(() => {
        router.push('/');
    }, [router]);
    return <div className={styles.container}><p>Tu carrito está vacío. Redirigiendo...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.checkoutLayout}>
        <div className={styles.formContainer}>
          <div className={styles.progressIndicator}>
            <div className={`${styles.progressStep} ${step >= 1 ? styles.activeStep : ''}`}>
              <span className={styles.stepNumber}>1</span>
              <span className={styles.stepLabel}>Envío</span>
            </div>
            <div className={`${styles.progressStep} ${step >= 2 ? styles.activeStep : ''}`}>
              <span className={styles.stepNumber}>2</span>
              <span className={styles.stepLabel}>Pago</span>
            </div>
            <div className={`${styles.progressStep} ${step >= 3 ? styles.activeStep : ''}`}>
              <span className={styles.stepNumber}>3</span>
              <span className={styles.stepLabel}>Confirmar</span>
            </div>
          </div>
          {renderStep()}
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