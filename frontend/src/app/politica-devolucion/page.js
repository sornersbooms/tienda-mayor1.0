import React from 'react';
import styles from '../page.module.css';

export default function ReturnPolicyPage() {
  return (
    <main className={styles.main}>
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '2rem'}}>
        <h1>Política de Devolución de Google Merchandise Store</h1>
        <p style={{color: '#666', marginBottom: '2rem'}}>Última actualización: 29 de septiembre de 2025</p>

        <section style={{marginBottom: '2rem'}}>
          <h2>Nuestra Promesa</h2>
          <p>
            En la Google Merchandise Store, queremos que estés completamente satisfecho con tu compra. Si por alguna razón no lo estás, estamos aquí para ayudarte con nuestro proceso de devolución.
          </p>
        </section>

        <section style={{marginBottom: '2rem'}}>
          <h2>Plazo de Devolución</h2>
          <p>
            Puedes devolver la mayoría de los artículos nuevos y sin abrir dentro de los 30 días posteriores a la entrega para obtener un reembolso completo.
          </p>
        </section>

        <section style={{marginBottom: '2rem'}}>
          <h2>Condiciones para la Devolución</h2>
          <ul style={{paddingLeft: '20px'}}>
            <li>El artículo debe estar en su estado original, sin usar, sin lavar y con todas las etiquetas originales adjuntas.</li>
            <li>El artículo debe devolverse en su embalaje original.</li>
            <li>Los artículos personalizados o de venta final no son elegibles para devolución.</li>
          </ul>
        </section>

        <section style={{marginBottom: '2rem'}}>
          <h2>¿Cómo Iniciar una Devolución?</h2>
          <p>
            Para iniciar una devolución, por favor sigue estos pasos:
          </p>
          <ol style={{paddingLeft: '20px'}}>
            <li>Visita nuestro Centro de Devoluciones e introduce tu número de pedido y correo electrónico.</li>
            <li>Selecciona los artículos que deseas devolver y el motivo de la devolución.</li>
            <li>Recibirás una etiqueta de envío prepagada e instrucciones por correo electrónico.</li>
            <li>Empaqueta los artículos de forma segura y pega la etiqueta de envío en el exterior del paquete.</li>
            <li>Deja el paquete en el punto de entrega del transportista designado.</li>
          </ol>
        </section>

        <section style={{marginBottom: '2rem'}}>
          <h2>Reembolsos</h2>
          <p>
            Una vez que recibamos e inspeccionemos tu devolución, procesaremos tu reembolso. El reembolso se acreditará al método de pago original dentro de 5 a 7 días hábiles.
          </p>
          <p>
            Los costos de envío originales no son reembolsables, a menos que la devolución se deba a un error nuestro (por ejemplo, un artículo defectuoso o incorrecto).
          </p>
        </section>

        <section style={{marginBottom: '2rem'}}>
          <h2>Artículos Defectuosos o Incorrectos</h2>
          <p>
            Si recibiste un artículo defectuoso, dañado o incorrecto, por favor contacta a nuestro equipo de soporte al cliente dentro de los 7 días posteriores a la recepción del pedido. Nos encargaremos de reemplazar el artículo o emitir un reembolso completo, incluyendo los gastos de envío.
          </p>
        </section>

        <section>
          <h2>Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre nuestra política de devolución, no dudes en contactarnos en <a href="mailto:support@tiendamayor.com" style={{color: '#1a73e8', textDecoration: 'none'}}>support@tiendamayor.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
