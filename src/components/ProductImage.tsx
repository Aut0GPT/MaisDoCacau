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
    <div className={`relative w-full h-full ${className}`} style={{ position: 'relative', minHeight: '100%', height: '100%', backgroundColor: '#f9f5eb' }}>
      <Image
        src={src}
        alt={alt}
        width={1080}
        height={1350}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ 
          objectFit: 'contain',
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: '0.5rem'
        }}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
        unoptimized={isSvg} // Don't optimize SVGs as they're already optimized
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
