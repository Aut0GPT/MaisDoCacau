'use client';

import Image from 'next/image';
import { useState } from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function HeroImage({ src, alt, priority = false, className = '' }: HeroImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative w-full h-full ${className}`} style={{ position: 'relative', minHeight: '100%', height: '100%' }}>
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        sizes="100vw"
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
