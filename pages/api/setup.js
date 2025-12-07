export default async function handler(req,res){
  try{
    const { sequelize, Product, User } = require('../../models');
    await sequelize.sync({ alter:true });
    const count = await Product.count();
    if(count===0){
      await Product.create({ title:'Sample Robot Vacuum', description:'Smart vacuum', price:199.99, images:['/placeholder.png'], category:'electronics', inStock:10 });
    }
    // create default admin if not exists
    const admin = await User.findOne({ where: { email: 'admin@example.com' } });
    if(!admin){
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('password', 10);
      await User.create({ name:'Admin', email:'admin@example.com', password:hash, isAdmin:true });
    }
    res.status(200).json({ status:'ok' });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
