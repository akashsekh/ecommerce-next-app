// pages/api/orders/create.js

// ✅ fixed path (3 levels up, not 4)
const { Order } = require('../../../models');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { items, totalAmount } = req.body;

    const order = await Order.create({
      items,
      totalAmount,
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}