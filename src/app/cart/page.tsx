'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { t } = useTranslation();
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);
    
    try {
      if (paymentMethod === 'crypto') {
        // Simulate crypto payment (in a real app, this would use MiniKit)
        // For development purposes, we'll just simulate a successful payment after a delay
        setTimeout(() => {
          // Simulate successful payment
          clearCart();
          setIsCheckingOut(false);
          // In a real app, you'd send the order to your backend here
        }, 2000);
      } else {
        // In a real app, you'd integrate with a payment processor for card payments
        // This is just a simulation
        setTimeout(() => {
          clearCart();
          setIsCheckingOut(false);
        }, 2000);
      }
    } catch (err) {
      setCheckoutError('Ocorreu um erro durante o pagamento. Por favor, tente novamente.');
      console.error('Payment error:', err);
      setIsCheckingOut(false);
    }
  };
  
  // Calculate shipping cost (fixed for this demo)
  const shippingCost = items.length > 0 ? 15.00 : 0;
  
  // Calculate total cost
  const totalCost = subtotal + shippingCost;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">{t('cart.title')}</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xl mb-6">{t('cart.empty')}</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-md transition-colors"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <li key={`${item.product.id}-${index}`} className="p-4 flex items-center">
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name} 
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-[var(--color-primary)] font-bold">
                          R$ {item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="mx-2 w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-4 text-red-500 hover:text-red-700"
                        aria-label={t('cart.removeItem')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span>R$ {shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>{t('cart.total')}</span>
                    <span>R$ {totalCost.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('checkout.paymentMethod')}</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="crypto" 
                        checked={paymentMethod === 'crypto'} 
                        onChange={() => setPaymentMethod('crypto')}
                        className="mr-2"
                      />
                      <span>{t('checkout.payWithCrypto')} (WLD)</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="card" 
                        checked={paymentMethod === 'card'} 
                        onChange={() => setPaymentMethod('card')}
                        className="mr-2"
                      />
                      <span>{t('checkout.payWithCard')}</span>
                    </label>
                  </div>
                </div>
                
                {checkoutError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {checkoutError}
                  </div>
                )}
                
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    t('checkout.placeOrder')
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
