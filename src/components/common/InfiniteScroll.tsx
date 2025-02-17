import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  children,
}: InfiniteScrollProps) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return (
    <>
      {children}
      {(hasMore || isLoading) && (
        <div ref={ref} className="flex justify-center py-4">
          <div className="animate-pulse text-gray-400">Loading more...</div>
        </div>
      )}
    </>
  );
}