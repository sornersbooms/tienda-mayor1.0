'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './order-confirmation.module.css';

const OrderConfirmationPage = () => {
  const [orderData, setOrderData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('latestOrder');
    if (data) {
      setOrderData(JSON.parse(data));
    } else {
      // Si no hay datos de pedido, redirigir al inicio
      router.push('/');
    }
  }, [router]);

  if (!orderData) {
    return <p>Cargando...</p>;
  }

  const { customer, items, total, paymentMethod } = orderData;

  const getPaymentInstructions = () => {
    if (paymentMethod === 'davivienda') {
      return (
        <div className={styles.paymentInstructions}>
          <h3>Instrucciones de Pago - Davivienda</h3>
          <p>Por favor, realiza una transferencia a la siguiente cuenta de ahorros:</p>
          <p><strong>Número de cuenta:</strong> 488430518990</p>
          <p>Una vez realizada la transferencia, envía el comprobante a nuestro correo electrónico o número de WhatsApp para confirmar tu pedido.</p>
        </div>
      );
    }
    if (paymentMethod === 'nequi') {
      return (
        <div className={styles.paymentInstructions}>
          <h3>Instrucciones de Pago - Nequi</h3>
          <p>Por favor, envía el dinero al siguiente número de celular:</p>
          <p><strong>Número de celular:</strong> 3017375421</p>
          <p>Cuando hayas realizado el pago, comparte el comprobante con nosotros para verificar la transacción y procesar tu pedido.</p>
        </div>
      );
    }
    if (paymentMethod === 'contraentrega') {
      return (
        <div className={styles.paymentInstructions}>
          <h3>Instrucciones de Pago - Contra Entrega</h3>
          <p>Tu pedido será enviado y podrás realizar el pago en efectivo al momento de la entrega.</p>
          <p>Asegúrate de tener el monto exacto disponible.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>¡Tu pedido ha sido procesado con éxito!</h1>
      <p className={styles.subtitle}>Te estaremos informando sobre el estado de tu pedido en la bandeja de entrada de tu correo.</p>

      <div className={styles.orderDetails}>
        <h2>Resumen del Pedido</h2>
        <div className={styles.customerInfo}>
          <p><strong>Nombre:</strong> {customer.name} {customer.lastName}</p>
          <p><strong>Correo:</strong> {customer.email}</p>
          <p><strong>Teléfono:</strong> {customer.phone}</p>
          <p><strong>Dirección:</strong> {customer.address}, {customer.city}</p>
        </div>

        <div className={styles.itemsList}>
          {items.map(item => (
            <div key={item.id} className={styles.item}>
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className={styles.total}>
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
      </div>

      {getPaymentInstructions()}

      <button onClick={() => router.push('/')} className={styles.homeButton}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default OrderConfirmationPage;