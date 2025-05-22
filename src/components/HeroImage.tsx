'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function HeroImage({ src, alt, priority = false, className = '' }: HeroImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  // Handle image error
  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setError(true);
    setIsLoading(false);
  };

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setImgSrc(src);
  }, [src]);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`} 
      style={{ 
        position: 'relative', 
        minHeight: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: error ? '#6b4226' : 'transparent'
      }}
    >
      {!error && (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="100vw"
          style={{ 
            objectPosition: 'center',
            objectFit: 'cover'
          }}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={handleError}
          priority={priority}
          unoptimized={true}
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)]">
          <span className="text-white text-lg">Mais do Cacau</span>
        </div>
      )}
    </div>
  );
}
