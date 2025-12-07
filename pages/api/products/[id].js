// pages/api/products/[id].js
const { Product } = require('../../../models');
const { requireAdminApi } = require('../../../lib/auth');

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const p = await Product.findByPk(id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(p);
  } else if (req.method === 'PUT') {
    return requireAdminApi(async (req, res) => {
      try {
        const p = await Product.findByPk(id);
        if (!p) return res.status(404).json({ error: 'Not found' });
        await p.update(req.body);
        res.status(200).json(p);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })(req, res);
  } else if (req.method === 'DELETE') {
    return requireAdminApi(async (req, res) => {
      try {
        const p = await Product.findByPk(id);
        if (!p) return res.status(404).json({ error: 'Not found' });
        await p.destroy();
        res.status(200).json({ success: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })(req, res);
  }
  res.setHeader('Allow', ['GET','PUT','DELETE']);
  res.status(405).end();
}
