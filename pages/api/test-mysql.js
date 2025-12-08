export default function handler(req, res) {
  try {
    require('mysql2'); // try to load the package
    res.status(200).json({
      ok: true,
      message: 'mysql2 is available on Vercel'
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'mysql2 is NOT available',
      error: err.message
    });
  }
}