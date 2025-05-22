'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products, ProductCategory } from '@/data/products';
import type { Product } from '@/components/ProductCard';

// Organize products by category
const productsData: Record<string, Product[]> = {
  all: products,
  delicacies: products.filter(product => product.category === ProductCategory.CONFECTIONERY || product.category === ProductCategory.SNACK),
  beverages: products.filter(product => product.category === ProductCategory.BEVERAGE || product.category === ProductCategory.TEA),
  condiments: products.filter(product => product.category === ProductCategory.CONDIMENT),
  alcohol: products.filter(product => product.category === ProductCategory.ALCOHOL),
};

export default function CategoryPage() {
  const { t } = useTranslation();
  const params = useParams();
  
  const categoryId = params.id as string;
  const categoryProducts = productsData[categoryId] || [];
  
  // Simplified function to handle adding to cart
  const handleAddToCart = (product: Product) => {
    alert(`Produto ${product.name} adicionado ao carrinho!`);
  };
  
  // Get category title based on ID
  const getCategoryTitle = (id: string) => {
    switch (id) {
      case 'all':
        return t('categories.all');
      case 'delicacies':
        return t('categories.delicacies');
      case 'beverages':
        return t('categories.beverages');
      case 'condiments':
        return t('categories.condiments');
      case 'alcohol':
        return t('categories.alcohol');
      default:
        return t('categories.all');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 pb-20 overflow-y-auto">
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
        
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[var(--color-primary)]">{getCategoryTitle(categoryId)}</h1>
        
        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-6">Nenhum produto encontrado nesta categoria.</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-md transition-colors"
            >
              Voltar para a página inicial
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 gap-y-8">
            {categoryProducts.map((product) => (
              <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <div style={{ height: '200px', backgroundColor: '#f9f5eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', position: 'relative' }}>
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    width={200}
                    height={200}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    onError={() => {
                      console.log(`Image failed to load: ${product.image}`);
                    }}
                  />
                </div>
                <div style={{ padding: '15px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b4226', marginBottom: '10px' }}>{product.name}</h3>
                  <p style={{ fontWeight: 'bold', color: '#8b5d33', fontSize: '16px', marginBottom: '8px' }}>R$ {product.price.toFixed(2)}</p>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>
                    {product.description.substring(0, 80)}...
                  </p>
                  <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
                    {product.weight} • {product.category}
                    {product.containsAlcohol && <span style={{ color: 'red', marginLeft: '5px' }}>• +18</span>}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }} 
                      style={{ flex: '1', padding: '8px', backgroundColor: '#6b4226', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Adicionar ao Carrinho
                    </button>
                    <Link 
                      href={`/product/${product.id}`} 
                      onClick={(e) => e.stopPropagation()} 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: '#f3f4f6', color: '#6b4226', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
