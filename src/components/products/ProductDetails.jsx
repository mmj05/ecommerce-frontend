import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiMinus, FiPlus, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { addToCart } from '../../features/cart/cartSlice';
import { fetchProductDetails } from '../../features/products/productSlice';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch product details when component mounts
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    
    // Reset state when component mounts
    setQuantity(1);
    setIsAdding(false);
    setIsAdded(false);
  }, [dispatch, id]);

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < (product?.quantity || 0)) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || isAdding || product.quantity === 0) return;
    
    setIsAdding(true);
    
    dispatch(addToCart({ 
      productId: product.productId, 
      quantity 
    })).then(() => {
      // Show success feedback
      setIsAdded(true);
      
      // Reset after a delay
      setTimeout(() => {
        setIsAdded(false);
        setIsAdding(false);
      }, 2000);
    }).catch(() => {
      setIsAdding(false);
    });
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
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
      {/* Back button */}
      <button 
        onClick={handleGoBack}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>
      
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
              <span className="text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="p-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1 || isAdding}
                >
                  <FiMinus />
                </button>
                <span className="px-4 text-gray-800">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="p-2 text-gray-600 hover:bg-gray-100"
                  disabled={quantity >= product.quantity || isAdding}
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0 || isAdding}
            className={`btn-primary flex items-center justify-center gap-2 w-full transition-all ${
              isAdding ? 'opacity-70 cursor-wait' : ''
            } ${isAdded ? 'bg-green-500 border-green-500' : ''} ${
              product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAdded ? (
              <>
                <FiCheck /> Added to Cart
              </>
            ) : (
              <>
                <FiShoppingCart /> {isAdding ? 'Adding...' : 'Add to Cart'}
              </>
            )}
          </button>
          
          {/* Additional product info */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-3">Product Details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium">Product ID:</span> {product.productId}</li>
              {product.category && (
                <li><span className="font-medium">Category:</span> {product.category.categoryName}</li>
              )}
              <li><span className="font-medium">In Stock:</span> {product.quantity} units</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;