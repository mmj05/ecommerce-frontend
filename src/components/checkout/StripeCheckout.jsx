import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FiCreditCard } from 'react-icons/fi';

// Load Stripe outside of component render to avoid recreating Stripe object on every render
// Replace with your publishable key from Stripe Dashboard
const stripePromise = loadStripe('pk_test_51NwtSSA6N2XryKBX3Br6bsSlD7do9s6YMgb00IVAWBVQOiSmBbGA9OmibYkzMHafelcrCXMNNiZCjAA1zLVtX1Nz00w5AInhvu');

const StripeCheckout = ({ amount, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Create a Checkout Session
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ShopEasy Order',
            },
            unit_amount: Math.round(amount * 100), // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
    });

    if (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`w-full btn-primary py-3 flex items-center justify-center gap-2 ${
        isLoading ? 'opacity-70 cursor-wait' : ''
      }`}
    >
      <FiCreditCard />
      {isLoading ? 'Processing...' : `Pay with Stripe`}
    </button>
  );
};

export default StripeCheckout;