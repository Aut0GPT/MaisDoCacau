'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff8e7', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image 
            src="/images/MaisDocacauLOGO.png" 
            alt="Mais do Cacau Logo" 
            width={100} 
            height={33} 
            style={{ height: 'auto', width: 'auto', maxWidth: '100px', objectFit: 'contain' }}
            onError={() => {
              // If logo fails to load, use text fallback
              console.log('Logo failed to load');
            }}
          />
        </Link>

        {/* Mobile menu button - only visible on small screens */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: 'none', color: '#6b4226', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '20px' }}>
          <NavLink href="/">Início</NavLink>
          <NavLink href="/category/all">Produtos</NavLink>
          <NavLink href="/notes">Notas</NavLink>
        </nav>

        {/* Mobile menu - simplified */}
        {isMenuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff8e7', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '16px' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <NavLink href="/" onClick={() => setIsMenuOpen(false)}>Início</NavLink>
              <NavLink href="/category/all" onClick={() => setIsMenuOpen(false)}>Produtos</NavLink>
              <NavLink href="/notes" onClick={() => setIsMenuOpen(false)}>Notas</NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      style={{ color: '#6b4226', fontWeight: 500, textDecoration: 'none' }}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
