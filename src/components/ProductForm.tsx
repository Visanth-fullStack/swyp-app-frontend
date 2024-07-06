import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { useApi } from '../hooks/useApi';
import './styles.css';

interface ProductFormProps {
  onSubmit: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { createProduct, getCategories, loading, error } = useApi();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, [getCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }
    formData.append('categories', JSON.stringify(selectedCategories));
    
    const result = await createProduct(formData);
    if (result) {
      onSubmit();
      resetFormFields();
    }
  };

  const resetFormFields = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
    setSelectedCategories([]);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          className="form-input"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />
        <span>Product Image</span>
        <input
          className="form-input"
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
          required
        />
        <div>
          <span>Categories</span>
          {categories.map((category) => (
            <label key={category._id} className="form-checkbox-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category._id)}
                onChange={() => handleCategoryChange(category._id)}
              />
              {category.name}
            </label>
          ))}
        </div>
        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
};