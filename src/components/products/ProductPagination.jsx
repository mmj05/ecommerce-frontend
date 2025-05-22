// src/components/products/ProductPagination.jsx
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductPagination = ({ currentPage, totalPages, onPageChange }) => {
  // No need to show pagination if there's only one page
  if (totalPages <= 1) return null;
  
  // Create array of page numbers to display
  const getPageNumbers = () => {
    // Show at most 5 page numbers, with the current page in the middle if possible
    const pageNumbers = [];
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + 4);
    
    // Adjust start page if end page is at max
    if (endPage === totalPages - 1) {
      startPage = Math.max(0, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center items-center mt-6">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <span className="sr-only">Previous</span>
          <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        
        {/* Show first page if not in visible range */}
        {pageNumbers[0] > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {pageNumbers[0] > 1 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}
          </>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              currentPage === number
                ? 'z-10 bg-primary text-white border-primary'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {number + 1}
          </button>
        ))}
        
        {/* Show last page if not in visible range */}
        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
            currentPage === totalPages - 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          <span className="sr-only">Next</span>
          <FiChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
      
      {/* Page info */}
      <div className="ml-4 text-sm text-gray-600">
        Page {currentPage + 1} of {totalPages}
      </div>
    </div>
  );
};

export default ProductPagination;