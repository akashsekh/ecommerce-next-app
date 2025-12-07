const { Order } = require('../../../../models');
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  try{
    const { stripeId, amount, currency, items, status='created' } = req.body;
    const order = await Order.create({ stripeId, amount, currency, items, status });
    res.status(201).json(order);
  }catch(err){ res.status(500).json({ error: err.message }); }
}
