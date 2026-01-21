'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { useTenant } from '@/src/contexts/TenantContext';
import { getTheme } from '@/src/themes/themes';
import { Theme, ThemeProviderProps } from '@/src/types';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { currentTenant } = useTenant();
  const [customThemes, setCustomThemes] = useState<Record<string, Theme>>({});
  
  // Load custom themes from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customThemes');
      if (saved) {
        try {
          setCustomThemes(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse custom themes:', error);
        }
      }
    }
  }, []);

  // Listen for storage changes (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customThemes' && e.newValue) {
        try {
          setCustomThemes(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Failed to parse updated custom themes:', error);
        }
      }
    };

    // Listen for custom theme change events (same-tab updates)
    const handleThemeChange = (e: CustomEvent) => {
      if (e.detail && e.detail.themeName && e.detail.theme) {
        setCustomThemes(prev => ({
          ...prev,
          [e.detail.themeName]: e.detail.theme
        }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('themeChanged', handleThemeChange as EventListener);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('themeChanged', handleThemeChange as EventListener);
      };
    }
  }, []);

  const baseTheme = getTheme(currentTenant.theme);
  const theme = customThemes[currentTenant.theme] || baseTheme;

  const themeStyles: React.CSSProperties = {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-border': theme.colors.border,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--border-radius': theme.borderRadius,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
  } as React.CSSProperties;

  return (
    <div style={themeStyles} className="">
      {children}
    </div>
  );
};



