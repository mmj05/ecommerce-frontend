import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FiGrid, FiSearch, FiPackage } from 'react-icons/fi';
import { fetchAllCategories } from '../features/categories/categorySlice';

const Categories = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { categories, isLoading, error, pagination } = useSelector((state) => state.categories);
  
  // Load categories on component mount
  useEffect(() => {
    dispatch(fetchAllCategories({ 
      pageNumber: 0, 
      pageSize: 50, // Get a larger number of categories for display
      sortBy: 'categoryName', 
      sortOrder: 'asc' 
    }));
  }, [dispatch]);
  
  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Shop by Categories | ShopEasy</title>
        <meta name="description" content="Browse our product categories to find exactly what you're looking for at ShopEasy." />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Shop by Categories</h1>
          
          {/* Search bar */}
          <div className="mb-8 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Categories Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <Link
                  key={category.categoryId}
                  to={`/products?category=${category.categoryId}`}
                  className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1"
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <FiPackage className="w-8 h-8 text-primary group-hover:text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {category.categoryName}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Browse products
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <FiGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h2>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No categories matching "${searchTerm}"`
                  : "There are no categories available at the moment."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;