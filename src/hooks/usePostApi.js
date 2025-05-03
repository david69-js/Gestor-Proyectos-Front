import { useState } from 'react';
import axios from 'axios';

export default function usePostApi(endpoint, token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (body) => {
    setLoading(true);
    setError(null);

    // Revisamos si body es un FormData
    const isFormData = body instanceof FormData;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        body,
        {
          headers: {
            // Si no es FormData, usamos JSON
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token && { Authorization: `Bearer ${token}` })
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
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
