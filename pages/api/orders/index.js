// pages/api/orders/index.js

// ✅ fixed path (3 levels up, not 4)
const { requireAdminApi } = require('../../../lib/auth');
const { Order } = require('../../../models');

export default requireAdminApi(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(orders);
  } catch (err) {
    console.error('Error loading orders:', err);
    return res.status(500).json({ error: 'Failed to load orders' });
  }
});