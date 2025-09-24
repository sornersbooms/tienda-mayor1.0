import Image from "next/image";
import Link from "next/link"; // Import Link
import styles from "./page.module.css";
import products from "../lib/products.json";
import AddToCartButton from "./components/cart/AddToCartButton"; // Importar el nuevo componente

const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '';
  }
  return '$' + price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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

// Helper para generar un número pseudoaleatorio basado en una semilla
const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Helper para slugificar texto
const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '')
    .replace(/--+/g, '-');
};

export default function Home() {
  const productsWithDetails = products.map(product => {
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

    return {
      ...product,
      rating,
      quantityBought,
      formattedDeliveryDate
    };
  });

  // Obtener categorías únicas
  const categories = [...new Set(products.map(p => p.category).filter(category => category && typeof category === 'string'))];

  // Productos destacados (por ejemplo, los primeros 8 productos)
  const featuredProducts = productsWithDetails.slice(0, 8);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Bienvenido a TiendaMayor</h1>
          <p className={styles.heroSubtitle}>
            Los mejores productos, al mejor precio.
          </p>
        </div>


        {/* --- Fin Sección de Categorías Principales --- */}

        {/* --- Sección de Productos Destacados --- */}

        {/* --- Fin Sección de Productos Destacados --- */}

        <div className={styles.grid}>
          {productsWithDetails.map((product) => {
            const newPrice = product.providerPrice ? product.providerPrice * 2.5 : null;
            const oldPrice = newPrice ? newPrice * 1.30 : null; // 30% more expensive
            const description = product.description ? product.description.substring(0, 100) + "..." : "";

            return (
              <div key={product.id} className={styles.cardContainer}> {/* Contenedor para Link y botón */}
                <Link href={`/product/${product.slug}`} className={styles.card}>
                  {product.images && product.images.length > 0 && (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={200}
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <div className={styles.productInfo}>
                    <h2>{product.title}</h2>
                    <div className={styles.rating}>
                      {generateStars(product.rating)}
                      <span className={styles.ratingText}>{product.rating} de 5 estrellas</span>
                    </div>
                    <p className={styles.description}>{description}</p>
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
                    <p className={styles.quantityBought}>{product.quantityBought} comprados el mes pasado</p>
                    <p className={styles.deliveryInfo}>Entrega: {product.formattedDeliveryDate}</p>
                  </div>
                </Link>
                <AddToCartButton product={product} />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}