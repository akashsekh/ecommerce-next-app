const jwt = require('jsonwebtoken');
const { User } = require('../models');
function getToken(req){ const h = req.headers.authorization || req.headers.Authorization; if(!h) return null; const p=h.split(' '); if(p.length===2 && p[0]==='Bearer') return p[1]; return null; }
function requireAdminApi(handler){ return async (req,res)=>{ try{ const token=getToken(req); if(!token) return res.status(401).json({ error:'No token' }); const data=jwt.verify(token, process.env.JWT_SECRET || 'secret'); const user=await User.findByPk(data.id); if(!user||!user.isAdmin) return res.status(403).json({ error:'Admin only' }); req.user = { id:user.id, isAdmin:user.isAdmin }; return handler(req,res); }catch(err){ return res.status(401).json({ error:'Unauthorized', detail: err.message }); } } }
module.exports = { requireAdminApi };
