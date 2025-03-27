import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from '../../features/products/productSlice';
import ProductCard from '../products/ProductCard';
import { FiChevronRight } from 'react-icons/fi';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { featuredProducts, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllProducts({ pageNumber: 0, pageSize: 8, sortBy: 'productId', sortOrder: 'asc' }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading featured products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="flex items-center text-primary hover:text-primary-dark">
            <span>View All</span>
            <FiChevronRight className="ml-1" />
          </Link>
        </div>

        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;