import { useState, useEffect } from 'react';
import { FDAAction, getRecentFDAActions } from '../services/dashboard';

export function useRecentFDAActions() {
  const [actions, setActions] = useState<FDAAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const data = await getRecentFDAActions();
        setActions(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  return { actions, loading, error };
} 