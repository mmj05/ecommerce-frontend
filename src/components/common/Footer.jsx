import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-24">
          {/* Company Info */}
          <div className="flex flex-col">
            <h3 className="text-xl font-bold mb-4">FlipDot</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for all your shopping needs.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="https://tiktok.com" className="text-gray-400 hover:text-white" aria-label="TikTok">
                <FaTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="text-gray-400 mr-3 mt-1" />
                <span className="text-gray-400">123 E-Commerce Street, Digital City, 10001</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-gray-400 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FiMail className="text-gray-400 mr-3" />
                <span className="text-gray-400">support@flipdot.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} FlipDot. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="text-gray-400 hover:text-white text-sm">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;