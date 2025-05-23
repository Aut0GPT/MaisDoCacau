'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function ProductImage({ src, alt, priority = false, className = '' }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  
  // Check if the image is SVG
  const isSvg = src.toLowerCase().endsWith('.svg');

  // Handle image error with multiple fallback options
  const handleError = () => {
    // If current image fails, try different file extensions
    const currentExt = imgSrc.split('.').pop()?.toLowerCase();
    
    if (currentExt === 'svg') {
      // Try PNG first
      const pngPath = imgSrc.replace(/\.svg$/i, '.png');
      console.log(`Trying PNG fallback: ${pngPath}`);
      setImgSrc(pngPath);
    } else if (currentExt === 'png') {
      // Try JPG next
      const jpgPath = imgSrc.replace(/\.png$/i, '.jpg');
      console.log(`Trying JPG fallback: ${jpgPath}`);
      setImgSrc(jpgPath);
    } else if (currentExt === 'jpg') {
      // Finally try the placeholder
      console.log('Using placeholder image');
      setImgSrc('/images/products/product-placeholder.svg');
      setIsLoading(false);
    } else {
      // If all fails or unknown extension, use placeholder
      setImgSrc('/images/products/product-placeholder.svg');
      setIsLoading(false);
    }
  };

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setImgSrc(src);
  }, [src]);

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
          src={imgSrc}
          alt={alt}
          width={1080}
          height={1350}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ 
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            margin: 'auto'
          }}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={handleError}
          priority={priority}
          unoptimized={true} // Don't optimize images to avoid processing issues
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
