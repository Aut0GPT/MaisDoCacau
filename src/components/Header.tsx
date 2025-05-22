'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-10 bg-amber-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-40 h-12">
            <Image 
              src="/logo.png" 
              alt="Mais do Cacau" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[var(--color-primary)]"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink href="/category/delicacies">Delícias</NavLink>
          <NavLink href="/category/pantry">Gourmet</NavLink>
          <NavLink href="/category/healthy">Saudável</NavLink>
          <NavLink href="/category/spirits">Cauchaça</NavLink>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-amber-50 shadow-md md:hidden">
            <nav className="flex flex-col p-4 space-y-3">
              <NavLink href="/category/delicacies" onClick={() => setIsMenuOpen(false)}>Delícias</NavLink>
              <NavLink href="/category/pantry" onClick={() => setIsMenuOpen(false)}>Gourmet</NavLink>
              <NavLink href="/category/healthy" onClick={() => setIsMenuOpen(false)}>Saudável</NavLink>
              <NavLink href="/category/spirits" onClick={() => setIsMenuOpen(false)}>Cauchaça</NavLink>
            </nav>
          </div>
        )}

        {/* Cart Icon */}
        <Link href="/cart" className="flex items-center text-[var(--color-primary)] relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">{totalItems}</span>
          )}
          <span className="ml-1 text-sm font-medium">Cart</span>
        </Link>
      </div>
    </header>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
