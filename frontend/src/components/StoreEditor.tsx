'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import Swal from 'sweetalert2';
import { StoreEditorProps, Store } from '@/src/types';

interface StoreFormData {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  theme: string;
  colors: {
    primary: string;
    secondary: string;
  };
  settings: {
    layout: string;
    currency: string;
    shipping: boolean;
  };
}

const StoreEditor: React.FC<StoreEditorProps> = () => {
  const { store, updateStore } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [storeData, setStoreData] = useState<StoreFormData>({
    name: '',
    tagline: '',
    description: '',
    logo: '',
    theme: 'modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#FFFFFF'
    },
    settings: {
      layout: 'grid',
      currency: 'USD',
      shipping: true
    }
  });

  useEffect(() => {
    if (store) {
      setStoreData({
        name: store.name || '',
        tagline: store.tagline || '',
        description: store.description || '',
        logo: store.logo || '',
        theme: store.theme || 'modern',
        colors: store.colors || { primary: '#3B82F6', secondary: '#FFFFFF' },
        settings: store.settings || { layout: 'grid', currency: 'USD', shipping: true }
      });
    }
  }, [store]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedStore: Partial<Store> = {
        ...store,
        ...storeData
      };
      const result = await updateStore(updatedStore);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Store Updated!',
          text: 'Your store settings have been saved.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update store'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Store Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Name *
          </label>
          <input
            type="text"
            value={storeData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({ ...storeData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="My Awesome Store"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={storeData.tagline}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({ ...storeData, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your tagline here"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={storeData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setStoreData({ ...storeData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your store..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo (Emoji or Text)
          </label>
          <input
            type="text"
            value={storeData.logo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({ ...storeData, logo: e.target.value })}
            placeholder="🏪"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={10}
          />
          <p className="mt-1 text-sm text-gray-500">Use an emoji or short text for your logo</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={storeData.colors.primary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({
                  ...storeData,
                  colors: { ...storeData.colors, primary: e.target.value }
                })}
                className="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={storeData.colors.primary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({
                  ...storeData,
                  colors: { ...storeData.colors, primary: e.target.value }
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3B82F6"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={storeData.colors.secondary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({
                  ...storeData,
                  colors: { ...storeData.colors, secondary: e.target.value }
                })}
                className="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={storeData.colors.secondary}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({
                  ...storeData,
                  colors: { ...storeData.colors, secondary: e.target.value }
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={storeData.theme}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStoreData({ ...storeData, theme: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={storeData.settings.currency}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStoreData({
                ...storeData,
                settings: { ...storeData.settings, currency: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout
            </label>
            <select
              value={storeData.settings.layout}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStoreData({
                ...storeData,
                settings: { ...storeData.settings, layout: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="shipping"
            checked={storeData.settings.shipping}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStoreData({
              ...storeData,
              settings: { ...storeData.settings, shipping: e.target.checked }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="shipping" className="ml-2 block text-sm text-gray-700">
            Enable Shipping
          </label>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Store Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreEditor;


