'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function ProductImage({ src, alt, priority = false, className = '' }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if the image is SVG
  const isSvg = src.toLowerCase().endsWith('.svg');

  return (
    <div 
      className={`flex items-center justify-center w-full h-full ${className}`} 
      style={{ 
        position: 'relative', 
        minHeight: '100%', 
        height: '100%', 
        backgroundColor: '#f9f5eb',
        overflow: 'hidden'
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center p-2">
        <Image
          src={src}
          alt={alt}
          width={1080}
          height={1350}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ 
            objectFit: 'scale-down', // Changed from 'contain' to 'scale-down' for better display
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            margin: 'auto'
          }}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
          priority={priority}
          unoptimized={isSvg} // Don't optimize SVGs as they're already optimized
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
