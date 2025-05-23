'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Import the client component with no SSR
const ClientAccount = dynamic(() => import('./ClientAccount'), { ssr: false });

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ClientAccount />
      <Footer />
    </div>
  );
}
