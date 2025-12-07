import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE || '');
export default function CheckoutPage(){ const [clientSecret,setClientSecret]=useState(null);
useEffect(()=>{ fetch('/api/checkout/create-payment-intent', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items:[{ price:199.99, quantity:1 }] }) }).then(r=>r.json()).then(d=> setClientSecret(d.clientSecret)).catch(console.error); },[]);
if(!clientSecret) return <div style={{padding:20}}>Preparing payment...</div>;
return (<div style={{padding:20}}><h1>Checkout</h1><Elements stripe={stripePromise} options={{ clientSecret }}><CheckoutForm /></Elements></div>); }
