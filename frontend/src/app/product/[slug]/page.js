'use client'; // Mark as client component

import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import products from "../../../lib/products.json"; // Mantener la importación de products
import reviewsData from "../../../lib/reviews.json"; // Import reviews data
import { useCart } from "../../components/cart/CartContext";

const formatPrice = (price) => {
  return '$' + price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const generateStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<span key={i} className={styles.starFilled}>★</span>);
    } else if (rating > i - 1) {
      stars.push(<span key={i} className={styles.starHalf}>★</span>); // This is a simplification, ideally you'd use a half-star character or image
    } else {
      stars.push(<span key={i} className={styles.starEmpty}>★</span>);
    }
  }
  return stars;
};

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
  const { addToCart } = useCart();
  const { slug } = React.use(params);
  const product = products.find((p) => p.slug === slug); // Mantener la búsqueda del producto aquí

  // State for the main image
  const [mainImage, setMainImage] = useState(product.images && product.images.length > 0 ? product.images[0] : '');

  const newPrice = product?.providerPrice ? product.providerPrice * 2.5 : null; // Use optional chaining
  const oldPrice = newPrice ? newPrice * 1.30 : null; // 30% more expensive

  useEffect(() => {
    if (product && typeof window !== 'undefined' && window.dataLayer) {
      const item = {
        item_id: product.id.toString(), // GA4 expects string
        item_name: product.title,
        currency: "USD", // Assuming USD, adjust if necessary
        price: newPrice ? parseFloat(newPrice.toFixed(2)) : 0,
        item_category: product.category,
        // Add other relevant product details if available and desired
        // e.g., item_brand: product.brand, item_variant: product.variant
      };

      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          currency: item.currency,
          value: item.price,
          items: [item],
        },
      });
    }
  }, [product, newPrice]); // Re-run if product or newPrice changes

  if (!product) {
    return <div className={styles.notFound}>Producto no encontrado</div>;
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
      "price": newPrice ? newPrice.toFixed(2) : "0.00",
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
    <div className={styles.page}>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <main className={styles.main}>
        <div className={styles.productDetailContainer}>
          <div className={styles.imageGallery}>
            {product.images && product.images.length > 0 && (
              <div className={styles.mainImage}>
                <Image
                  src={mainImage} // Use state variable for main image
                  alt={product.title}
                  width={500}
                  height={500}
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
            <div className={styles.thumbnailContainer}>
              {product.images && product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setMainImage(image)} // Set main image on click
                />
              ))}
            </div>
          </div>

          <div className={styles.productDetails}>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.rating}>
              {generateStars(rating)}
              <span className={styles.ratingText}>{rating} de 5 estrellas</span>
            </div>
            <p className={styles.description}>{product.description}</p>
            {product.tags && product.tags.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
            <div className={styles.priceContainer}>
              {oldPrice && <span className={styles.oldPrice}>{formatPrice(oldPrice)}</span>}
              {newPrice && <span className={styles.currentPrice}>{formatPrice(newPrice)}</span>}
            </div>
            <p className={styles.quantityBought}>{quantityBought} comprados el mes pasado</p>
            <p className={styles.deliveryInfo}>Entrega: {formattedDeliveryDate}</p>
            <button className={styles.addToCartButton} onClick={() => addToCart(product)}>Agregar al Carrito</button>
          </div>
        </div>

        {/* --- Sección de Reseñas --- */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Reseñas de Clientes</h2>
          {productReviews.length > 0 ? (
            <div className={styles.reviewsGrid}>
              {productReviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewAuthor}>{review.author}</span>
                    <div className={styles.reviewRating}>
                      {generateStars(review.rating)}
                      <span className={styles.ratingText}>{review.rating}</span>
                    </div>
                  </div>
                  <p className={styles.reviewDate}>{review.date}</p>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay reseñas disponibles para este producto.</p>
          )}
        </section>
        {/* --- Fin Sección de Reseñas --- */}

        {/* --- Sección de Productos Relacionados --- */}
        <section className={styles.relatedProductsSection}>
          <h2 className={styles.relatedProductsTitle}>Productos Relacionados</h2>
          <div className={styles.relatedProductsGrid}>
            {products
              .filter(
                (p) => p.category === product.category && p.slug !== product.slug
              )
              .slice(0, 4) // Mostrar hasta 4 productos relacionados
              .map((relatedProduct) => (
                <Link
                  href={`/product/${relatedProduct.slug}`}
                  key={relatedProduct.id}
                  className={styles.relatedProductCard}
                >
                  <Image
                    src={
                      relatedProduct.images && relatedProduct.images.length > 0
                        ? relatedProduct.images[0]
                        : "/placeholder-image.png"
                    }
                    alt={relatedProduct.title}
                    width={200}
                    height={200}
                    style={{ objectFit: "cover" }}
                  />
                  <h3 className={styles.relatedProductTitle}>
                    {relatedProduct.title}
                  </h3>
                  <p className={styles.relatedProductPrice}>
                    {formatPrice(
                      relatedProduct.providerPrice
                        ? relatedProduct.providerPrice * 2.5
                        : 0
                    )}
                  </p>
                </Link>
              ))}
          </div>
        </section>
        {/* --- Fin Sección de Productos Relacionados --- */}
      </main>
    </div>
  );
}
