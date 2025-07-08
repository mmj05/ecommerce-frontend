import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiHeart } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative bg-blue-800 min-h-[60vh] lg:h-[60vh]">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[60vh] lg:h-[50vh] py-8 lg:py-12">
          
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                <span className="block">Discover</span>
                <span className="block text-yellow-300">Premium Quality</span>
                <span className="block">Products</span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg md:text-xl text-blue-100 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Curated collection of exceptional products that blend style, quality, and sustainability for the modern lifestyle.
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold text-base rounded-lg shadow-lg hover:bg-blue-50 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out w-full sm:w-auto"
              >
                Shop Now
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/categories"
                className="group inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold text-base rounded-lg hover:bg-white hover:text-blue-600 transform hover:-translate-y-1 transition-all duration-300 ease-out w-full sm:w-auto"
              >
                Explore Collection
                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Social Proof Area */}
          <div className="relative flex items-center justify-center py-8">
            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-56 h-56 bg-white/5 rounded-full absolute -top-8 -left-8 blur-2xl"></div>
              <div className="w-72 h-72 bg-white/5 rounded-full absolute bottom-0 -right-10 blur-3xl"></div>
            </div>
            
            {/* Social Proof Content */}
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 shadow-xl w-full max-w-sm">
              <div className="flex flex-col items-center space-y-4 lg:space-y-6">
                <h3 className="text-white font-semibold text-lg text-center">Why Choose Us?</h3>
                
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-white font-medium">4.9/5 Rating</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FiTruck className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Free Delivery</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FiHeart className="w-5 h-5 text-red-300" />
                    <span className="text-white font-medium">Made with Love</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;