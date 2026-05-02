'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import Swal from 'sweetalert2';
import { ProductEditorProps, Product, Store } from '@/src/types';

const ProductEditor: React.FC<ProductEditorProps> = () => {
  const { store, updateStore } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (store && store.products) {
      setProducts(store.products);
    }
  }, [store]);

  const handleAddProduct = (): void => {
    setEditingProduct({
      id: Date.now(),
      name: '',
      price: 0,
      description: '',
      image: ''
    });
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct({ ...product });
  };

  const handleCancelEdit = (): void => {
    setEditingProduct(null);
  };

  const handleSaveProduct = async (): Promise<void> => {
    if (!editingProduct || !editingProduct.name || editingProduct.price <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in product name and price'
      });
      return;
    }

    setLoading(true);
    try {
      let updatedProducts: Product[];
      const existingIndex = products.findIndex(p => p.id === editingProduct.id);
      
      if (existingIndex >= 0) {
        // Update existing product
        updatedProducts = products.map((p, index) => 
          index === existingIndex ? editingProduct : p
        );
      } else {
        // Add new product
        updatedProducts = [...products, editingProduct];
      }

      const updatedStore: Partial<Store> = {
        ...store,
        products: updatedProducts
      };
      
      const result = await updateStore(updatedStore);
      if (result.success) {
        setProducts(updatedProducts);
        setEditingProduct(null);
        Swal.fire({
          icon: 'success',
          title: 'Product Saved!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save product'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number): Promise<void> => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const updatedProducts = products.filter(p => p.id !== productId);
        const updatedStore: Partial<Store> = {
          ...store,
          products: updatedProducts
        };
        const deleteResult = await updateStore(updatedStore);
        if (deleteResult.success) {
          setProducts(updatedProducts);
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        } else {
          throw new Error(deleteResult.error);
        }
      } catch (error: any) {
        Swal.fire('Error', error.message || 'Failed to delete product', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store products
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>Add Product</span>
        </button>
      </div>

      {editingProduct && (
        <div className="mb-6 p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">
              {products.find(p => p.id === editingProduct.id) ? 'Edit Product' : 'New Product'}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={editingProduct.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={editingProduct.price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                value={editingProduct.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={editingProduct.image || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {editingProduct.image && (
                <div className="mt-2">
                  <img
                    src={editingProduct.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveProduct}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {products.length === 0 && !editingProduct && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No products yet.</p>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold mb-4 text-blue-600">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm disabled:opacity-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductEditor;



