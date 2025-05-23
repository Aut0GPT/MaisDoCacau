'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { walletAuth } from '@/auth/wallet';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useAuth, User } from '@/context/AuthContext';
import type { MiniKitGlobal } from '@/types/minikit';
import { getOrCreateUserProfile } from '@/lib/supabase';

interface WelcomeAuthProps {
  onAuthenticated: () => void;
}

export default function WelcomeAuth({ onAuthenticated }: WelcomeAuthProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isInstalled } = useMiniKit();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleAuthenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Starting authentication process...');
      
      if (!isInstalled) {
        console.log('MiniKit not installed, using development mode authentication');
        toast.info('Modo de desenvolvimento: autenticação simulada.');
        
        // For development, we'll create a mock user
        const mockUser: User = {
          address: '0x1234...5678',
          username: 'Usuário World ID (Dev)',
          verified: true,
          profileImage: 'https://api.dicebear.com/7.x/micah/svg?seed=worldcoin',
          email: 'dev@worldcoin.org',
          worldId: 'wld:1234567890'
        };
        
        // Store user in AuthContext and Supabase
        await login(mockUser);
        
        // Hide welcome screen
        setIsVisible(false);
        onAuthenticated();
        return;
      }
      
      console.log('MiniKit installed, proceeding with wallet authentication');
      
      // Authenticate with wallet
      try {
        const authResult = await walletAuth();
        console.log('Wallet authentication successful:', authResult);
        
        // Get user info from MiniKit
        try {
          if (typeof window !== 'undefined' && window.MiniKit && 'getUserInfo' in window.MiniKit) {
            const userInfo = await (window.MiniKit as MiniKitGlobal).getUserInfo();
            console.log('User info from MiniKit:', userInfo);
            
            if (userInfo) {
              const walletAddress = userInfo.walletAddress || authResult.address || '0x0000';
              
              // Create user data with wallet address
              const userData: User = {
                address: walletAddress,
                username: userInfo.username || `User_${walletAddress.substring(0, 6)}`,
                verified: true,
                profileImage: userInfo.profileImage || userInfo.profilePictureUrl,
                email: userInfo.email,
                worldId: userInfo.worldId
              };
              
              // Store user in Supabase and AuthContext
              await getOrCreateUserProfile(walletAddress, userData.username);
              await login(userData);
              
              // Hide welcome screen and notify user
              setIsVisible(false);
              onAuthenticated();
              toast.success(`Bem-vindo, ${userData.username}!`);
            }
          }
        } catch (error) {
          console.error('Error getting user info from MiniKit:', error);
          // If we can't get user info, create a basic user from auth result
          const walletAddress = authResult.address || '0x0000';
          const basicUser: User = {
            address: walletAddress,
            username: `User_${walletAddress.substring(0, 6)}`,
            verified: true
          };
          
          // Store user in Supabase and AuthContext
          await getOrCreateUserProfile(walletAddress, basicUser.username);
          await login(basicUser);
          
          // Hide welcome screen and notify user
          setIsVisible(false);
          onAuthenticated();
          toast.success(`Bem-vindo, ${basicUser.username}!`);
        }
      } catch (error) {
        console.error('Wallet authentication error:', error);
        toast.error('Erro na autenticação com carteira. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Erro na autenticação. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [isInstalled, onAuthenticated, login, setIsLoading, setIsVisible]);

  const handleSkip = useCallback(() => {
    // For development purposes, allow skipping
    setIsVisible(false);
    localStorage.setItem('hasAuthenticated', 'true');
    onAuthenticated();
  }, [onAuthenticated, setIsVisible]);

  useEffect(() => {
    // Check if user has already authenticated before
    const hasAuthenticated = localStorage.getItem('hasAuthenticated');
    if (!hasAuthenticated) {
      // Show the welcome screen if user hasn't authenticated before
      setIsVisible(true);
      
      // Automatically attempt to authenticate if MiniKit is installed
      if (isInstalled) {
        handleAuthenticate();
      }
    } else {
      // Skip the welcome screen if user has already authenticated
      onAuthenticated();
    }
  }, [onAuthenticated, isInstalled, handleAuthenticate]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Image 
            src="/images/MaisDocacauLOGO.png" 
            alt="Mais do Cacau Logo" 
            width={120} 
            height={40} 
            className="bg-amber-50 p-2"
            onError={() => {
              console.log('Logo image failed to load');
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
