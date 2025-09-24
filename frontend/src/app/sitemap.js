import productsData from '@/lib/products.json';

const URL = 'https://tiendamayor.com'; // Asegúrate de que esta URL sea la correcta para tu sitio

export default async function sitemap() {
  const products = productsData.map((product) => ({
    url: `${URL}/product/${encodeURIComponent(product.slug)}`, // Escapar el slug
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const categories = [...new Set(productsData.map(product => product.category))].map((category) => ({
    url: `${URL}/category/${encodeURIComponent(category)}`, // Escapar la categoría
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const routes = ['', '/checkout', '/order-confirmation'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }));

  return [...routes, ...products, ...categories];
}