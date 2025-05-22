'use client';

import { useTranslation } from 'react-i18next';
import HeroImage from '@/components/HeroImage';
import ProductImage from '@/components/ProductImage';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
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
      
      <main className="flex-grow container mx-auto px-4 py-6 pb-20 overflow-y-auto">
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
          <div className="absolute inset-0 bg-black" style={{ height: '100%' }}>
            <HeroImage 
              src="/images/hero-cacau.jpg" 
              alt="Mais do Cacau" 
              priority
            />
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('home.featuredProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 gap-y-8">
            {featuredProducts.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => { addToCart(product); toast.success('Adicionado ao carrinho!'); }}
              />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="mb-12 bg-amber-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('home.newArrivals')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 gap-y-8">
            {newArrivals.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => { addToCart(product); toast.success('Adicionado ao carrinho!'); }}
              />
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16 bg-amber-100 p-8 rounded-lg shadow-md">
  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-primary)]">{t('home.ourStory')}</h2>
  <div className="flex flex-col md:flex-row items-center gap-8">
    <div className="md:w-1/2">
      <p className="text-lg mb-4">
        Mais do Cacau é uma empresa familiar dedicada à produção artesanal de produtos derivados do cacau, valorizando a qualidade e a tradição. Nossa missão é levar o melhor do cacau baiano para a sua mesa, com respeito à natureza e às pessoas envolvidas em cada etapa do processo.
      </p>
      <p className="text-lg">
        Da escolha dos frutos ao cuidado no preparo, buscamos sempre inovar sem perder a essência do sabor autêntico. Experimente nossos produtos e descubra o verdadeiro prazer do cacau!
      </p>
    </div>
    <div className="md:w-1/2 h-60 md:h-80 w-full rounded-lg overflow-hidden" style={{ height: '20rem' }}>
      <ProductImage 
        src="/images/story-image.jpg" 
        alt="Nossa História" 
        className="rounded-lg"
      />
    </div>
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}
