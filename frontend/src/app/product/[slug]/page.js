


import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import products from "../../../lib/products.json";
import reviewsData from "../../../lib/reviews.json";
import ProductClientContent from "./productClientContent";

const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD') // Split accented characters into base character and diacritic
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritic marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-zA-Z0-9-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  // Helper para generar un número pseudoaleatorio basado en una semilla
  const seededRandom = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Usar product.id como semilla para valores "aleatorios" deterministas
  const seed = product.id; // Usar el ID numérico directamente como semilla

  const rating = (seededRandom(seed) * (5 - 3.5) + 3.5).toFixed(1);
  const quantityBought = Math.floor(seededRandom(seed + 1) * (1000 - 100) + 100); // Usar una semilla diferente para la cantidad

  // Calcular la fecha de entrega de forma determinista basada en el ID del producto
  const deliveryDays = Math.floor(seededRandom(seed + 2) * 2) + 5; // 5 o 6 días
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('es-ES', options);

  // --- Lógica para la generación dinámica de reseñas ---
  const generateRandomReviews = (allReviews) => {
    const numReviewsToShow = Math.floor(Math.random() * (22 - 7 + 1)) + 7;
    const shuffledReviews = [...allReviews].sort(() => 0.5 - Math.random());
    const selectedComments = shuffledReviews.slice(0, numReviewsToShow);

    const authors = [
      "Ana García", "Juan Pérez", "María López", "Carlos Ruiz", "Sofía Martínez",
      "Pedro Sánchez", "Laura Fernández", "Miguel González", "Elena Rodríguez", "David Díaz",
      "Andrés Ospina", "Valentina Rojas", "Santiago Castro", "Isabella Vargas", "Mateo Morales",
      "Camila Guerrero", "Sebastián Sierra", "Valeria Rincón", "Nicolás Quintero", "Gabriela Delgado",
      "Daniela Medina", "Alejandro Pardo", "Mariana Solano", "Diego Cárdenas", "Luciana Bernal",
      "Felipe Acosta", "Paula Salgado", "Juan David Giraldo", "Manuela Londoño", "Ricardo Vélez",
      "Natalia Restrepo", "Javier Echeverri", "Carolina Tamayo", "Luis Fernando Soto", "Andrea Palacio",
      "Mauricio Cano", "Viviana Osorio", "Esteban Zapata", "Silvia Gómez", "Jorge Botero",
      "Liliana Marín", "Oscar Ríos", "Gloria Agudelo", "Hernán Valencia", "Patricia Correa",
      "Eduardo Yepes", "Mónica Henao", "Fernando Jaramillo", "Adriana Mesa", "Roberto Cadavid",
      "Sandra Posada", "Carlos Alberto Duque", "Angela Franco", "David Montoya", "Diana Alzate",
      "Julian Rendón", "Sara Betancur", "Pablo Villa", "Catalina Arango", "Manuel Gallego",
      "Laura Gaviria", "Cristian Herrera", "Daniela Hoyos", "Juan Camilo Pérez", "María Fernanda López",
      "Miguel Ángel Rodríguez", "Sofía Alejandra Díaz", "Pedro Antonio Sánchez", "Laura Marcela Fernández", "Miguel Andrés González",
      "Elena Sofía Rodríguez", "David Esteban Díaz", "Ana María García", "Juan Pablo Pérez", "María Camila López",
      "Carlos Andrés Ruiz", "Sofía Carolina Martínez", "Pedro Alejandro Sánchez", "Laura Valentina Fernández", "Miguel Ángel González",
      "Elena María Rodríguez", "David Santiago Díaz", "Ana Sofía García", "Juan Sebastián Pérez", "María Paula López",
      "Carlos David Ruiz", "Sofía Isabel Martínez", "Pedro José Sánchez", "Laura Andrea Fernández", "Miguel Alejandro González",
      "Elena Carolina Rodríguez", "David Felipe Díaz", "Ana Carolina García", "Juan Felipe Pérez", "María Alejandra López",
      "Carlos Javier Ruiz", "Sofía Daniela Martínez", "Pedro Miguel Sánchez", "Laura Cristina Fernández", "Miguel Santiago González",
      "Elena Andrea Rodríguez", "David Camilo Díaz", "Ana Isabel García", "Juan Andrés Pérez", "María Victoria López",
      "Carlos Eduardo Ruiz", "Sofía Gabriela Martínez", "Pedro Daniel Sánchez", "Laura Sofía Fernández", "Miguel David González",
      "Elena Patricia Rodríguez", "David Alejandro Díaz", "Ana Gabriela García", "Juan Daniel Pérez", "María Fernanda Ruiz",
      "Carlos Mauricio Ruiz", "Sofía Valentina Martínez", "Pedro Andrés Sánchez", "Laura Isabel Fernández", "Miguel Felipe González"
    ];

    const reviews = selectedComments.map((comment, index) => {
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const randomRating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);

      // Generar fecha en los últimos 6 meses
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const randomTime = sixMonthsAgo.getTime() + Math.random() * (new Date().getTime() - sixMonthsAgo.getTime());
      const randomDate = new Date(randomTime);
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedRandomDate = randomDate.toLocaleDateString('es-ES', dateOptions);

      return {
        id: index,
        author: randomAuthor,
        rating: parseFloat(randomRating),
        date: formattedRandomDate,
        comment: comment,
      };
    });
    return reviews;
  };

  const productReviews = generateRandomReviews(reviewsData);
  // --- Fin de la lógica para la generación dinámica de reseñas ---

  // Preparar productos relacionados
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4); // Mostrar hasta 4 productos relacionados

  // Añadir productos relacionados al objeto product
  const productWithRelated = {
    ...product,
    relatedProducts
  };

  // Generar el Schema Markup
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png',
    "description": product.description,
    "sku": product.id, // Usar el ID como SKU
    "offers": {
      "@type": "Offer",
      "url": `https://tiendamayor.com/product/${product.slug}`, // URL can be dynamic
      "priceCurrency": "USD", // Asumiendo USD, ajustar si es necesario
      "price": product.providerPrice ? (product.providerPrice * 2.5).toFixed(2) : "0.00",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock", // Asumiendo que siempre está en stock
      "seller": {
        "@type": "Organization",
        "name": "TiendaMayor" // Nombre de tu tienda
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": parseFloat(rating), // Convertir a número
      "reviewCount": productReviews.length // Usar el número real de reseñas generadas
    }
  };

  return (
    <ProductClientContent 
      product={productWithRelated}
      productReviews={productReviews}
      rating={rating}
      quantityBought={quantityBought}
      formattedDeliveryDate={formattedDeliveryDate}
      productSchema={productSchema}
    />
  );
}
