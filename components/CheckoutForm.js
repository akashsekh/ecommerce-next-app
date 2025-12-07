import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
export default function CheckoutForm(){ const stripe=useStripe(), elements=useElements(); const [msg,setMsg]=useState(''), [loading,setLoading]=useState(false);
async function submit(e){ e.preventDefault(); if(!stripe||!elements) return; setLoading(true); const { error } = await stripe.confirmPayment({ elements, confirmParams: { return_url: window.location.origin + '/checkout/success' } }); if(error) setMsg(error.message); setLoading(false); }
return (<form onSubmit={submit} style={{maxWidth:500}}><PaymentElement /><button disabled={!stripe||loading} style={{marginTop:12}}>{loading?'Processing...':'Pay'}</button>{msg && <p style={{color:'red'}}>{msg}</p>}</form>) }
