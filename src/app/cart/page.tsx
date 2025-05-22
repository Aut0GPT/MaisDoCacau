'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Cart() {
  // Simplified cart page without CartContext
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: '1', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#6b4226' }}>Carrinho</h1>
        
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#999" style={{ width: '64px', height: '64px', margin: '0 auto 16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p style={{ fontSize: '20px', marginBottom: '24px', color: '#666' }}>Seu carrinho está vazio</p>
          <Link 
            href="/" 
            style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#6b4226', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Continuar Comprando
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
