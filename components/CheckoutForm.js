// components/CheckoutForm.js
import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // after successful payment:
        return_url: '${window.location.origin}/checkout/success',
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Payment failed.');
      } else {
        setMessage('An unexpected error occurred.');
      }
    }

    setLoading(false);
  }

  if (!stripe || !elements) {
    return <p className="helper-text">Loading payment form…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <PaymentElement id="payment-element" />

      {message && <p className="payment-error">{message}</p>}

      <button
        type="submit"
        className="btn primary stripe-submit"
        disabled={loading || !stripe || !elements}
      >
        {loading ? 'Processing…' : 'Pay now'}
      </button>
    </form>
  );
}