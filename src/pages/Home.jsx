import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { fetchAllProducts } from '../features/products/productSlice';
import { fetchAllCategories } from '../features/categories/categorySlice';

// Components
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoriesShowcase from '../components/home/CategoriesShowcase';
import Promos from '../components/home/Promos';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

const Home = () => {
  const dispatch = useDispatch();
  const {
    products: productsList,
    isLoading: productsLoading
  } = useSelector((state) => state.products);

  const {
    categories: categoriesList,
    isLoading: categoriesLoading
  } = useSelector((state) => state.categories);

  useEffect(() => {
    // Fetch only if the data isn't already in the store (prevents duplicate requests)
    if (!productsLoading && productsList.length === 0) {
      dispatch(fetchAllProducts({ pageNumber: 0, pageSize: 8, sortBy: 'productId', sortOrder: 'asc' }));
    }

    if (!categoriesLoading && categoriesList.length === 0) {
      dispatch(fetchAllCategories({ pageNumber: 0, pageSize: 10, sortBy: 'categoryId', sortOrder: 'asc' }));
    }
  }, [dispatch, productsLoading, categoriesLoading, productsList.length, categoriesList.length]);

  return (
    <>
      <Helmet>
        <title>FlipDot - Shop With Ease</title>
        <meta name="description" content="Shop the best products at unbeatable prices. FlipDot is your one-stop destination for all your shopping needs." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <Hero />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Category Showcase */}
        <CategoriesShowcase />

        {/* Promos Section */}
        <Promos />

        {/* Testimonials */}
        <Testimonials />

        {/* Newsletter */}
        <Newsletter />
      </div>
    </>
  );
};

export default Home;