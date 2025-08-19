'use client';

import { useState, useEffect } from 'react';

const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 500, 
  direction = 'up',
  className = '',
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold }
    );

    const element = document.querySelector(`[data-fade-in="${delay}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [delay, threshold]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    none: ''
  };

  const getDurationClass = (duration) => {
    const durationMap = {
      300: 'duration-300',
      500: 'duration-500',
      600: 'duration-600',
      700: 'duration-700',
      1000: 'duration-1000'
    };
    return durationMap[duration] || 'duration-500';
  };

  return (
    <div
      data-fade-in={delay}
      className={`
        transition-all ${getDurationClass(duration)} ease-out
        ${isVisible 
          ? 'opacity-100 transform-none' 
          : `opacity-0 ${directionClasses[direction]}`
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default FadeIn; 