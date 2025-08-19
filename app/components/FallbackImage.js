'use client';

import { useState } from 'react';
import Image from 'next/image';

const FallbackImage = ({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder-product.svg', 
  className = '', 
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // If there's an error, show fallback
  if (imageError) {
    return (
      <div className={`relative bg-gray-100 flex items-center justify-center ${className}`}>
        {fill ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg 
                className="w-16 h-16 mx-auto text-gray-400 mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-sm text-gray-500 font-medium">Image unavailable</p>
              <p className="text-xs text-gray-400 mt-1">Check your connection</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg 
              className="w-12 h-12 mx-auto text-gray-400 mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-xs text-gray-500">Image unavailable</p>
          </div>
        )}
      </div>
    );
  }

  // Render the actual image with error handling
  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''} bg-gray-50`}>
      <Image
        src={src}
        alt={alt}
        className={className}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
};

export default FallbackImage; 