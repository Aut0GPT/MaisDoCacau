'use client';

// Import basic components and data
import { useState, useEffect } from 'react';
import { getAllProducts, Product } from '@/lib/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { walletAuth } from '@/auth/wallet';
import { toast } from 'react-toastify';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    async function loadProducts() {
      try {
        const productData = await getAllProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: '1' }}>
        <h1 style={{ color: '#6b4226', fontSize: '32px', marginBottom: '20px' }}>Mais do Cacau</h1>
        
        <div style={{ backgroundColor: '#6b4226', color: 'white', padding: '40px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>Produtos artesanais e gourmet de cacau</h2>
          
          {isAuthenticated && user ? (
            <div style={{ margin: '15px 0', backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Bem-vindo, {user.username}!</p>
              <p style={{ fontSize: '14px', marginTop: '5px' }}>Aproveite nossas delícias exclusivas de cacau</p>
            </div>
          ) : (
            <div style={{ margin: '15px 0' }}>
              <button 
                onClick={async () => {
                  try {
                    setIsAuthenticating(true);
                    await walletAuth();
                  } catch (error) {
                    console.error('Authentication failed:', error);
                    toast.error('Falha na autenticação. Tente novamente.');
                  } finally {
                    setIsAuthenticating(false);
                  }
                }}
                disabled={isAuthenticating}
                style={{
                  backgroundColor: '#FFF',
                  color: '#6b4226',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isAuthenticating ? 'default' : 'pointer',
                  opacity: isAuthenticating ? 0.7 : 1,
                  marginBottom: '15px',
                  transition: 'all 0.2s ease'
                }}
              >
                {isAuthenticating ? 'Autenticando...' : 'Login com World ID'}
              </button>
              <p style={{ fontSize: '18px' }}>Descubra delícias à base de cacau</p>
            </div>
          )}
        </div>

        <h2 style={{ color: '#6b4226', fontSize: '24px', marginBottom: '20px' }}>Nossos Produtos</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {products.slice(0, 8).map(product => (
              <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <div style={{ height: '200px', backgroundColor: '#f9f5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', position: 'relative' }}>
                  {/* Use Next.js Image component */}
                  <Image 
                    src={product.image || '/images/products/product-placeholder.svg'} 
                    alt={product.name}
                    width={200}
                    height={200}
                    style={{ height: 'auto', width: 'auto', maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      // If image fails to load, replace with a placeholder
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/products/product-placeholder.svg';
                      console.log(`Image failed to load: ${product.image}, using placeholder`);
                    }}
                    unoptimized
                  />
                </div>
                <div style={{ padding: '15px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b4226', marginBottom: '10px' }}>{product.name}</h3>
                  <p style={{ fontWeight: 'bold', color: '#8b5d33', fontSize: '16px', marginBottom: '8px' }}>R$ {product.price.toFixed(2)}</p>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>
                    {product.description.substring(0, 80)}...
                  </p>
                  <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
                    {product.weight || 'N/A'} • {product.category}
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
        )}

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
