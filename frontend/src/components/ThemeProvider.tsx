'use client';

import React, { ReactNode } from 'react';
import { useTenant } from '@/src/contexts/TenantContext';
import { getTheme } from '@/src/themes/themes';
import { Theme, ThemeProviderProps } from '@/src/types';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { currentTenant } = useTenant();
  const baseTheme = getTheme(currentTenant.theme);
  
  // Check for custom theme
  const customThemes: Record<string, Theme> = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('customThemes') || '{}')
    : {};
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



