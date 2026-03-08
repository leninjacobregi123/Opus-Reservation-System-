import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { OpusButton } from '../common/UI';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51O7p8vSAn68VfU8Vf7V8V7V8V7V8V7V8V7V8V7V8V7V8V7V8V7V8V7V8V7V8V7V8'); // Test Key Placeholder

const CheckoutForm = ({ clientSecret, onPaymentSuccess, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent.id);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-black/40 p-6 rounded-3xl border border-white/10">
        <PaymentElement id="payment-element" />
      </div>
      
      {message && (
        <div id="payment-message" className="text-red-500 text-[10px] uppercase tracking-widest font-bold text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
          {message}
        </div>
      )}

      <OpusButton 
        disabled={isLoading || !stripe || !elements} 
        type="submit"
        className="w-full !py-10 !rounded-[35px] !text-[11px] !tracking-[1em]"
      >
        {isLoading ? "AUTHENTICATING..." : `SETTLE ₹${amount.toLocaleString()}`}
      </OpusButton>
    </form>
  );
};

const StripePayment = ({ amount, bookingId, onPaymentSuccess, axiosConfig, BACKEND_URL }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    const fetchIntent = async () => {
      try {
        const res = await axios.post(`${BACKEND_URL}/payments/create-intent`, {
          amount,
          booking_id: bookingId || 1 // Fallback for simulation
        }, axiosConfig());
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Failed to fetch payment intent");
      }
    };
    fetchIntent();
  }, [amount, bookingId, axiosConfig, BACKEND_URL]);

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#D4AF37',
      colorBackground: '#050505',
      colorText: '#ffffff',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '20px',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="w-full">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} amount={amount} />
        </Elements>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
           <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin mb-6"></div>
           <span className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold">Initializing Secure Gateway</span>
        </div>
      )}
    </div>
  );
};

export default StripePayment;
