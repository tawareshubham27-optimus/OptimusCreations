import { useEffect, useState } from 'react';
import { categoryApi } from '../lib/api';
import { Category } from '../lib/types';

export default function TestApiComponent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await categoryApi.getAllCategories();
        console.log('Categories response:', response);
        
        // Handle both wrapped and unwrapped responses
        const categoriesData = response.data.data || response.data;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Categories</h2>
      {categories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name} - {category.description}
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: '20px' }}>
        <h3>Debug Info:</h3>
        <pre>{JSON.stringify({ categories }, null, 2)}</pre>
      </div>
    </div>
  );
}