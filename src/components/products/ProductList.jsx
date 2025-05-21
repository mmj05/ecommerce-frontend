// src/components/products/ProductList.jsx
import { useState } from 'react';
import { FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProductList = ({ products, onEditProduct, onDeleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-0 inset-y-0 flex items-center pl-3">
            <FiSearch className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Product table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inventory
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.productName}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">
                            <span className="text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category?.categoryName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      {product.discount > 0 ? (
                        <>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(product.specialPrice)}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-xs text-green-600">
                            {product.discount}% off
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.quantity} in stock
                    </div>
                    {product.quantity <= 5 && (
                      <div className="text-xs text-red-500">
                        Low stock
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/products/${product.productId}`}
                        className="text-gray-600 hover:text-primary"
                        title="View product"
                      >
                        <FiEye />
                      </Link>
                      <button
                        onClick={() => onEditProduct(product)}
                        className="text-primary hover:text-primary-dark"
                        title="Edit product"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.productId)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete product"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm 
                    ? `No products found matching "${searchTerm}"`
                    : 'No products available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;