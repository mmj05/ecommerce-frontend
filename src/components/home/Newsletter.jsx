import { useState } from 'react';
import { FiMail } from 'react-icons/fi';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real app, you would call an API to submit the email
    // For now, let's just simulate a successful subscription
    setSubscribed(true);
    setError('');
    setEmail('');

    // Reset the success message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container-custom">
        <div className="bg-primary rounded-lg p-8 md:p-12 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
              <FiMail className="text-primary text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-white mb-8 text-lg">
              Stay updated with our latest products, exclusive offers, and promotions.
            </p>

            {subscribed ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p>Thank you for subscribing! You'll start receiving our newsletters soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-grow">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                      error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                  />
                  {error && (
                    <p className="mt-1 text-red-300 text-sm text-left">
                      {error}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;