'use client';

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
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}
