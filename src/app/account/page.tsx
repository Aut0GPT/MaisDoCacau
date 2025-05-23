'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast.info('Faça login para acessar sua conta');
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Generate loyalty points when user is loaded (simulated - would come from backend)
  useEffect(() => {
    if (user) {
      setLoyaltyPoints(Math.floor(Math.random() * 150) + 50);
    }
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    toast.success('Logout realizado com sucesso!');
    router.push('/');
  };

  // While loading or if no user, show a loading state
  if (isLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-4 max-w-4xl mx-auto w-full pb-20">
          <div className="animate-pulse bg-amber-50 rounded-lg p-8 mt-4 text-center">
            <div className="h-12 bg-amber-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-32 bg-amber-200 rounded mb-4"></div>
            <div className="h-8 bg-amber-200 rounded w-1/3 mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 max-w-4xl mx-auto w-full pb-20">
        {/* User Profile Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 text-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-white shadow-md mb-4 md:mb-0">
              {user.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={user.username || 'Perfil'} 
                  width={96} 
                  height={96} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-200 flex items-center justify-center text-amber-800 text-2xl font-bold">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            
            <div className="ml-0 md:ml-6 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.username || 'Usuário'}</h1>
              <p className="text-amber-100 mb-2">
                {user.verified ? (
                  <span className="flex items-center justify-center md:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-amber-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado com World ID
                  </span>
                ) : 'Membro do Mais do Cacau'}
              </p>
              
              <button 
                onClick={handleSignOut}
                className="mt-2 px-4 py-2 bg-white text-amber-800 rounded-md hover:bg-amber-100 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loyalty Points */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Pontos de Fidelidade</h2>
            
            <div className="flex items-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="ml-4 flex-grow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{loyaltyPoints}</div>
                    <div className="text-sm text-gray-500">Pontos acumulados</div>
                  </div>
                  
                  {loyaltyPoints >= 100 && (
                    <button className="bg-amber-600 text-white px-3 py-1 rounded-md text-sm hover:bg-amber-700 transition-colors">
                      Resgatar Cupom
                    </button>
                  )}
                </div>
                
                <div className="mt-3 text-sm">
                  <p>A cada 100 pontos, você ganha um cupom de R$ 10,00!</p>
                  <p className="mt-1 text-xs text-gray-600">Ganhe pontos a cada compra realizada no Mais do Cacau.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Meus Pedidos</h2>
              <div className="text-sm text-amber-600 hover:underline cursor-pointer">
                Ver todos
              </div>
            </div>
            
            {/* Empty state for orders */}
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto mb-3 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg">Você ainda não fez nenhum pedido.</p>
              <p className="text-sm mt-2">Seus pedidos aparecerão aqui quando você fizer uma compra.</p>
              <button 
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                onClick={() => router.push('/category/all')}
              >
                Explorar produtos
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
