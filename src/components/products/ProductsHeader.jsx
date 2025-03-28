const ProductsHeader = ({ title, count }) => {
    return (
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">
          {count > 0 
            ? `Showing ${count} ${count === 1 ? 'product' : 'products'}`
            : 'No products found'
          }
        </p>
      </div>
    );
  };
  
  export default ProductsHeader;