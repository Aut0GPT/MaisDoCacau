'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  weight: string;
  featured: boolean;
  new: boolean;
  containsAlcohol: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-100">
              <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-[var(--color-primary)] mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-[var(--color-secondary)] font-bold">
              R$ {product.price.toFixed(2)}
            </p>
            {product.containsAlcohol && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                +18
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-md transition-colors"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
