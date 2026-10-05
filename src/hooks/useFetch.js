import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Reusable hook for performing asynchronous GET requests with state management.
 * @param {Function} fetchFn Async function returning a promise
 * @param {Array} dependencies Array of dependencies that trigger refetch
 * @param {boolean} immediate Whether to invoke immediately on mount
 * @returns {{ data: any, loading: boolean, error: any, refetch: Function }}
 */
export function useFetch(fetchFn, dependencies = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchRef = useRef(fetchFn);
  useEffect(() => {
    fetchRef.current = fetchFn;
  }, [fetchFn]);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRef.current();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {
        // Handled in state
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

export default useFetch;
