import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function useApiData(endpoint, token) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (token && endpoint && !hasRun.current) {
      hasRun.current = true;
      axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
    }
  }, [endpoint, token]);

  return { data, loading, error };
}