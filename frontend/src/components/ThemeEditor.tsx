'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/src/contexts/TenantContext';
import { themes } from '@/src/themes/themes';
import { Theme, ThemeEditorProps } from '@/src/types';

const ThemeEditor: React.FC<ThemeEditorProps> = ({ themeName, onClose }) => {
  const { currentTenant, updateTenantTheme } = useTenant();
  const [editedTheme, setEditedTheme] = useState<Theme>(themes[themeName] || themes.modern);
  const [customThemes, setCustomThemes] = useState<Record<string, Theme>>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('customThemes') : null;
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const customTheme = customThemes[themeName];
    if (customTheme) {
      setEditedTheme(customTheme);
    }
  }, [themeName, customThemes]);

  const handleColorChange = (colorKey: keyof Theme['colors'], value: string): void => {
    setEditedTheme({
      ...editedTheme,
      colors: {
        ...editedTheme.colors,
        [colorKey]: value,
      },
    });
  };

  const handleSave = async (): Promise<void> => {
    const updatedCustomThemes: Record<string, Theme> = {
      ...customThemes,
      [themeName]: editedTheme,
    };
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));

    if (currentTenant.theme === themeName) {
      await updateTenantTheme(currentTenant.theme);
    }

    onClose();
  };

  const handleReset = (): void => {
    const baseTheme = themes[themeName] || themes.modern;
    setEditedTheme(baseTheme);
    const updatedCustomThemes = { ...customThemes };
    delete updatedCustomThemes[themeName];
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Edit Theme: {editedTheme.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Color Editor */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(editedTheme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: editedTheme.colors.background,
                borderColor: editedTheme.colors.border,
                borderRadius: editedTheme.borderRadius,
              }}
            >
              <h4
                className="text-2xl font-bold mb-2"
                style={{
                  color: editedTheme.colors.text,
                  fontFamily: editedTheme.fonts.heading,
                }}
              >
                Sample Heading
              </h4>
              <p
                className="mb-4"
                style={{
                  color: editedTheme.colors.textSecondary,
                  fontFamily: editedTheme.fonts.body,
                }}
              >
                This is a sample paragraph showing how your theme will look.
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: editedTheme.colors.primary,
                    color: '#FFFFFF',
                    borderRadius: editedTheme.borderRadius,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: editedTheme.colors.secondary,
                    color: '#FFFFFF',
                    borderRadius: editedTheme.borderRadius,
                  }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;


