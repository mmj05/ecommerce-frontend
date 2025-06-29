// src/components/products/ProductList.jsx - Complete component with permission checks
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit, FiTrash2, FiPackage, FiDollarSign } from 'react-icons/fi';
import productService from '../../services/productService';
import { getProductImageUrl } from '../../utils/imageUtils';

const ProductList = ({ products, onEditProduct, onDeleteProduct, showPermissions = true }) => {
  const { user } = useSelector((state) => state.auth);
  const [productPermissions, setProductPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  // Check permissions for all products when component mounts or products change
  useEffect(() => {
    if (showPermissions && products && products.length > 0) {
      checkProductPermissions();
    }
  }, [products, showPermissions]);

  const checkProductPermissions = async () => {
    if (!user || !products) return;
    
    setLoading(true);
    const permissions = {};
    
    try {
      // Check permissions for each product
      await Promise.all(
        products.map(async (product) => {
          try {
            const [canEdit, canDelete] = await Promise.all([
              productService.canEditProduct(product.productId),
              productService.canDeleteProduct(product.productId)
            ]);
            
            permissions[product.productId] = {
              canEdit,
              canDelete
            };
          } catch (error) {
            console.error(`Error checking permissions for product ${product.productId}:`, error);
            permissions[product.productId] = {
              canEdit: false,
              canDelete: isAdmin // Admin can always delete as fallback
            };
          }
        })
      );
      
      setProductPermissions(permissions);
    } catch (error) {
      console.error('Error checking product permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    if (quantity < 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {showPermissions && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
              {!showPermissions && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products && products.length > 0 ? (
              products.map((product) => {
                const stockStatus = getStockStatus(product.quantity);
                const permissions = productPermissions[product.productId] || { canEdit: true, canDelete: true };
                
                return (
                  <tr key={product.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image && product.image !== 'default.png' ? (
                            <img 
                              src={getProductImageUrl(product.image)} 
                              alt={product.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiPackage className="text-gray-400 text-xl" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {product.productName}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            ID: {product.productId}
                          </div>
                          {product.description && (
                            <div className="text-xs text-gray-400 max-w-xs truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <FiDollarSign className="w-3 h-3 mr-1" />
                          {formatCurrency(product.specialPrice || product.price)}
                        </div>
                        {product.discount > 0 && (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.price)}
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              {product.discount}% OFF
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-medium">{product.quantity}</span>
                        <span className="text-xs text-gray-500">units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showPermissions ? (
                        // Show permission-based actions
                        loading ? (
                          <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                        ) : (
                          <div className="flex justify-end items-center space-x-3">
                            {permissions.canEdit ? (
                              <button
                                onClick={() => onEditProduct(product)}
                                className="text-primary hover:text-primary-dark transition-colors flex items-center"
                                title="Edit Product"
                              >
                                <FiEdit className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                            ) : (
                              <span className="text-gray-300 flex items-center" title="You don't have permission to edit this product">
                                <FiEdit className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </span>
                            )}
                            
                            {permissions.canDelete ? (
                              <button
                                onClick={() => onDeleteProduct(product.productId)}
                                className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                                title="Delete Product"
                              >
                                <FiTrash2 className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            ) : (
                              <span className="text-gray-300 flex items-center" title="You don't have permission to delete this product">
                                <FiTrash2 className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Delete</span>
                              </span>
                            )}
                            
                            {isAdmin && !permissions.canEdit && (
                              <span className="text-xs text-blue-600 px-2 py-1 bg-blue-100 rounded" title="Admin view - You can delete but not edit this product">
                                Admin View
                              </span>
                            )}
                          </div>
                        )
                      ) : (
                        // Show all actions (for seller's own products)
                        <div className="flex justify-end items-center space-x-3">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="text-primary hover:text-primary-dark transition-colors flex items-center"
                            title="Edit Product"
                          >
                            <FiEdit className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          
                          <button
                            onClick={() => onDeleteProduct(product.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={showPermissions ? 5 : 5} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <FiPackage className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">
                      {showPermissions 
                        ? "No products are available to display." 
                        : "You haven't created any products yet."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Legend for permission indicators */}
      {showPermissions && isAdmin && products && products.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
                <span><strong>Admin View:</strong> Can delete any product, can only edit owned products</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                <span>Disabled actions indicate insufficient permissions</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Product count footer */}
      {products && products.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;