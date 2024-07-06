import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (endpoint: string, options: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      setLoading(false);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      setLoading(false);
      return null;
    }
  }, []);

  const createProduct = useCallback(async (productData: FormData) => {
    return request('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: productData,
    });
  }, [request]);

  const getProducts = useCallback(async (categoryName?: string) => {
    const queryParams = categoryName ? `?categoryName=${categoryName}` : '';
    return request(`/products${queryParams}`, {
      method: 'GET',
    });
  }, [request]);

  const getCategories = useCallback(async () => {
    return request('/categories', {
      method: 'GET',
    });
  }, [request]);

  return {
    request,
    createProduct,
    getProducts,
    getCategories,
    loading,
    error,
  };
}