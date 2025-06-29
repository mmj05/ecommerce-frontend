import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const ProductsFilter = ({ categories, onFilterChange, currentCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availability, setAvailability] = useState({
    inStock: false,
    onSale: false
  });

  useEffect(() => {
    // Update selected category when currentCategory prop changes
    setSelectedCategory(currentCategory || '');
  }, [currentCategory]);

  const handleCategoryChange = (categoryId) => {
    // Toggle category selection
    const newCategory = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(newCategory);
    
    onFilterChange({
      category: newCategory,
      price: priceRange.min || priceRange.max ? priceRange : null,
      availability: availability.inStock || availability.onSale ? availability : null
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and empty string
    if (value === '' || /^\d+$/.test(value)) {
      setPriceRange({ ...priceRange, [name]: value });
    }
  };

  const handleAvailabilityChange = (type) => {
    const newAvailability = { ...availability, [type]: !availability[type] };
    setAvailability(newAvailability);
    
    onFilterChange({
      category: selectedCategory,
      price: priceRange.min || priceRange.max ? priceRange : null,
      availability: newAvailability.inStock || newAvailability.onSale ? newAvailability : null
    });
  };

  const applyPriceFilter = () => {
    onFilterChange({
      category: selectedCategory,
      price: priceRange.min || priceRange.max ? priceRange : null,
      availability: availability.inStock || availability.onSale ? availability : null
    });
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setAvailability({ inStock: false, onSale: false });
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {(selectedCategory || priceRange.min || priceRange.max || availability.inStock || availability.onSale) && (
          <button
            onClick={resetFilters}
            className="text-sm text-primary hover:text-primary-dark flex items-center"
          >
            <FiX className="mr-1" /> Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.categoryId} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.categoryId}`}
                  checked={selectedCategory === category.categoryId.toString()}
                  onChange={() => handleCategoryChange(category.categoryId.toString())}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor={`category-${category.categoryId}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {category.categoryName}
                </label>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Loading categories...</p>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-price" className="sr-only">
              Minimum Price
            </label>
            <input
              type="text"
              id="min-price"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              placeholder="Min"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">
              Maximum Price
            </label>
            <input
              type="text"
              id="max-price"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              placeholder="Max"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <button
          onClick={applyPriceFilter}
          disabled={!priceRange.min && !priceRange.max}
          className="mt-2 w-full bg-gray-100 text-gray-800 px-4 py-2 rounded font-medium text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Price
        </button>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in-stock"
              checked={availability.inStock}
              onChange={() => handleAvailabilityChange('inStock')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="in-stock"
              className="ml-2 block text-sm text-gray-700"
            >
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="on-sale"
              checked={availability.onSale}
              onChange={() => handleAvailabilityChange('onSale')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="on-sale"
              className="ml-2 block text-sm text-gray-700"
            >
              On Sale
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;