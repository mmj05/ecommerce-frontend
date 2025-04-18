// src/components/checkout/StripeCheckout.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { FiCreditCard } from 'react-icons/fi';
import { createOrder } from '../../features/orders/orderSlice';

// Replace with your publishable key from Stripe Dashboard
const stripePromise = loadStripe('pk_test_51NwtSSA6N2XryKBX3Br6bsSlD7do9s6YMgb00IVAWBVQOiSmBbGA9OmibYkzMHafelcrCXMNNiZCjAA1zLVtX1Nz00w5AInhvu');

const StripeCheckout = ({ amount, onSuccess, onCancel, orderTotal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Get Stripe.js instance
      const stripe = await stripePromise;

      // For demo purposes, we'll simulate a successful Stripe payment
      // In a real implementation, you would redirect to Stripe Checkout
      
      // Retrieve the pending order data from sessionStorage
      const pendingOrderData = JSON.parse(sessionStorage.getItem('pendingOrderData'));
      
      if (!pendingOrderData) {
        console.error('No pending order data found');
        setIsLoading(false);
        if (onCancel) onCancel();
        return;
      }
      
      // Make sure the payment method is at least 4 characters long
      // This fixes the validation constraint issue
      if (pendingOrderData.paymentMethod && pendingOrderData.paymentMethod.length < 4) {
        pendingOrderData.paymentMethod = 'card'; // Ensure 4+ characters
      }
      
      console.log('Processing order with data:', pendingOrderData);
      
      // Update payment info with Stripe-specific details
      const orderData = {
        ...pendingOrderData,
        pgName: 'Stripe',
        pgPaymentId: 'stripe_' + Date.now(), // Simulated Stripe payment ID
        pgStatus: 'completed',
        pgResponseMessage: 'Payment successful'
      };
      
      // Create order with the payment information
      const result = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order created successfully:', result);
      
      // Clear the pending order data
      sessionStorage.removeItem('pendingOrderData');
      
      // Call the success callback
      if (onSuccess) onSuccess();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
      
      // Call the cancel callback on error
      if (onCancel) onCancel();
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
      {isLoading ? 'Processing...' : `Pay with Stripe ($${orderTotal.toFixed(2)})`}
    </button>
  );
};

export default StripeCheckout;