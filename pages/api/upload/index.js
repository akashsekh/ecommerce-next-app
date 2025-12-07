// pages/api/upload/index.js
import formidable from 'formidable';
import fs from 'fs';
export const config = { api: { bodyParser: false } };

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  const CLOUDINARY_URL = process.env.CLOUDINARY_URL || null;
  if(!CLOUDINARY_URL){
    return res.status(500).json({ error: 'CLOUDINARY_URL not configured in .env' });
  }
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({ secure: true });
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(500).json({ error: err.message });
    const file = files.file;
    if(!file) return res.status(400).json({ error: 'No file' });
    cloudinary.uploader.upload(file.filepath || file.path, { folder: 'ecommerce' })
      .then(result => res.status(200).json({ url: result.secure_url }))
      .catch(e => res.status(500).json({ error: e.message }));
  });
}
