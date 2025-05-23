'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to avoid SSR issues with client components
const ClientCheckout = dynamic(() => import('./ClientCheckout'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Carregando...</div>
});

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
      <ClientCheckout />
    </Suspense>
  );
}
