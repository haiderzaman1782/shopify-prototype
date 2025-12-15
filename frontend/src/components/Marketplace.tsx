'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { Product, MarketplaceStore, MarketplaceResponse, MarketplaceProps } from '@/src/types';

const Marketplace: React.FC<MarketplaceProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [stores, setStores] = useState<MarketplaceStore[]>([]);
  const { addToCart, getCartCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedStore, products]);

  const fetchAllProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<MarketplaceResponse>('/marketplace/stores');
      setProducts(response.data.products || []);
      setStores(response.data.stores || []);
      setFilteredProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load products'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (): void => {
    let filtered = products;

    // Filter by store
    if (selectedStore !== 'all') {
      filtered = filtered.filter(p => p.store_id === parseInt(selectedStore));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.store_name?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product): void => {
    addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/marketplace" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              Marketplace
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="relative px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                🛒 Cart ({getCartCount()})
              </Link>
              {user ? (
                <>
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Admin
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products by name, description, or store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stores</option>
                {stores.map(store => (
                  <option key={store.store_id} value={store.store_id}>
                    {store.store_logo} {store.store_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={`${product.store_id}-${product.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{product.store_logo}</span>
                    <span className="text-xs text-gray-500">{product.store_name}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name.slice(0, 20)}..</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description.slice(0, 30)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ${product.price?.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;


