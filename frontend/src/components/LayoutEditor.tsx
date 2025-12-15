'use client';

import React, { useState } from 'react';
import { useTenant } from '@/src/contexts/TenantContext';
import { LayoutEditorProps } from '@/src/types';

const LayoutEditor: React.FC<LayoutEditorProps> = ({ onClose }) => {
  const { currentTenant } = useTenant();
  // Layout settings are stored in localStorage, keep them broadly typed
  const [layoutSettings, setLayoutSettings] = useState<any>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('layoutSettings') : null;
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      navbar: {
        visible: true,
        style: 'sticky', // 'sticky', 'static', 'transparent', 'solid'
        position: 'top', // 'top', 'bottom'
        backgroundColor: '',
        textColor: '',
      },
      footer: {
        visible: true,
      },
      hero: {
        visible: true,
      },
      contact: {
        visible: true,
      },
    };
  });

  const handleNavbarToggle = (): void => {
    setLayoutSettings({
      ...layoutSettings,
      navbar: {
        ...layoutSettings.navbar,
        visible: !layoutSettings.navbar.visible,
      },
    });
  };

  const handleNavbarStyleChange = (style: string): void => {
    setLayoutSettings({
      ...layoutSettings,
      navbar: {
        ...layoutSettings.navbar,
        style,
      },
    });
  };

  const handleNavbarColorChange = (colorKey: string, value: string): void => {
    setLayoutSettings({
      ...layoutSettings,
      navbar: {
        ...layoutSettings.navbar,
        [colorKey]: value,
      },
    });
  };

  const handleSave = (): void => {
    localStorage.setItem('layoutSettings', JSON.stringify(layoutSettings));
    onClose();
  };

  const handleReset = (): void => {
    const defaultSettings = {
      navbar: {
        visible: true,
        style: 'sticky',
        position: 'top',
        backgroundColor: '',
        textColor: '',
      },
      footer: { visible: true },
      hero: { visible: true },
      contact: { visible: true },
    };
    setLayoutSettings(defaultSettings);
    localStorage.setItem('layoutSettings', JSON.stringify(defaultSettings));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Layout Editor</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Navbar Settings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Navbar</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layoutSettings.navbar?.visible !== false}
                  onChange={handleNavbarToggle}
                  className="w-5 h-5"
                />
                <span className="text-sm text-gray-700">Show Navbar</span>
              </label>
            </div>

            {layoutSettings.navbar?.visible !== false && (
              <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                {/* Navbar Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Style</label>
                  <div className="flex gap-2 flex-wrap">
                    {['sticky', 'static', 'transparent', 'solid'].map((style) => (
                      <button
                        key={style}
                        onClick={() => handleNavbarStyleChange(style)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                          layoutSettings.navbar?.style === style
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Sticky: Stays at top when scrolling | Static: Normal position | Transparent: See-through background
                    | Solid: Opaque background
                  </p>
                </div>

                {/* Navbar Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Position</label>
                  <div className="flex gap-2">
                    {['top', 'bottom'].map((position) => (
                      <button
                        key={position}
                        onClick={() =>
                          setLayoutSettings({
                            ...layoutSettings,
                            navbar: { ...layoutSettings.navbar, position },
                          })
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                          layoutSettings.navbar?.position === position
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color (optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={layoutSettings.navbar?.backgroundColor || '#ffffff'}
                        onChange={(e) => handleNavbarColorChange('backgroundColor', e.target.value)}
                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={layoutSettings.navbar?.backgroundColor || ''}
                        onChange={(e) => handleNavbarColorChange('backgroundColor', e.target.value)}
                        placeholder="Auto (theme color)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color (optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={layoutSettings.navbar?.textColor || '#000000'}
                        onChange={(e) => handleNavbarColorChange('textColor', e.target.value)}
                        className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={layoutSettings.navbar?.textColor || ''}
                        onChange={(e) => handleNavbarColorChange('textColor', e.target.value)}
                        placeholder="Auto (theme color)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other Sections Toggle */}
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>

            <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Show Hero Section</span>
              <input
                type="checkbox"
                checked={layoutSettings.hero?.visible !== false}
                onChange={(e) =>
                  setLayoutSettings({
                    ...layoutSettings,
                    hero: { ...layoutSettings.hero, visible: e.target.checked },
                  })
                }
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Show Contact Section</span>
              <input
                type="checkbox"
                checked={layoutSettings.contact?.visible !== false}
                onChange={(e) =>
                  setLayoutSettings({
                    ...layoutSettings,
                    contact: { ...layoutSettings.contact, visible: e.target.checked },
                  })
                }
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Show Footer</span>
              <input
                type="checkbox"
                checked={layoutSettings.footer?.visible !== false}
                onChange={(e) =>
                  setLayoutSettings({
                    ...layoutSettings,
                    footer: { ...layoutSettings.footer, visible: e.target.checked },
                  })
                }
                className="w-5 h-5"
              />
            </label>
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

export default LayoutEditor;


