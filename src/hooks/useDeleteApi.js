import { useState } from 'react';
import axios from 'axios';

export default function useDeleteApi(endpoint, token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
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

  return { data, loading, error, deleteData };
}