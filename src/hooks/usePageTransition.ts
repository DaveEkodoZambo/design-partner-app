import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function usePageTransition() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const navigateTo = useCallback((path: string) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 500);
  }, [navigate]);

  const goBack = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      navigate(-1);
      setLoading(false);
    }, 500);
  }, [navigate]);

  return { loading, navigateTo, goBack };
}
