'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removido do carrinho');
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleClearCart = () => {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearCart();
      toast.success('Carrinho limpo com sucesso');
    }
  };

  const handleCheckout = () => {
    toast.info('Funcionalidade de checkout em desenvolvimento');
    // Here you would integrate with MiniKit payment functionality
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#6b4226]">Carrinho</h1>
          {items.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Limpar Carrinho
            </button>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#999" className="w-16 h-16 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xl text-gray-600 mb-6">Seu carrinho está vazio</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-[#6b4226] text-white rounded-md font-bold hover:bg-[#8b5d33] transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.product.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-24 h-24 bg-[#f9f5eb] rounded-md flex-shrink-0 relative">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-contain absolute inset-0 m-auto"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <Link href={`/product/${item.product.id}`} className="text-lg font-medium text-[#6b4226] hover:underline">
                          {item.product.name}
                        </Link>
                        <p className="text-gray-500 text-sm">{item.product.weight}</p>
                        <p className="font-bold text-[#8b5d33] mt-1">R$ {item.product.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-l-md"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          className="w-12 h-8 text-center border-y border-gray-200"
                        />
                        <button 
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-r-md"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right sm:ml-4">
                        <p className="font-bold text-[#8b5d33]">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-red-600 hover:text-red-800 text-sm mt-1"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4 text-[#6b4226]">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span>Calculado no checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 bg-[#6b4226] text-white rounded-md font-bold hover:bg-[#8b5d33] transition-colors"
                >
                  Finalizar Compra
                </button>
                
                <div className="mt-4">
                  <Link 
                    href="/" 
                    className="text-[#6b4226] hover:underline text-sm flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continuar Comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
