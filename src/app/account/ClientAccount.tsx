'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { walletAuth } from '@/auth/wallet';
import { toast } from 'react-toastify';
import type { MiniKitGlobal } from '@/types/minikit';

interface User {
  address: string;
  username: string;
  verified: boolean;
  profileImage?: string;
  email?: string;
  worldId?: string;
}

export default function ClientAccount() {
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
    console.log('Starting authentication process...');
    
    try {
      if (!isInstalled) {
        // If MiniKit is not installed, show error message
        console.log('MiniKit not installed, using development mode authentication');
        toast.info('Modo de desenvolvimento: autenticação simulada.');
        
        // For development purposes, we'll simulate a successful authentication
        if (process.env.NODE_ENV === 'development') {
          const userData: User = {
            address: '0x1234...5678',
            username: 'Usuário World ID (Dev)',
            verified: true,
            profileImage: 'https://api.dicebear.com/7.x/micah/svg?seed=worldcoin',
            email: 'dev@worldcoin.org',
            worldId: 'wld:1234567890'
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setLoyaltyPoints(Math.floor(Math.random() * 150) + 50);
          toast.success('Autenticação simulada com sucesso!');
        } else {
          setError('Este app precisa ser executado dentro do World App.');
        }
      } else {
        console.log('MiniKit installed, proceeding with wallet authentication');
        
        // Use MiniKit wallet authentication
        try {
          const authResult = await walletAuth();
          console.log('Wallet authentication successful:', authResult);
          
          // Get user info from MiniKit
          let userInfo;
          try {
            console.log('Fetching user info from MiniKit...');
            // Try to get user info from MiniKit if available
            if (typeof window !== 'undefined' && window.MiniKit && 'getUserInfo' in window.MiniKit) {
              userInfo = await (window.MiniKit as MiniKitGlobal).getUserInfo();
              console.log('User info retrieved:', userInfo);
            }
          } catch (error) {
            console.error('Error getting user info from MiniKit:', error);
          }
          
          if (userInfo) {
            // Following World MiniApps best practices - always display usernames, not wallet addresses
            const userData: User = {
              address: userInfo.walletAddress || '0x0000',
              username: userInfo.username || 'Usuário World ID',
              verified: true,
              profileImage: userInfo.profileImage,
              email: userInfo.email,
              worldId: userInfo.worldId
            };
            
            console.log('User data prepared:', userData);
            
            // Save user data to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            // Simulate loyalty points (would come from backend in real app)
            setLoyaltyPoints(Math.floor(Math.random() * 150) + 50);
            
            toast.success('Autenticação realizada com sucesso!');
          } else {
            console.error('No user info returned from MiniKit');
            throw new Error('Não foi possível obter informações do usuário');
          }
        } catch (error) {
          console.error('Wallet authentication specific error:', error);
          throw error; // Re-throw to be caught by the outer catch
        }
      }
    } catch (err) {
      const error = err as Error;
      setError('Ocorreu um erro durante a autenticação. Por favor, tente novamente.');
      console.error('Authentication error:', error);
      toast.error(`Erro na autenticação: ${error.message || 'Tente novamente'}`);
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
    <main className="flex-grow container mx-auto px-4 py-6 overflow-y-auto">
      {!user ? (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">{t('account.title')}</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{t('account.worldIDVerification')}</h2>
            <p className="text-gray-600 mb-4">
              {t('account.verificationDescription')}
            </p>
            
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
        </div>
      ) : (
        <div className="space-y-8">
          {/* User Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row items-center mb-6">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.username} 
                  className="rounded-full h-24 w-24 object-cover border-4 border-[var(--color-accent)]"
                />
              ) : (
                <div className="bg-[var(--color-accent)] rounded-full h-24 w-24 flex items-center justify-center text-[var(--color-primary)] text-3xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <div className="flex flex-col space-y-1 mt-2">
                  <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email || 'Email não disponível'}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {user.verified ? 'Verificado com World ID' : 'Não verificado'}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                  </p>
                </div>
              </div>
              
              <div className="ml-auto mt-4 md:mt-0">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-secondary)] transition-colors"
                >
                  {t('account.signOut')}
                </button>
              </div>
            </div>
            
            {/* World ID Verification Badge */}
            {user.verified && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-blue-800">Verificado com World ID</h3>
                    <p className="text-sm text-blue-600">Sua identidade foi verificada com World ID, garantindo acesso a todos os recursos do app.</p>
                  </div>
                </div>
                {user.worldId && (
                  <div className="mt-2 text-xs text-blue-500 font-mono">
                    ID: {user.worldId}
                  </div>
                )}
              </div>
            )}
            
            {/* Loyalty Program */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-[var(--color-primary)] mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                {t('account.cacauClub')}
              </h3>
              
              <div className="mt-4 mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-[var(--color-primary)] h-4 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${Math.min(loyaltyPoints, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{t('account.loyaltyPoints')}:</span>
                  <span className="ml-2 font-bold text-[var(--color-primary)] text-xl">{loyaltyPoints}</span>
                </div>
                
                {loyaltyPoints >= 100 && (
                  <button className="bg-[var(--color-primary)] text-white px-3 py-1 rounded-md text-sm hover:bg-[var(--color-secondary)] transition-colors">
                    Resgatar Cupom
                  </button>
                )}
              </div>
              
              <div className="mt-3 text-sm">
                <p>A cada 100 pontos, você ganha um cupom de R$ 10,00 para sua próxima compra!</p>
                <p className="mt-1 text-xs text-gray-600">Ganhe pontos a cada compra realizada no Mais do Cacau.</p>
              </div>
            </div>
          </div>
          
          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('account.orders')}</h2>
              <div className="text-sm text-[var(--color-primary)] hover:underline cursor-pointer">
                Ver todos
              </div>
            </div>
            
            {/* This would be populated with real order data in a production app */}
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto mb-3 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg">Você ainda não fez nenhum pedido.</p>
              <p className="text-sm mt-2">Seus pedidos aparecerão aqui quando você fizer uma compra.</p>
              <button 
                className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-secondary)] transition-colors"
                onClick={() => window.location.href = '/category/all'}
              >
                Explorar produtos
              </button>
            </div>
            
            {/* Sample order for development/preview purposes - would be replaced with real data */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Pedido #WLD12345</span>
                      <span className="ml-3 text-xs text-gray-500">23/05/2025</span>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Entregue
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <img src="/images/products/cauchaça.jpg" alt="Cauchaça" className="w-12 h-12 object-contain" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Cauchaça Original - 700ml</div>
                      <div className="text-sm text-gray-500">1 x R$ 89,90</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                    <div className="text-sm">Total</div>
                    <div className="font-bold">R$ 89,90</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
