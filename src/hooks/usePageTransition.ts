import { useState, useEffect, useCallback } from "react";

export function usePageTransition() {
  const [loading, setLoading] = useState(false);

  const triggerLoading = useCallback(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return { loading, triggerLoading };
}
