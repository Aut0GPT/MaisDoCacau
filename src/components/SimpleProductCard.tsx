'use client';

import Link from 'next/link';
import { Product } from './ProductCard';

interface SimpleProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function SimpleProductCard({ product, onAddToCart }: SimpleProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Convert SVG path to JPG if needed
  const imagePath = product.image.toLowerCase().endsWith('.svg') 
    ? product.image.replace('.svg', '.jpg')
    : product.image;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] border-2 border-transparent">
      <Link href={`/product/${product.id}`}>
        <div className="h-48 p-2 flex items-center justify-center bg-[#f9f5eb]">
          <img
            src={imagePath}
            alt={product.name}
            className="max-h-full max-w-full object-contain rounded-t-lg"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[var(--color-secondary)] font-bold text-base">
              R$ {product.price.toFixed(2)}
            </p>
            {product.containsAlcohol && (
              <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded-full shadow-sm border border-red-800">
                +18
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-lg font-bold text-base shadow transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-label={`Adicionar ${product.name} ao Carrinho`}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
