'use client';

import { useEffect } from 'react';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add smooth scroll to all internal links
    const handleInternalLinks = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    document.addEventListener('click', handleInternalLinks);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.removeEventListener('click', handleInternalLinks);
    };
  }, []);

  return children;
};

export default SmoothScroll; 