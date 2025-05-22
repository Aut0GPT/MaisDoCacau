'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { walletAuth } from '@/auth/wallet';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface User {
  address: string;
  username: string;
  verified: boolean;
}

export default function Account() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const { isInstalled } = useMiniKit();
  
  // Check if user is already authenticated
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    setError(null);
    
    try {
      if (!isInstalled) {
        // If MiniKit is not installed, show error message
        toast.error('Este app precisa ser executado dentro do World App para autenticação completa.');
        
        // For development purposes, we'll simulate a successful authentication
        if (process.env.NODE_ENV === 'development') {
          const userData: User = {
            address: '0x1234...5678',
            username: 'Usuário World ID (Dev)',
            verified: true
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setLoyaltyPoints(Math.floor(Math.random() * 150) + 50);
        } else {
          setError('Este app precisa ser executado dentro do World App.');
        }
      } else {
        // Use MiniKit wallet authentication
        await walletAuth();
        
        // Get user info from MiniKit
        // For development, we'll use a fallback since we can't directly access MiniKit methods
        let userInfo;
        try {
          // Try to get user info from MiniKit if available
          if (typeof window !== 'undefined' && window.MiniKit && 'getUserInfo' in window.MiniKit) {
            userInfo = await (window.MiniKit as any).getUserInfo();
          }
        } catch (error) {
          console.error('Error getting user info from MiniKit:', error);
        }
        
        if (userInfo) {
          const userData: User = {
            address: userInfo.walletAddress || '0x0000',
            username: userInfo.username || 'Usuário World ID',
            verified: true
          };
          
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          
          // Simulate loyalty points (would come from backend in real app)
          setLoyaltyPoints(Math.floor(Math.random() * 150) + 50);
          
          toast.success('Autenticação realizada com sucesso!');
        } else {
          throw new Error('Não foi possível obter informações do usuário');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro durante a autenticação. Por favor, tente novamente.');
      console.error('Authentication error:', err);
      toast.error('Erro na autenticação. Por favor, tente novamente.');
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setLoyaltyPoints(0);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('account.title')}</h1>
          <LanguageSwitcher />
        </div>
        
        {!user ? (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto text-[var(--color-primary)] mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">{t('account.signIn')}</h2>
              <p className="text-gray-600 mb-6">
                Faça login com World ID para acessar sua conta, histórico de pedidos e benefícios exclusivos.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            <button
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Autenticando...
                </span>
              ) : (
                t('account.verifyWithWorldID')
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User Profile */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="bg-[var(--color-accent)] rounded-full h-16 w-16 flex items-center justify-center text-[var(--color-primary)] text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <p className="text-gray-600 text-sm">{user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}</p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {t('account.signOut')}
                  </button>
                </div>
              </div>
              
              {/* Loyalty Program */}
              <div className="bg-amber-100 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{t('account.cacauClub')}</h3>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[var(--color-primary)] mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span className="font-medium">{t('account.loyaltyPoints')}:</span>
                  <span className="ml-2 font-bold text-[var(--color-primary)]">{loyaltyPoints}</span>
                </div>
                <div className="mt-2 text-sm">
                  A cada 100 pontos, você ganha um cupom de R$ 10,00 para sua próxima compra!
                </div>
              </div>
            </div>
            
            {/* Order History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">{t('account.orders')}</h2>
              
              {/* This would be populated with real order data in a production app */}
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 mx-auto mb-3 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>Você ainda não fez nenhum pedido.</p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
