import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { addToCart } from '../../features/cart/cartSlice';
import { fetchProductDetails } from '../../features/products/productSlice';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch product details when component mounts
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < (product?.quantity || 0)) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ 
        productId: product.productId, 
        quantity 
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No product found.</p>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.discount > 0
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <img 
              src={product.image || "https://via.placeholder.com/500"} 
              alt={product.productName} 
              className="max-w-full h-auto object-contain rounded-lg"
            />
          </div>

          {/* Discount Badge if applicable */}
          {discountPercentage > 0 && (
            <div className="mt-4 inline-block bg-accent text-white text-sm font-bold px-3 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.productName}
          </h1>

          {/* Price Section */}
          <div className="flex items-center mb-6">
            {product.discount > 0 ? (
              <>
                <span className="text-2xl font-bold text-primary mr-4">
                  ${product.specialPrice.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
            <span className={`text-sm font-medium ${
              product.quantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.quantity > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                ({product.quantity} available)
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.quantity > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="p-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="px-4 text-gray-800">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="p-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity >= product.quantity}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className={`btn-primary flex items-center justify-center gap-2 w-full ${
              product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;