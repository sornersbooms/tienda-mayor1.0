import Image from "next/image";
import Link from "next/link"; // Import Link
import styles from "../page.module.css";
import products from "../../lib/products.json";

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
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

export default function CategoryPage({ params }) {
  const { category } = params;
  const filteredProducts = products.filter(
    (p) => p.category && slugify(p.category) === category
  ).map(product => {
    // Generate random data for each product (for demonstration)
    const rating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
    const quantityBought = Math.floor(Math.random() * (1000 - 100) + 100);

    // Calculate delivery date (5-6 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 2) + 5); // 5 or 6 days
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('es-ES', options);

    return {
      ...product,
      rating,
      quantityBought,
      formattedDeliveryDate
    };
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</h1>
        <div className={styles.grid}>
          {filteredProducts.map((product) => {
            const newPrice = product.providerPrice ? product.providerPrice * 2.5 : null;
            const oldPrice = newPrice ? newPrice * 1.30 : null; // 30% more expensive
            const description = product.description ? product.description.substring(0, 100) + "..." : "";

            return (
              <Link key={product.id} href={`/product/${product.slug}`} className={styles.card}>
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
                  <button className={styles.addToCartButton}>Agregar al Carrito</button>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}