console.log('¡Este es el server.js que se está ejecutando!'); // Añade esta línea al principio del archivo


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Importar mongoose

// La clave secreta se lee desde el archivo .env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Configura CORS para permitir peticiones desde tu frontend
// En un entorno de producción, deberías restringir el origen a tu dominio real.
app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema del ítem del pedido
const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }, // Asumiendo que los ítems tienen una imagen
});

// Definir el esquema del pedido
const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    moreDetails: { type: String },
  },
  items: [orderItemSchema], // Array de ítems del pedido
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Fecha de creación automática
});

// Crear el modelo de Pedido
const Order = mongoose.model('Order', orderSchema);

// Endpoint para crear PaymentIntent (Stripe)
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({ error: 'El monto debe ser un número positivo.' });
    }

    // Crea un PaymentIntent con el monto y la moneda.
    // Stripe espera el monto en la unidad más pequeña (centavos para USD, COP, etc.)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convierte a centavos y redondea
      currency: 'cop', // Moneda colombiana
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Envía el client_secret al frontend
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).send({ error: error.message });
  }
});

// Nuevo endpoint para guardar pedidos en MongoDB
app.post('/api/orders', async (req, res) => {
   try {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    await newOrder.save();
    console.log('Pedido guardado en MongoDB:', newOrder);
    res.status(201).json({ message: 'Pedido guardado con éxito', orderId: newOrder._id });
  } catch (error) {
    console.error('Error al guardar el pedido en MongoDB:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar el pedido.' });
  }
});

// Ruta catch-all para depuración
app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.originalUrl}`);
  next(); // Pasa la petición a la siguiente ruta o middleware
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));