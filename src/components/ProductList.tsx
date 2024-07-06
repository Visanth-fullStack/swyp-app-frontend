import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { useApi } from '../hooks/useApi';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { getProducts, getCategories, loading, error } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await getCategories();
      if (categoriesData) {
        setCategories(categoriesData);
      }

      const productsData = await getProducts();
      if (productsData) {
        setProducts(productsData);
      }
    };
    fetchData();
  }, [getCategories, getProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await getProducts(selectedCategory);
      if (productsData) {
        setProducts(productsData);
      }
    };
    fetchProducts();
  }, [getProducts, selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <button onClick={handleSortChange}>
          Sort by Price ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
        </button>
      </div>
      {sortedProducts.length ?
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td><img src={`http://localhost:5000/${product.image}`} alt={product.name} style={{ maxWidth: '200px', height: 'auto' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        :
        <span>No Products Found</span>
      }
    </div>
  );
};