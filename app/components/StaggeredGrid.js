'use client';

import { useState, useEffect } from 'react';
import FadeIn from './FadeIn';

const StaggeredGrid = ({ 
  children, 
  className = '',
  staggerDelay = 100,
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  gap = 'gap-6'
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(children)) {
      setItems(children);
    } else {
      setItems([children]);
    }
  }, [children]);

  return (
    <div className={`grid ${gridCols} ${gap} ${className}`}>
      {items.map((item, index) => (
        <FadeIn
          key={index}
          delay={index * staggerDelay}
          direction="up"
          duration={600}
        >
          {item}
        </FadeIn>
      ))}
    </div>
  );
};

export default StaggeredGrid; 