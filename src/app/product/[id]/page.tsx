'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProductById } from '@/data/products';

export default function ProductDetail() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  
  const productId = params.id as string;
  const product = getProductById(productId);
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#6b4226' }}>Produto não encontrado</h1>
            <Link 
              href="/" 
              style={{ color: '#6b4226', textDecoration: 'underline' }}
            >
              Voltar para a página inicial
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Function to handle adding to cart (simplified for now)
  const handleAddToCart = () => {
    alert(`Produto ${product.name} adicionado ao carrinho! (${quantity} unidades)`);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: '1' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link 
            href="/" 
            style={{ color: '#6b4226', display: 'flex', alignItems: 'center' }}
          >
            ← Voltar
          </Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '32px' }}>
          {/* Product Image */}
          <div style={{ height: '300px', backgroundColor: '#f9f5eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' }}>
            <Image 
              src={product.image} 
              alt={product.name} 
              width={300}
              height={300}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              onError={() => {
                // Log error for debugging
                console.log(`Image failed to load: ${product.image}`);
              }}
            />
          </div>
          
          {/* Product Info */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>{product.name}</h1>
            
            {product.containsAlcohol && (
              <div style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px', marginBottom: '16px' }}>
                +18 Produto alcoólico - Venda proibida para menores
              </div>
            )}
            
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5d33', marginBottom: '16px' }}>
              R$ {product.price.toFixed(2)}
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="quantity" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Quantidade:
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px 0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: '64px', height: '40px', border: '1px solid #f3f4f6', textAlign: 'center' }}
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '0 4px 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              style={{ width: '100%', padding: '12px', backgroundColor: '#6b4226', color: 'white', borderRadius: '4px', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px', border: 'none', cursor: 'pointer' }}
            >
              Adicionar ao Carrinho
            </button>
            
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Descrição</h2>
              <p style={{ color: '#4b5563' }}>{product.description}</p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Detalhes</h2>
              <ul style={{ paddingLeft: '20px', color: '#4b5563' }}>
                <li>Peso/Volume: {product.weight}</li>
                <li>Categoria: {product.category}</li>
                {product.containsAlcohol && (
                  <li style={{ color: '#b91c1c' }}>Contém álcool - Venda proibida para menores de 18 anos</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
