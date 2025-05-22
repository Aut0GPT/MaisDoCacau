'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[var(--color-primary)] text-white z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <NavItem 
            href="/" 
            label="Início" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            } 
            isActive={pathname === '/'}
          />
          
          <NavItem 
            href="/category/all" 
            label="Produtos" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            } 
            isActive={pathname.includes('/category')}
          />
          
          <NavItem 
            href="/cart" 
            label="Carrinho" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            } 
            isActive={pathname === '/cart'}
          />
          
          <NavItem 
            href="/account" 
            label="Conta" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            } 
            isActive={pathname === '/account'}
          />
        </div>
      </div>
    </footer>
  );
}

function NavItem({ 
  href, 
  label, 
  icon, 
  isActive 
}: { 
  href: string; 
  label: string; 
  icon: React.ReactNode; 
  isActive: boolean;
}) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center ${isActive ? 'text-[var(--color-accent)]' : 'text-white'}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
