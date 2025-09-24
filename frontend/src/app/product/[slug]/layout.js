import products from "../../../lib/products.json";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Producto no encontrado | TiendaMayor",
      description: "Lo sentimos, el producto que buscas no está disponible.",
    };
  }

  const title = `Comprar ${product.title} | TiendaMayor`;
  const description = `Encuentra ${product.title} al mejor precio. ${product.description.substring(0, 120)}... Compra ahora con envío a todo el país.`;
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'article',
    },
  };
}

export default async function ProductLayout({ children, params }) {
  const { slug } = params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <>
        {children} {/* Render children even if product not found, page.js will handle the "not found" message */}
      </>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
