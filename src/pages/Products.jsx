import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  fetchAllProducts, 
  fetchProductsByCategory, 
  searchProducts,
  fetchAllCategories
} from '../features/products/productSlice';

// Components
import ProductsHeader from '../components/products/ProductsHeader';
import ProductsList from '../components/products/ProductsList';
import ProductsFilter from '../components/products/ProductsFilter';
import ProductsPagination from '../components/products/ProductsPagination';
import ProductsSorting from '../components/products/ProductsSorting';
import { FiFilter } from 'react-icons/fi';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Get query parameters
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const pageNumber = parseInt(searchParams.get('page') || '0');
  const sortBy = searchParams.get('sortBy') || 'productId';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  
  const { products, categories, isLoading, error, pagination } = useSelector((state) => state.products);

  useEffect(() => {
    // Load all categories on component mount (used for filters)
    dispatch(fetchAllCategories({ 
      pageNumber: 0, 
      pageSize: 20, 
      sortBy: 'categoryId', 
      sortOrder: 'asc' 
    }));
    
    // Fetch products based on query parameters
    loadProducts();
  }, [dispatch, categoryId, searchQuery, pageNumber, sortBy, sortOrder]);
  
  const loadProducts = () => {
    const params = { 
      pageNumber, 
      pageSize: 12, 
      sortBy, 
      sortOrder 
    };
    
    if (searchQuery) {
      dispatch(searchProducts({ keyWord: searchQuery, ...params }));
    } else if (categoryId) {
      dispatch(fetchProductsByCategory({ categoryId, ...params }));
    } else {
      dispatch(fetchAllProducts(params));
    }
  };
  
  const handleSortChange = (newSortBy, newSortOrder) => {
    searchParams.set('sortBy', newSortBy);
    searchParams.set('sortOrder', newSortOrder);
    searchParams.set('page', '0'); // Reset to first page on sort change
    setSearchParams(searchParams);
  };
  
  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };
  
  const handleFilterChange = (filters) => {
    // Apply category filter
    if (filters.category) {
      searchParams.set('category', filters.category);
    } else {
      searchParams.delete('category');
    }
    
    // Reset to first page and update URL
    searchParams.set('page', '0');
    setSearchParams(searchParams);
    
    // Close filter sidebar on mobile after applying
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Calculate page title based on filters
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}" | ShopEasy`;
    }
    
    if (categoryId && categories.length > 0) {
      const category = categories.find(cat => cat.categoryId.toString() === categoryId);
      if (category) {
        return `${category.categoryName} | ShopEasy`;
      }
    }
    
    return 'All Products | ShopEasy';
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content="Browse our wide selection of products at ShopEasy - your one-stop shop for all your needs." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container-custom">
          <ProductsHeader 
            title={searchQuery ? `Search results for "${searchQuery}"` : 'Our Products'} 
            count={pagination?.totalElements || 0}
          />
          
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            {/* Mobile filter toggle */}
            <button 
              onClick={toggleFilters}
              className="md:hidden flex items-center justify-center bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-4"
            >
              <FiFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {/* Filter sidebar - hidden on mobile unless toggled */}
            <div className={`w-full md:w-1/4 lg:w-1/5 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <ProductsFilter 
                categories={categories} 
                onFilterChange={handleFilterChange}
                currentCategory={categoryId}
              />
            </div>
            
            {/* Main content */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <ProductsSorting 
                  sortBy={sortBy} 
                  sortOrder={sortOrder} 
                  onSortChange={handleSortChange} 
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              ) : products && products.length > 0 ? (
                <>
                  <ProductsList products={products} />
                  
                  <div className="mt-8">
                    <ProductsPagination 
                      currentPage={pagination?.pageNumber || 0}
                      totalPages={pagination?.totalPages || 0}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-600 text-lg">No products found. Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;