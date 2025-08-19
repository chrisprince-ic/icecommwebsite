'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const useOptimizedData = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  
  const { 
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    enableCache = true,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  const shouldRefetch = useCallback(() => {
    if (!enableCache) return true;
    if (!lastFetch) return true;
    return Date.now() - lastFetch > cacheDuration;
  }, [enableCache, lastFetch, cacheDuration]);

  const fetchData = useCallback(async (isRetry = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction(abortControllerRef.current.signal);
      
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setData(result);
      setLastFetch(Date.now());
      retryCountRef.current = 0;
    } catch (err) {
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      if (isRetry && retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData(true);
        }, retryDelay * retryCountRef.current);
        return;
      }

      setError(err);
      retryCountRef.current = 0;
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [fetchFunction, retryAttempts, retryDelay]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (shouldRefetch()) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [...dependencies, shouldRefetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    lastFetch
  };
};

export default useOptimizedData; 