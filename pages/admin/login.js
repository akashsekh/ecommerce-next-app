// pages/admin/login.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const token = res.data?.token;

      if (!token) {
        alert('Login failed');
        setLoading(false);
        return;
      }

      // OPTIONAL: store token for later use if you want
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('admin_token', token);
      }

      // go to dashboard
      router.push('/admin');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <p>Sign in to access your NeoCommerce dashboard.</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Email</label>
          <input
            className="field-input"
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="field-label" style={{ marginTop: 8 }}>
            Password
          </label>
          <input
            className="field-input"
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="btn-row" style={{ marginTop: 14 }}>
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
