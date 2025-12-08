// pages/api/auth/register.js

const bcrypt = require('bcryptjs');
// ✅ fixed path (3 levels up, not 4)
const { User } = require('../../../models');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
}