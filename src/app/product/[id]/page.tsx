'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgeGate from '@/components/AgeGate';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { getProductById } from '@/data/products';

export default function ProductDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const { addToCart } = useCart();
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const productId = params.id as string;
  const product = getProductById(productId);
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Link 
              href="/" 
              className="text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (product.containsAlcohol && !ageVerified) {
      setShowAgeGate(true);
      return;
    }
    
    // Add to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success('Adicionado ao carrinho!');
  };
  
  const handleAgeVerified = () => {
    setAgeVerified(true);
    setShowAgeGate(false);
    
    // Add to cart after age verification
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success('Adicionado ao carrinho!');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 overflow-y-auto">
        <div className="mb-4">
          <Link 
            href="/" 
            className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {product.containsAlcohol && (
              <div className="mb-4 inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                +18 {t('product.ageRequired')}
              </div>
            )}
            
            <p className="text-2xl font-bold text-[var(--color-primary)] mb-4">
              R$ {product.price.toFixed(2)}
            </p>
            
            <div className="mb-6">
              <label htmlFor="quantity" className="block mb-2 font-medium">
                {t('cart.quantity')}:
              </label>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-l-md flex items-center justify-center"
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-16 h-10 border-y border-gray-200 text-center"
                />
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-r-md flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-md transition-colors mb-4"
            >
              {t('product.addToCart')}
            </button>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">{t('product.ingredients')}</h2>
              <p className="text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
              </p>
              
              <h2 className="text-xl font-bold mb-2">{t('product.origin')}</h2>
              <p className="text-gray-700">
                Bahia, Brasil
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Age Verification Modal */}
      {showAgeGate && (
        <AgeGate 
          onVerified={handleAgeVerified} 
          onCancel={() => setShowAgeGate(false)} 
        />
      )}
    </div>
  );
}
