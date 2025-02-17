import { useState, useCallback } from 'react';

interface UseInfiniteDataProps<T> {
  initialData: T[];
  pageSize: number;
  fetchMoreData: (page: number) => Promise<T[]>;
}

export default function useInfiniteData<T>({
  initialData,
  pageSize,
  fetchMoreData,
}: UseInfiniteDataProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newData = await fetchMoreData(page);
      if (newData.length < pageSize) {
        setHasMore(false);
      }
      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, pageSize, fetchMoreData]);

  const reset = useCallback(() => {
    setData(initialData);
    setPage(1);
    setHasMore(true);
    setIsLoading(false);
  }, [initialData]);

  return {
    data,
    hasMore,
    isLoading,
    loadMore,
    reset,
  };
}