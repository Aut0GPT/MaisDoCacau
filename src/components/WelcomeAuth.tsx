'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { walletAuth } from '@/auth/wallet';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface WelcomeAuthProps {
  onAuthenticated: () => void;
}

export default function WelcomeAuth({ onAuthenticated }: WelcomeAuthProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isInstalled } = useMiniKit();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already authenticated before
    const hasAuthenticated = localStorage.getItem('hasAuthenticated');
    if (!hasAuthenticated) {
      // Show the welcome screen if user hasn't authenticated before
      setIsVisible(true);
    } else {
      // Skip the welcome screen if user has already authenticated
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleAuthenticate = async () => {
    try {
      setIsLoading(true);
      
      if (!isInstalled) {
        toast.error('Este app precisa ser executado dentro do World App para funcionar corretamente.');
        // For development, we'll allow skipping authentication
        setIsVisible(false);
        localStorage.setItem('hasAuthenticated', 'true');
        onAuthenticated();
        return;
      }
      
      // Authenticate with wallet
      await walletAuth();
      
      // Mark user as authenticated
      localStorage.setItem('hasAuthenticated', 'true');
      
      // Hide welcome screen
      setIsVisible(false);
      
      // Call the onAuthenticated callback
      onAuthenticated();
      
      toast.success('Autenticação realizada com sucesso!');
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Erro na autenticação. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // For development purposes, allow skipping
    setIsVisible(false);
    localStorage.setItem('hasAuthenticated', 'true');
    onAuthenticated();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Image 
            src="/images/products/ChadeCacau30gpartedafrente.png" 
            alt="Mais do Cacau" 
            width={120} 
            height={120} 
            className="rounded-full bg-amber-50 p-2"
            onError={() => {
              console.log('Product image failed to load');
            }}
          />
        </div>
        
        <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">
          Bem-vindo ao Mais do Cacau
        </h2>
        
        <p className="text-gray-700 mb-6 text-center">
          Para uma experiência completa, autentique-se com sua carteira World ID.
          Isso permitirá que você compre produtos e receba recompensas.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className="w-full py-3 bg-amber-800 text-white font-semibold rounded-lg hover:bg-amber-900 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Autenticando...' : 'Autenticar com World ID'}
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={handleSkip}
              className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Pular (apenas em desenvolvimento)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
