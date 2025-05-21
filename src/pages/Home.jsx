import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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

  useEffect(() => {
    // Load initial data needed for the homepage
    dispatch(fetchAllProducts({ pageNumber: 0, pageSize: 8, sortBy: 'productId', sortOrder: 'asc' }));
    dispatch(fetchAllCategories({ pageNumber: 0, pageSize: 10, sortBy: 'categoryId', sortOrder: 'asc' }));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>ShopEasy - Shop With Ease</title>
        <meta name="description" content="Shop the best products at unbeatable prices. ShopEasy is your one-stop destination for all your shopping needs." />
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