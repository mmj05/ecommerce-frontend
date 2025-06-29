import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiEye, FiCheck } from 'react-icons/fi';
import { addToCart, updateCartItem } from '../../features/cart/cartSlice';
import { getProductImageUrl } from '../../utils/imageUtils';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  
  // Check if product is already in cart
  useEffect(() => {
    const existingItem = cartItems.find(item => item.productId === product.productId);
    setIsInCart(!!existingItem);
  }, [cartItems, product.productId]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding || product.quantity === 0) return;
    
    setIsAdding(true);
    
    // If product is already in cart, use updateCartItem instead of addToCart
    const action = isInCart 
      ? dispatch(updateCartItem({ productId: product.productId, operation: 'increase' }))
      : dispatch(addToCart({ productId: product.productId, quantity: 1 }));
    
    action
      .then(() => {
        // Show "Added" feedback
        setIsAdded(true);
        
        // Reset after a delay
        setTimeout(() => {
          setIsAdded(false);
          setIsAdding(false);
        }, 1500);
      })
      .catch((error) => {
        console.error('Failed to add to cart:', error);
        setIsAdding(false);
      });
  };

  // Calculate discount percentage
  const discountPercentage = product.discount > 0
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  return (
    <div className="group card overflow-hidden transition-all duration-300 hover:shadow-lg bg-white rounded-lg">
      {/* Product Image */}
      <div className="relative">
        <Link to={`/products/${product.productId}`}>
          <img
            src={getProductImageUrl(product.image)}
            alt={product.productName}
            className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-full">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            className={`btn bg-white text-primary hover:bg-primary hover:text-white p-3 rounded-full transition-colors duration-200 ${
              isAdding ? 'opacity-70 cursor-wait' : ''
            } ${isAdded ? 'bg-green-500 text-white' : ''} ${
              product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Add to cart"
            disabled={isAdding || product.quantity === 0}
          >
            {isAdded ? <FiCheck size={20} /> : <FiShoppingCart size={20} />}
          </button>
          <Link
            to={`/products/${product.productId}`}
            className="btn bg-white text-primary hover:bg-primary hover:text-white p-3 rounded-full transition-colors duration-200"
            aria-label="View product"
          >
            <FiEye size={20} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <Link to={`/products/${product.productId}`} className="block mb-4">
          <h3 className="text-gray-800 font-semibold text-lg mb-3 truncate group-hover:text-primary">
            {product.productName}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              {product.discount > 0 ? (
                <>
                  <span className="text-xl font-bold text-primary">
                    ${product.specialPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              <span className={`text-sm font-medium ${
                product.quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.quantity === 0}
            className={`w-full btn btn-primary py-3 text-sm font-medium transition-all ${
              isAdding ? 'opacity-70 cursor-wait' : ''
            } ${isAdded ? 'bg-green-500 border-green-500' : ''} ${
              product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAdded ? 'Added' : product.quantity === 0 ? 'Out of Stock' : isInCart ? 'Add More' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;