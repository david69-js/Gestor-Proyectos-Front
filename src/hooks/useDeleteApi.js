import { useState } from 'react';
import axios from 'axios';

export default function useDeleteApi(endpoint, token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  };

  return { loading, error, deleteData };
}
