'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Import the client component with no SSR
const ClientCart = dynamic(() => import('./ClientCart'), { ssr: false });

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ClientCart />
      <Footer />
    </div>
  );
}
