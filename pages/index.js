// pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');

  // Load products from API
  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/api/products');
        const payload = res.data;
        const list = Array.isArray(payload) ? payload : payload.data || [];
        setProducts(list);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Safe filtered list
  const filtered = (Array.isArray(products) ? products : []).filter((p) => {
    const title = p.title?.toString().toLowerCase() || '';
    const cat = p.category?.toString().toLowerCase() || '';
    const qNorm = q.trim().toLowerCase();
    const cNorm = category.trim().toLowerCase();

    const titleMatch = qNorm ? title.includes(qNorm) : true;
    const catMatch = cNorm ? cat.includes(cNorm) : true;

    return titleMatch && catMatch;
  });

  function handlePrimaryCheckout() {
    if ((filtered.length === 0) && (products.length === 0)) {
      alert('Add at least one product from the admin panel first.');
      return;
    }
    window.location.href = '/checkout';
  }

  return (
    <div className="page-root">
      {/* TOP NAV BAR */}
      <header className="app-shell">
        <div className="logo-pill">
          <div className="logo-dot">N</div>
          <div className="logo-text">
            <span className="logo-title">NeoCommerce</span>
            <span className="logo-sub">Next.js · MySQL · Stripe</span>
          </div>
        </div>

        <nav className="nav-links">
          <Link href="/" className="nav-link nav-link-active">
            Home
          </Link>
          <Link href="/checkout" className="nav-link">
            Checkout
          </Link>
          <Link href="/admin" className="nav-link nav-link-accent">
            Admin
          </Link>
        </nav>
      </header>

      <main className="home-main">
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-left">
            <span className="pill pill-success">LIVE DEMO STORE</span>

            <h1 className="hero-title">
              Shop smarter
              <br />
              with <span className="hero-title-highlight">NeoCommerce.</span>
            </h1>

            <p className="hero-lead">
              A modern full-stack demo store built with Next.js 16, Stripe Checkout
              and a MySQL database. Add products from the admin dashboard and see
              them appear here instantly.
            </p>

            <div className="hero-actions">
              <button className="btn primary" onClick={handlePrimaryCheckout}>
                Start checkout
              </button>
              <Link href="/admin" className="btn secondary">
                Open admin panel
              </Link>
            </div>

            <div className="hero-tech-chips">
              <span className="chip">MySQL</span>
              <span className="chip">Sequelize</span>
              <span className="chip">JWT auth</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="stat-card stat-card-main">
              <h3 className="stat-heading">Built for learning</h3>
              <p className="stat-body">
                All product and order data is stored securely in your local MySQL
                instance via API routes. Use this project as a starting point for
                your own ecommerce ideas.
              </p>
            </div>

            <div className="stat-row">
              <div className="stat-card">
                <span className="stat-label">Products</span>
                <span className="stat-value">
                  {Array.isArray(products) ? products.length : 0}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Payments</span>
                <span className="stat-value">Stripe</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Database</span>
                <span className="stat-value">MySQL</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section className="products-section">
          <div className="products-header-row">
            <div>
              <h2 className="section-title">Products</h2>
              <p className="section-subtitle">
                Loaded from your MySQL database via Next.js API routes.
              </p>
            </div>

            <div className="products-filters">
              <input
                className="field-input search-input"
                placeholder="Search by title…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <input
                className="field-input search-input"
                placeholder="Filter by category…"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p className="helper-text">Loading products…</p>
          ) : filtered.length === 0 ? (
            <p className="helper-text">
              No products found. Try changing your search, or add products from
              the admin dashboard.
            </p>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <article className="product-card" key={p.id}>
                  <div className="product-image-wrap">
                    <img
                      src={p.images?.[0] || '/placeholder.png'}
                      alt={p.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="product-body">
                    <h3 className="product-title">{p.title}</h3>
                    <p className="product-category">
                      {p.category || 'General'}
                    </p>

                    <p className="product-description">
                      {p.description || 'No description provided yet.'}
                    </p>

                    <div className="product-meta-row">
                      <span className="product-price">
                        ₹
                        {typeof p.price === 'number'
                          ? p.price.toLocaleString('en-IN')
                          : p.price}
                      </span>
                      <span className="product-stock">
                        {p.inStock != null
                          ? '${p.inStock} in stock'
                          : 'In stock'}
                      </span>
                    </div>

                    <div className="product-actions">
                      <button
                        className="btn tiny ghost"
                        onClick={() =>
                          alert(
                            'In a real app this would add "${p.title}" to the cart.',
                          )
                        }
                      >
                        Add to cart
                      </button>
                      <button
                        className="btn tiny primary-outline"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.location.href = '/checkout';
                          }
                        }}
                      >
                        Buy now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}