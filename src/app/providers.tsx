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
    
    // Check if user has already authenticated before
    const hasAuthenticated = localStorage.getItem('hasAuthenticated');
    if (hasAuthenticated) {
      // Skip the welcome screen if user has already authenticated
      setShowWelcome(false);
    }
  }, []);

  const handleAuthenticated = () => {
    console.log('Authentication completed, hiding welcome screen');
    setShowWelcome(false);
    localStorage.setItem('hasAuthenticated', 'true');
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
