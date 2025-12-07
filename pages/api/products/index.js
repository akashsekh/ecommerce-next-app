// pages/api/products/index.js
const { Product } = require('../../../models');
const { Op } = require('sequelize');
const { requireAdminApi } = require('../../../lib/auth');

export default async function handler(req,res){
  if(req.method==='GET'){
    const { q, category, page = 1, limit = 12 } = req.query;
    const where = {};
    if(q) where.title = { [Op.like]: `%${q}%` };
    if(category) where.category = category;
    const offset = (parseInt(page)-1) * parseInt(limit);
    const results = await Product.findAll({ where, limit: parseInt(limit), offset, order:[['createdAt','DESC']] });
    const count = await Product.count({ where });
    return res.status(200).json({ data: results, meta: { page: parseInt(page), limit: parseInt(limit), total: count } });
  }else if(req.method==='POST'){
    return requireAdminApi(async (req,res)=>{
      try{
        const p = await Product.create(req.body);
        res.status(201).json(p);
      }catch(err){ res.status(500).json({ error: err.message }); }
    })(req,res);
  }
  res.setHeader('Allow',['GET','POST']);
  res.status(405).end();
}
