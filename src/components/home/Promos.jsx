import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Promos = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Promo */}
          <div className="bg-primary/10 rounded-lg overflow-hidden shadow-lg relative">
            <div className="p-8 md:p-10">
              <span className="inline-block bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Special Offer
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                New Arrivals
              </h3>
              <p className="text-gray-700 mb-6 max-w-xs">
                Check out our latest products and get up to 20% discount on your first purchase!
              </p>
              <Link
                to="/products?sort=newest"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Shop Now <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="absolute -right-10 bottom-0 w-48 h-48 md:w-64 md:h-64 opacity-20 md:opacity-30">
              <div className="w-full h-full bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Second Promo */}
          <div className="bg-accent/10 rounded-lg overflow-hidden shadow-lg relative">
            <div className="p-8 md:p-10">
              <span className="inline-block bg-accent text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Limited Time
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Seasonal Sale
              </h3>
              <p className="text-gray-700 mb-6 max-w-xs">
                Enjoy big savings on selected items with discounts up to 50% off!
              </p>
              <Link
                to="/products?sale=true"
                className="inline-flex items-center text-accent font-medium hover:underline"
              >
                View Deals <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="absolute -right-10 bottom-0 w-48 h-48 md:w-64 md:h-64 opacity-20 md:opacity-30">
              <div className="w-full h-full bg-accent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promos;