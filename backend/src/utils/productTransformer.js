import { getVisiblePrices } from '../services/price.service.js';

const transformProduct = (product, userRole) => {
  const baseFields = {
    _id: product._id,
    sku: product.sku,
    title: product.title,
    slug: product.slug,
    author: product.author,
    publisher: product.publisher,
    category: product.category,
    description: product.description,
    images: product.images,
    coverImage: product.coverImage,
    stock: product.stock,
    minimumStock: product.minimumStock,
    isLowStock: product.isLowStock,
    featured: product.featured,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  const prices = getVisiblePrices(product, userRole);

  return {
    ...baseFields,
    ...prices,
  };
};

export default transformProduct;
