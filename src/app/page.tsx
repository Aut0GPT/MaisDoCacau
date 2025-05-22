'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { getFeaturedProducts, getNewProducts } from '@/data/products';

export default function Home() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  
  // Get featured and new products from our data
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 overflow-y-auto">
        {/* Hero Section */}
        <section className="relative h-80 mb-8 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-[var(--color-primary)] bg-opacity-60 flex flex-col justify-center items-center text-white z-10 p-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.title')}</h1>
            <p className="text-xl md:text-2xl">{t('home.subtitle')}</p>
            <Link 
              href="/category/all" 
              className="mt-6 px-6 py-3 bg-[var(--color-accent)] hover:bg-opacity-90 text-[var(--color-primary)] font-bold rounded-md transition-colors"
            >
              {t('categories.all')}
            </Link>
          </div>
          <div className="absolute inset-0 bg-black">
            <Image 
              src="/images/hero-cacau.jpg" 
              alt="Mais do Cacau" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('home.featuredProducts')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('home.newArrivals')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {newArrivals.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-12 bg-amber-100 p-6 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('home.ourStory')}</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <p className="text-lg">{t('home.storyText')}</p>
              <p className="mt-4 text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
            </div>
            <div className="md:w-1/2 relative h-60 md:h-80 w-full rounded-lg overflow-hidden">
              <Image 
                src="/images/story-image.jpg" 
                alt="Nossa História" 
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
