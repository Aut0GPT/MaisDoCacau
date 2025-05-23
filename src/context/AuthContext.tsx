'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { getOrCreateUserProfile } from '@/lib/supabase';
import type { MiniKitGlobal } from '@/types/minikit';

export interface User {
  address: string;
  username: string;
  verified: boolean;
  profileImage?: string;
  email?: string;
  worldId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isInstalled } = useMiniKit();

  // Check for existing user session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // First check localStorage for existing user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('User restored from localStorage:', userData);
        } else if (isInstalled && typeof window !== 'undefined' && window.MiniKit) {
          // If no stored user but MiniKit is available, try to get user info
          try {
            if ('getUserInfo' in window.MiniKit) {
              const userInfo = await (window.MiniKit as MiniKitGlobal).getUserInfo();
              if (userInfo && userInfo.username) {
                const userData: User = {
                  address: userInfo.walletAddress || '0x0000',
                  username: userInfo.username,
                  verified: true,
                  profileImage: userInfo.profileImage || userInfo.profilePictureUrl,
                  email: userInfo.email,
                  worldId: userInfo.worldId
                };
                
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('User fetched from MiniKit:', userData);
              }
            }
          } catch (error) {
            console.error('Error getting user info from MiniKit:', error);
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, [isInstalled]);

  const login = async (userData: User) => {
    try {
      // Store user in Supabase if they have a wallet address
      if (userData.address && userData.address !== '0x0000') {
        const userProfile = await getOrCreateUserProfile(userData.address, userData.username);
        console.log('User profile in Supabase:', userProfile);
        
        // Update userData with any additional info from Supabase
        if (userProfile) {
          userData = {
            ...userData,
            // Add any additional fields from Supabase if needed
          };
        }
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('hasAuthenticated', 'true');
      console.log('User logged in:', userData);
      toast.success(`Bem-vindo, ${userData.username}!`);
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Erro ao fazer login. Por favor, tente novamente.');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('hasAuthenticated');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
