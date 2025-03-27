import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-dark">
      <div className="container-custom py-16 md:py-24 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop With Ease, Anytime, Anywhere
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover the best products at unbeatable prices. Shop smart, shop with ShopEasy.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 z-10 relative">
              <Link
                to="/products"
                className="btn bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-full font-semibold text-base"
              >
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold text-base"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          {/* <div className="hidden md:block relative">
            <div className="bg-white rounded-lg p-6 shadow-2xl transform rotate-3 transition-transform hover:rotate-0">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Shopping illustration"
                className="w-full h-auto rounded"
              />
              <div className="absolute -bottom-4 -left-4 bg-accent text-white px-4 py-2 rounded-full font-bold">
                Up to 50% OFF
              </div>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Wave divider */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          fill="#f9fafb"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div> */}
    </div>
  );
};

export default Hero;