'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from 'firebase/analytics';
import { app } from '../firebase/config';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !analytics) {
      try {
        const analyticsInstance = getAnalytics(app);
        setAnalytics(analyticsInstance);
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }
  }, [analytics]);

  return analytics;
}
