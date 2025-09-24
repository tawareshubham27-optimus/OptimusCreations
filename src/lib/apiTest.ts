import api from './api';

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    const response = await api.get('/categories', {
      headers: {
        // Add a custom header to see if it's included
        'X-Test-Header': 'test'
      }
    });
    console.log('API Connection successful:', response);
    return response;
  } catch (error) {
    console.error('API Connection failed:', {
      error,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};