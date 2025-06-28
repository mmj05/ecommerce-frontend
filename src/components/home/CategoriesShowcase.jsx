// src/components/home/CategoriesShowcase.jsx - FIXED
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiSmartphone, FiHome, FiHeart, FiWatch, FiBookOpen, FiGift } from 'react-icons/fi';

const CategoriesShowcase = () => {
  const { categories } = useSelector((state) => state.categories);

  // Sample category icons - in a real app, you'd want to map these to your actual categories
  const categoryIcons = {
    'Electronics': <FiSmartphone size={32} />,
    'Fashion': <FiWatch size={32} />,
    'Home & Furniture': <FiHome size={32} />,
    'Beauty & Health': <FiHeart size={32} />,
    'Books': <FiBookOpen size={32} />,
    'Gifts': <FiGift size={32} />,
    'Default': <FiShoppingBag size={32} />
  };

  // Fallback categories in case API doesn't return any
  const fallbackCategories = [
    { categoryId: 1, categoryName: 'Electronics' },
    { categoryId: 2, categoryName: 'Fashion' },
    { categoryId: 3, categoryName: 'Home & Furniture' },
    { categoryId: 4, categoryName: 'Beauty & Health' }
  ];

  const displayCategories = categories && categories.length > 0 ? categories : fallbackCategories;

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || categoryIcons['Default'];
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our wide selection of products across various categories to find exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.categoryId}
              to={`/products?category=${category.categoryId}`}
              className="group"
            >
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {getCategoryIcon(category.categoryName)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {category.categoryName}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesShowcase;