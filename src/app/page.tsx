'use client';

// Import basic components and data
import { useState } from 'react';
import { products } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import WelcomeAuth from '@/components/WelcomeAuth';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Welcome Authentication Screen */}
      <WelcomeAuth onAuthenticated={handleAuthenticated} />
      
      <Header />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: '1' }}>
        <h1 style={{ color: '#6b4226', fontSize: '32px', marginBottom: '20px' }}>Mais do Cacau</h1>
        
        <div style={{ backgroundColor: '#6b4226', color: 'white', padding: '40px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>Produtos artesanais e gourmet de cacau</h2>
          <p style={{ fontSize: '18px' }}>Descubra delícias à base de cacau</p>
        </div>

        <h2 style={{ color: '#6b4226', fontSize: '24px', marginBottom: '20px' }}>Nossos Produtos</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {products.slice(0, 8).map(product => (
            <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
              onClick={() => window.location.href = `/product/${product.id}`}
            >
              <div style={{ height: '200px', backgroundColor: '#f9f5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', position: 'relative' }}>
                {/* Use Next.js Image component */}
                <Image 
                  src={product.image} 
                  alt={product.name}
                  width={200}
                  height={200}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  onError={() => {
                    // Log error for debugging
                    console.log(`Image failed to load: ${product.image}`);
                  }}
                />
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b4226', marginBottom: '10px' }}>{product.name}</h3>
                <p style={{ fontWeight: 'bold', color: '#8b5d33', fontSize: '16px', marginBottom: '8px' }}>R$ {product.price.toFixed(2)}</p>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>
                  {product.description.substring(0, 80)}...
                </p>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
                  {product.weight} • {product.category}
                  {product.containsAlcohol && <span style={{ color: 'red', marginLeft: '5px' }}>• +18</span>}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ flex: '1', padding: '8px', backgroundColor: '#6b4226', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Adicionar ao Carrinho
                  </button>
                  <Link href={`/product/${product.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: '#f3f4f6', color: '#6b4226', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold' }}>
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#f9f5eb', padding: '30px', borderRadius: '8px' }}>
          <h2 style={{ color: '#6b4226', fontSize: '24px', marginBottom: '20px' }}>Nossa História</h2>
          <p style={{ marginBottom: '15px' }}>
            Mais do Cacau é uma empresa familiar dedicada à produção artesanal de produtos derivados do cacau, valorizando a qualidade e a tradição. 
            Nossa missão é levar o melhor do cacau baiano para a sua mesa, com respeito à natureza e às pessoas envolvidas em cada etapa do processo.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
