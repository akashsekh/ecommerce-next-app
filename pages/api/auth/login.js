const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models'); // <- fixed path

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const { email,password } = req.body;
  try{
    const user = await User.findOne({ where: { email } });
    if(!user) return res.status(401).json({ error:'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) return res.status(401).json({ error:'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
