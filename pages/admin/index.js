// pages/admin/index.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    category: '',
    inStock: 0,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null); // null = logged out
  const [editingId, setEditingId] = useState(null);

  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Load products when token is available (after login)
  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  async function loadProducts() {
    if (!token) return;

    try {
      const res = await axios.get(
        `/api/products?q=${encodeURIComponent(q)}&category=${encodeURIComponent(
          categoryFilter
        )}`
      );
      const payload = res.data;
      const list = Array.isArray(payload) ? payload : payload.data || [];
      setProducts(list);
    } catch (err) {
      console.error(err);
      alert('Failed to load products');
    }
  }

  async function login() {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const t = res.data?.token;
      if (!t) return alert('Login failed');

      setToken(t);
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      alert('Logged in');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  }

  function logout() {
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    setProducts([]);
    setEditingId(null);
    alert('Logged out');
  }

  function ensureLoggedIn() {
    if (!token) {
      alert('Please login first');
      return false;
    }
    return true;
  }

  async function save() {
    if (!ensureLoggedIn()) return;

    const payload = {
      title: form.title,
      price: parseFloat(form.price) || 0,
      description: form.description,
      images: form.image ? [form.image] : [],
      category: form.category,
      inStock: parseInt(form.inStock) || 0,
    };

    try {
      if (editingId) {
        await axios.put('/api/products/' + editingId, payload);
        alert('Product updated');
      } else {
        await axios.post('/api/products', payload);
        alert('Product created');
      }

      setForm({
        title: '',
        price: '',
        description: '',
        image: '',
        category: '',
        inStock: 0,
      });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  }

  function edit(p) {
    if (!ensureLoggedIn()) return;

    setEditingId(p.id);
    setForm({
      title: p.title || '',
      price: p.price || '',
      description: p.description || '',
      image: (p.images && p.images[0]) || '',
      category: p.category || '',
      inStock: p.inStock || 0,
    });
    window.scrollTo(0, 0);
  }

  async function remove(id) {
    if (!ensureLoggedIn()) return;
    if (!confirm('Delete this product?')) return;

    try {
      await axios.delete('/api/products/' + id);
      alert('Deleted');
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }

  async function uploadFile(e) {
    if (!ensureLoggedIn()) return;

    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await axios.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, image: res.data.url });
      alert('Image uploaded');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    }
  }

  function searchAndReload() {
    if (!ensureLoggedIn()) return;
    loadProducts();
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <span className="admin-badge">Admin</span>
            <h1>Store Control Center</h1>
            <p>Sign in to manage products, prices and inventory.</p>
          </div>

          <div className="admin-status">
            <span className={`status-dot ${token ? 'online' : 'offline'}`} />
            <span>{token ? 'Logged in' : 'Logged out'}</span>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="admin-main">
          {/* LOGIN CARD */}
          <section className="admin-card auth-card">
            <h2>Admin Login</h2>
            <p className="card-subtitle">
              Use your admin email and password to access the dashboard.
            </p>

            <label className="field-label">Email</label>
            <input
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="btn-row">
              <button className="btn primary" onClick={login}>
                Login
              </button>
              <button className="btn ghost" onClick={logout}>
                Logout
              </button>
            </div>

            {!token && (
              <p className="helper-text">
                You are currently logged out. The product tools will appear after
                you log in.
              </p>
            )}
          </section>

          {/* CREATE / EDIT CARD */}
          {token && (
            <section className="admin-card">
              <h2>{editingId ? 'Edit product' : 'Create product'}</h2>
              <p className="card-subtitle">
                Fill in the details below and click save. You can also upload an
                image file.
              </p>

              <div className="field-grid">
                <div>
                  <label className="field-label">Title</label>
                  <input
                    className="field-input"
                    placeholder="Product title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Price</label>
                  <input
                    className="field-input"
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <label className="field-label">Description</label>
              <textarea
                className="field-input"
                rows={3}
                placeholder="Short description of the product"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="field-grid">
                <div>
                  <label className="field-label">Image URL</label>
                  <input
                    className="field-input"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Upload image</label>
                  <input
                    className="field-input"
                    type="file"
                    onChange={uploadFile}
                  />
                </div>
              </div>

              <div className="field-grid">
                <div>
                  <label className="field-label">Category</label>
                  <input
                    className="field-input"
                    placeholder="e.g. mouse, keyboard"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="field-label">Stock</label>
                  <input
                    className="field-input"
                    type="number"
                    placeholder="0"
                    value={form.inStock}
                    onChange={(e) =>
                      setForm({ ...form, inStock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="btn-row right">
                <button className="btn primary" onClick={save}>
                  {editingId ? 'Update product' : 'Create product'}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* PRODUCTS LIST */}
        {token && (
          <section className="admin-card products-card">
            <div className="products-header">
              <div>
                <h2>Products</h2>
                <p className="card-subtitle">
                  Search, filter, edit or delete products in your store.
                </p>
              </div>

              <div className="products-filters">
                <input
                  className="field-input small"
                  placeholder="Search title…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <input
                  className="field-input small"
                  placeholder="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
                <button className="btn small" onClick={searchAndReload}>
                  Search
                </button>
              </div>
            </div>

            <div className="product-grid">
              {products.map((p) => (
                <div className="product-card" key={p.id}>
                  <div className="product-image-wrap">
                    <img
                      src={p.images?.[0] || '/placeholder.png'}
                      alt={p.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="product-info">
                    <h3>{p.title}</h3>
                    <p className="product-category">{p.category}</p>
                    <p className="product-desc">{p.description}</p>

                    <div className="product-meta">
                      <span className="product-price">₹{p.price}</span>
                      <span className="product-stock">
                        Stock: {p.inStock ?? 0}
                      </span>
                    </div>

                    <div className="btn-row">
                      <button
                        className="btn ghost small"
                        onClick={() => edit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn danger small"
                        onClick={() => remove(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <p className="empty-text">
                  No products found yet. Create your first product above.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
