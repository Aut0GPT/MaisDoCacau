'use client';

import { ReactNode, useState, useEffect } from 'react';
import { CartProvider } from '@/context/CartContext';
import { ToastContainer } from 'react-toastify';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';
import WelcomeAuth from '@/components/WelcomeAuth';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }: { children: ReactNode }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAuthenticated = () => {
    setShowWelcome(false);
  };

  return (
    <MiniKitProvider>
      <CartProvider>
        {isClient && showWelcome && (
          <WelcomeAuth onAuthenticated={handleAuthenticated} />
        )}
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CartProvider>
    </MiniKitProvider>
  );
}
