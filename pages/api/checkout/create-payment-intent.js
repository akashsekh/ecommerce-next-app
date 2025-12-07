const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_replace');
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  try{
    const { items, currency='usd' } = req.body;
    const amount = items.reduce((s,i)=> s + Math.round(i.price*100)*i.quantity, 0);
    const paymentIntent = await stripe.paymentIntents.create({ amount, currency, automatic_payment_methods:{ enabled:true } });
    res.status(200).json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
  }catch(err){ res.status(500).json({ error: err.message }); }
}
