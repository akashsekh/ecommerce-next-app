// pages/checkout.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  // Create a PaymentIntent via our API
  useEffect(() => {
    async function createIntent() {
      try {
        const res = await fetch('/api/checkout/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // you can pass amount or cart items here if you want
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to create payment session');
        }

        const data = await res.json();
        if (!data.clientSecret) {
          throw new Error('clientSecret missing from response');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        setError(
          err.message || 'Could not create payment session. Please try again.'
        );
      }
    }

    createIntent();
  }, []);

  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#6366f1',
            colorBackground: '#020617',
            borderRadius: '12px',
          },
        },
      }
    : undefined;

  return (
    <div className="page-root checkout-page">
      {/* same top pill nav as home */}
      <header className="app-shell">
        <div className="logo-pill">
          <div className="logo-dot">N</div>
          <div className="logo-text">
            <span className="logo-title">NeoCommerce</span>
            <span className="logo-sub">Next.js · MySQL · Stripe</span>
          </div>
        </div>

        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/checkout" className="nav-link nav-link-active">
            Checkout
          </Link>
          <Link href="/admin" className="nav-link nav-link-accent">
            Admin
          </Link>
        </nav>
      </header>

      <main className="checkout-main">
        <section className="checkout-shell">
          <div className="checkout-grid">
            {/* LEFT: Summary / text */}
            <div className="checkout-col-left">
              <span className="pill pill-success">Secure payment</span>

              <h1 className="checkout-title">Checkout</h1>

              <p className="checkout-lead">
                Complete your payment using Stripe. This is a demo checkout –
                use the test card <strong>4242 4242 4242 4242</strong> with any
                future expiry date and any CVC.
              </p>

              <div className="order-card">
                <h2 className="order-heading">Order summary</h2>
                <p className="order-subtitle">Your demo purchase (1 item)</p>

                <div className="order-row">
                  <div>
                    <div className="order-item-title">
                      Demo product from your store
                    </div>
                    <div className="order-item-sub">Configured via API</div>
                  </div>
                  <div className="order-item-price">₹—</div>
                </div>

                <div className="order-row order-row-small">
                  <span>Subtotal</span>
                  <span>₹—</span>
                </div>
                <div className="order-row order-row-small">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>

                <div className="order-row order-row-total">
                  <span>Total</span>
                  <span>₹—</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Stripe card form */}
            <div className="checkout-col-right">
              <div className="payment-panel">
                <h2 className="payment-heading">Payment details</h2>
                <p className="payment-subtitle">
                  Enter your card information below to complete the purchase.
                </p>

                {error && (
                  <p className="payment-error">
                    {error} Check your Stripe keys and server.
                  </p>
                )}

                {!clientSecret && !error && (
                  <p className="helper-text">Loading payment form…</p>
                )}

                {clientSecret && !error && (
                  <div className="stripe-box">
                    <Elements stripe={stripePromise} options={options}>
                      <CheckoutForm />
                    </Elements>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}