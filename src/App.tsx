import React, { useState } from 'react';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { useApi } from './hooks/useApi';

const App: React.FC = () => {
  const [refreshProductList, setRefreshProductList] = useState(false);
  const { loading, error } = useApi();

  const handleProductSubmit = async () => {
    setRefreshProductList(prev => !prev);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Product Management</h1>
      <h2>Add New Product</h2>
      <ProductForm onSubmit={handleProductSubmit} />
      <h2>Product List</h2>
      <ProductList key={refreshProductList.toString()} />
    </div>
  );
};

export default App;