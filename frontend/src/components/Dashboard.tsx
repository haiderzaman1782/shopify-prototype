'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTenant } from '@/src/contexts/TenantContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { themes } from '@/src/themes/themes';
import ThemeEditor from './ThemeEditor';
import ThemePreview from './ThemePreview';
import ThemePreviewModal from './ThemePreviewModal';
import LayoutEditor from './LayoutEditor';
import Swal from 'sweetalert2';
import { Theme, DashboardProps } from '@/src/types';

const Dashboard: React.FC<DashboardProps> = () => {
  const { currentTenant, updateTenantTheme } = useTenant();
  const { store, loading: authLoading } = useAuth();
  const [editingTheme, setEditingTheme] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState<boolean>(false);

  useEffect(() => {
    // Ensure store is loaded
    if (!currentTenant && store) {
      // Store should be loaded via TenantContext, but if not, we can trigger a refresh
      console.log('Store data available:', store);
    }
  }, [currentTenant, store]);
  
  // Get custom themes
  const customThemes: Record<string, Theme> = JSON.parse(localStorage.getItem('customThemes') || '{}');
  
  // Helper to get theme (custom or default)
  const getThemeForDisplay = (themeKey: string): Theme => {
    return customThemes[themeKey] || themes[themeKey];
  };

  const handleThemeSelect = (themeName: string): void => {
    setPreviewTheme(themeName);
    setShowPreviewModal(true);
  };

  const handleActivateTheme = async (themeName: string): Promise<void> => {
    await updateTenantTheme(themeName);
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Theme Activated!',
      text: `${themeName} theme is now active`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleEditTheme = (themeName: string): void => {
    setPreviewTheme(themeName);
    setShowPreviewModal(true);
  };

  const handleEditFromModal = (themeName: string): void => {
    setShowPreviewModal(false);
    setPreviewTheme(null);
    setEditingTheme(themeName);
    setShowEditor(true);
  };

  const handleCloseEditor = (): void => {
    setShowEditor(false);
    setEditingTheme(null);
  };

  // Show loading state
  if (authLoading || (!currentTenant && !store)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Dashboard</h1>
          <p className="text-gray-600">Manage your store themes and settings</p>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Store</h2>
          {currentTenant && currentTenant.name ? (
            <div className="flex items-center gap-4">
              {currentTenant.logo && (
                <span className="text-4xl">{currentTenant.logo}</span>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentTenant.name}</h3>
                {currentTenant.tagline && (
                  <p className="text-gray-600">{currentTenant.tagline}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Store ID: {currentTenant.store_id || currentTenant.u_id || 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">No store data available</p>
              <Link
                href="/admin"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Admin Panel
              </Link>
            </div>
          )}
        </div>

        {/* Current Theme Info */}
        {currentTenant && currentTenant.name && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Theme</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-gray-600 mb-2">
                  Active Theme: <span className="font-semibold text-blue-600">{getThemeForDisplay(currentTenant.theme)?.name || currentTenant.theme || 'Modern'}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Changes will be reflected on your storefront
                </p>
              </div>
              <Link
                href="/storefront"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Storefront
              </Link>
            </div>
          </div>
        )}

        {/* Layout Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Layout Settings</h2>
          <p className="text-gray-600 mb-4">
            Customize your store layout, navbar style, and section visibility
          </p>
          <button
            onClick={() => setShowLayoutEditor(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
          >
            Edit Layout & Navbar
          </button>
        </div>

        {/* Theme Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(themes).map(([key, defaultTheme]) => {
              const theme = getThemeForDisplay(key);
              return (
              <div
                key={key}
                className={`border-2 rounded-lg p-6 transition-all ${
                  currentTenant.theme === key
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">{theme.name}</h3>
                      {customThemes[key] && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Custom</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Store Preview */}
                  <div className="mb-4 overflow-hidden rounded-lg bg-white p-2" style={{ height: '280px' }}>
                    <ThemePreview themeName={key} customTheme={customThemes[key]} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleThemeSelect(key)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentTenant.theme === key
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {currentTenant.theme === key ? '✓ Active' : 'Preview'}
                  </button>
                  <button
                    onClick={() => handleEditTheme(key)}
                    className="px-4 py-2 border-2 rounded-lg font-medium transition-all"
                  >
                    Edit
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Preview Link */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview Store</h2>
          <Link
            href="/storefront"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            View Storefront →
          </Link>
        </div>
      </div>

      {showEditor && editingTheme && (
        <ThemeEditor
          themeName={editingTheme}
          onClose={handleCloseEditor}
        />
      )}

      {showPreviewModal && previewTheme && (
        <ThemePreviewModal
          themeName={previewTheme}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewTheme(null);
          }}
          onActivate={handleActivateTheme}
          onEdit={handleEditFromModal}
        />
      )}

      {showLayoutEditor && (
        <LayoutEditor onClose={() => setShowLayoutEditor(false)} />
      )}
    </div>
  );
};

export default Dashboard;

