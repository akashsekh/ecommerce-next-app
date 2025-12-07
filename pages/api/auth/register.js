const bcrypt = require('bcryptjs');
const { User } = require('../../../../models');
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { name,email,password } = req.body;
  try{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password:hash });
    res.status(201).json({ id:user.id, email:user.email });
  }catch(err){ res.status(500).json({ error: err.message }); }
}
