import { useState, useRef, useEffect } from 'react';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Custom hook for caching data with TTL (time-to-live)
 * Uses localStorage for persistence across page reloads
 * @param key - Unique cache key
 * @param fetchFn - Async function that fetches the data
 * @param ttl - Time-to-live in milliseconds (default: 10 minutes)
 * @returns [data, loading, error]
 */
export function useCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl = CACHE_TTL
): [T | null, boolean, Error | null] {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check localStorage cache first
                const cached = localStorage.getItem(key);
                if (cached) {
                    const entry: CacheEntry<T> = JSON.parse(cached);
                    const isValid = Date.now() - entry.timestamp < ttl;
                    if (isValid) {
                        setData(entry.data);
                        setLoading(false);
                        return;
                    }
                }

                // Fetch new data
                const result = await fetchFn();
                const entry: CacheEntry<T> = {
                    data: result,
                    timestamp: Date.now(),
                };
                localStorage.setItem(key, JSON.stringify(entry));
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
                // Fallback to stale cache even if expired
                const cached = localStorage.getItem(key);
                if (cached) {
                    try {
                        const entry: CacheEntry<T> = JSON.parse(cached);
                        setData(entry.data);
                    } catch {
                        // Ignore cache parsing errors
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [key, fetchFn, ttl]);

    return [data, loading, error];
}
