import { useState } from 'react';
import axios from 'axios';

export default function usePostApi(endpoint, token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
          maxContentLength: Infinity, // Asegura que no se trunquen respuestas grandes
          maxBodyLength: Infinity // Asegura que no se trunquen solicitudes grandes
        }
      );
      setData(response.data);

      return response.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
}
