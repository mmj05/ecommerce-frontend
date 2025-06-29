import placeholderImage from '../assets/placeholder-product.svg';

/**
 * Returns the appropriate image URL for a product
 * @param {string|null} imageUrl - The product's image URL
 * @returns {string} - The resolved image URL
 */
export const getProductImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === 'default.png') {
    return placeholderImage;
  }
  return imageUrl;
}; 