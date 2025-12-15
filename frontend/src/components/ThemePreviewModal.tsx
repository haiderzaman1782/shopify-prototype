'use client';

import React from 'react';
import { useTenant } from '@/src/contexts/TenantContext';
import { getTheme } from '@/src/themes/themes';
import FullStorefrontPreview from './FullStorefrontPreview';
import { ThemePreviewModalProps } from '@/src/types';

const ThemePreviewModal: React.FC<ThemePreviewModalProps> = ({
  themeName,
  onClose,
  onActivate,
  onEdit,
}) => {
  const { currentTenant } = useTenant();
  const theme = getTheme(themeName);

  // Check for custom theme
  const customThemes = JSON.parse(localStorage.getItem('customThemes') || '{}');
  const activeTheme = customThemes[themeName] || theme;
  const isActive = currentTenant.theme === themeName;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Theme Preview: {activeTheme.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Full Website Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Full Website Preview</h3>
            <div
              className="bg-gray-100 rounded-lg overflow-auto border-2 border-gray-300"
              style={{
                height: '600px',
                position: 'relative',
              }}
            >
              <div style={{ transform: 'scale(0.65)', transformOrigin: 'top ', width: '100%', padding: '1rem' }}>
                <FullStorefrontPreview
                  themeName={themeName}
                  customTheme={customThemes[themeName]}
                  tenant={currentTenant}
                />
              </div>
            </div>
          </div>

          {/* Theme Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Primary Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: activeTheme.colors.primary }}
                  />
                  <span className="text-sm font-mono">{activeTheme.colors.primary}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Secondary Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: activeTheme.colors.secondary }}
                  />
                  <span className="text-sm font-mono">{activeTheme.colors.secondary}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Accent Color</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: activeTheme.colors.accent }}
                  />
                  <span className="text-sm font-mono">{activeTheme.colors.accent}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Border Radius</p>
                <span className="text-sm">{activeTheme.borderRadius}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0 flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onEdit(themeName);
              }}
              className="px-6 py-2 border-2 rounded-lg font-medium  transition-all"
            >
              Edit Theme
            </button>
          )}
          <button
            onClick={() => {
              void onActivate(themeName);
              onClose();
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isActive ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isActive ? '✓ Active' : 'Activate Theme'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewModal;


