import cloudinary from '../../config/cloudinary.js';
import { ApiError } from '../../utils/apiError.js';
import {
  createProduct,
  findById,
  findMany,
  countDocuments,
  findByIdAndUpdate,
  softDelete,
  updateStock,
  updatePricing,
  removeImage,
} from '../repositories/product.repository.js';
import { getVisiblePrices } from '../services/price.service.js';
import transformProduct from '../../utils/productTransformer.js';

const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

const removeFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

const create = async (productData, files) => {
  const coverImageFile = files?.[0];
  const additionalImages = files?.slice(1) || [];

  let coverImageUrl = '';
  if (coverImageFile) {
    const result = await uploadToCloudinary(coverImageFile.buffer, 'hamro-pustak/products');
    coverImageUrl = result.secure_url;
  }

  const imageUrls = [];
  for (const file of additionalImages) {
    const result = await uploadToCloudinary(file.buffer, 'hamro-pustak/products');
    imageUrls.push(result.secure_url);
  }

  const product = await createProduct({
    ...productData,
    coverImage: coverImageUrl,
    images: imageUrls,
    createdBy: productData.createdBy,
    updatedBy: productData.createdBy,
  });

  return product;
};

const update = async (id, updateData, files) => {
  const product = await findById(id);
  if (!product) throw new ApiError('Product not found', 404);
  if (product.isDeleted) throw new ApiError('Product has been deleted', 404);

  const updatePayload = { ...updateData, updatedBy: updateData.updatedBy };

  if (files && files.length > 0) {
    const newImages = [];
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, 'hamro-pustak/products');
      newImages.push(result.secure_url);
    }
    updatePayload.images = [...(product.images || []), ...newImages];
  }

  return findByIdAndUpdate(id, updatePayload, { new: true });
};

const deleteProduct = async (id) => {
  const product = await softDelete(id);
  if (!product) throw new ApiError('Product not found', 404);
  return product;
};

const getProductById = async (id, userRole) => {
  const product = await findById(id);
  if (!product) throw new ApiError('Product not found', 404);
  if (product.isDeleted) throw new ApiError('Product not found', 404);

  return transformProduct(product, userRole);
};

const getAllProducts = async (query, userRole) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 12, 50);

  const [products, total] = await Promise.all([
    findMany({ ...query, page, limit }),
    countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  const transformedProducts = products.map((product) =>
    transformProduct(product, userRole)
  );

  return {
    products: transformedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const changeStock = async (id, stock, userId) => {
  if (stock < 0) throw new ApiError('Stock cannot be negative', 400);
  return updateStock(id, stock);
};

const changePricing = async (id, retailPrice, wholesalePrice, userId) => {
  if (wholesalePrice > retailPrice) {
    throw new ApiError('Wholesale price cannot exceed retail price', 400);
  }
  return updatePricing(id, retailPrice, wholesalePrice);
};

const addImages = async (id, files, userId) => {
  const product = await findById(id);
  if (!product || product.isDeleted) throw new ApiError('Product not found', 404);

  const newImageUrls = [];
  for (const file of files) {
    const result = await uploadToCloudinary(file.buffer, 'hamro-pustak/products');
    newImageUrls.push(result.secure_url);
  }

  return findByIdAndUpdate(id, { $push: { images: { $each: newImageUrls } } }, { new: true });
};

const deleteImage = async (id, imageUrl, userId) => {
  const product = await findById(id);
  if (!product || product.isDeleted) throw new ApiError('Product not found', 404);

  const imageIndex = product.images.indexOf(imageUrl);
  if (imageIndex === -1) throw new ApiError('Image not found in product', 404);

  const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
  await removeFromCloudinary(publicId);

  return removeImage(id, imageIndex);
};

export {
  create,
  update,
  deleteProduct,
  getProductById,
  getAllProducts,
  changeStock,
  changePricing,
  addImages,
  deleteImage,
};
