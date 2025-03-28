import { Helmet } from 'react-helmet';
import ProductDetailsComponent from '../components/products/ProductDetails';

const ProductDetails = () => {
  return (
    <>
      <Helmet>
        <title>Product Details - ShopEasy</title>
        <meta name="description" content="Detailed product information and specifications" />
      </Helmet>

      <ProductDetailsComponent />
    </>
  );
};

export default ProductDetails;