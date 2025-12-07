// pages/index.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('/api/products')
      .then((res) => {
        const payload = res.data;
        // Handle both: [] OR { data: [], meta: {...} }
        const list = Array.isArray(payload) ? payload : payload.data || [];
        setProducts(list);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h2>E-Commerce Platform</h2>
        <div>
          <Link href="/admin">Admin</Link> |{' '}
          <Link href="/checkout">Checkout</Link>
        </div>
      </header>

      <h1 style={{ marginBottom: 16 }}>Featured Products</h1>

      {/* Product grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: '1px solid #eee',
              padding: 12,
              borderRadius: 10,
              background: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            }}
          >
            {/* Image wrapper to keep consistent size */}
            <div
              style={{
                width: '100%',
                height: 220,           // fixed height for all images
                overflow: 'hidden',
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <img
                src={p.images?.[0] || '/placeholder.png'}
                alt={p.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',   // no stretching, nicely cropped
                  display: 'block',
                }}
              />
            </div>

            <h3 style={{ margin: '4px 0' }}>{p.title}</h3>
            <p style={{ margin: '4px 0', fontWeight: 600 }}>₹{p.price}</p>
            <p
              style={{
                margin: '4px 0',
                fontSize: 13,
                color: '#555',
                minHeight: 32,
                overflow: 'hidden',
              }}
            >
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
