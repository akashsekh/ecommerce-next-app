const { requireAdminApi } = require('../../../../lib/auth');
const { Order } = require('../../../../models');
export default requireAdminApi(async function handler(req,res){
  if(req.method!=='GET') return res.status(405).end();
  const orders = await Order.findAll({ order:[['createdAt','DESC']] });
  res.status(200).json(orders);
});
