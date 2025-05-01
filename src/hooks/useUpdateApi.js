import { useState } from 'react';
import axios from 'axios';

export default function useUpdateApi(endpoint, token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  };

  return { data, loading, error, updateData };
}