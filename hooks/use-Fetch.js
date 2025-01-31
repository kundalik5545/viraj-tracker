import { useState, useCallback } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [apiRes, setApiRes] = useState(undefined);
  const [loading, setLoading] = useState(false); // `null` replaced with `false` for consistency
  const [error, setError] = useState(null);

  const apiFun = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response = await cb(...args);
        setApiRes(response);
      } catch (error) {
        setError(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [cb] // Ensures `apiFun` updates only when `cb` changes
  );

  return { apiRes, loading, error, apiFun, setApiRes };
};

export default useFetch;
