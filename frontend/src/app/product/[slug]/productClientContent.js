'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
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

export default function ProductClientContent({ product, productReviews, rating, quantityBought, formattedDeliveryDate, productSchema }) {
  const { addToCart } = useCart();
  
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
            {product.relatedProducts && product.relatedProducts.map((relatedProduct) => (
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