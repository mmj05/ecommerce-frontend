import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const ProductsSorting = ({ sortBy, sortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { label: 'Newest', value: 'productId', order: 'desc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
    { label: 'Name: A to Z', value: 'productName', order: 'asc' },
    { label: 'Name: Z to A', value: 'productName', order: 'desc' },
  ];

  // Find the current sort option label to display
  const currentSortOption = sortOptions.find(
    option => option.value === sortBy && option.order === sortOrder
  ) || sortOptions[0];

  const handleSortChange = (option) => {
    onSortChange(option.value, option.order);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">Sort by:</span>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between min-w-40 p-2 border border-gray-300 rounded bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <span>{currentSortOption.label}</span>
          <FiChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
            <ul className="py-1">
              {sortOptions.map((option) => (
                <li key={`${option.value}-${option.order}`}>
                  <button
                    onClick={() => handleSortChange(option)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      option.value === sortBy && option.order === sortOrder
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSorting;