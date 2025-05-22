'use client';

import Image from 'next/image';

interface SimpleHeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function SimpleHeroImage({ src, alt, className = '' }: SimpleHeroImageProps) {
  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ 
        position: 'relative',
        minHeight: '100%',
        height: '100%',
        backgroundColor: '#6b4226'
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </div>
  );
}
