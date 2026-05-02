'use client';

import React from 'react';
import { getTheme } from '@/src/themes/themes';
import { ThemePreviewProps, Theme } from '@/src/types';

const ThemePreview: React.FC<ThemePreviewProps> = ({ themeName, customTheme = null }) => {
  const baseTheme = getTheme(themeName);
  const theme: Theme = customTheme || baseTheme;

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.sm,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Mini Header */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderBottom: `1px solid ${theme.colors.border}`,
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          Store Name
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: theme.colors.textSecondary,
            }}
          />
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: theme.colors.textSecondary,
            }}
          />
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: theme.colors.textSecondary,
            }}
          />
        </div>
      </div>

      {/* Mini Hero Section */}
      <div style={{ padding: '12px' }}>
        <div
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius,
            padding: '16px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              height: '8px',
              backgroundColor: theme.colors.primary,
              borderRadius: '4px',
              marginBottom: '8px',
              width: '60%',
            }}
          />
          <div
            style={{
              height: '4px',
              backgroundColor: theme.colors.textSecondary,
              borderRadius: '2px',
              width: '80%',
            }}
          />
        </div>

        {/* Mini Products */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius,
                padding: '8px',
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  height: '40px',
                  backgroundColor: theme.colors.border,
                  borderRadius: '4px',
                  marginBottom: '4px',
                }}
              />
              <div
                style={{
                  height: '4px',
                  backgroundColor: theme.colors.primary,
                  borderRadius: '2px',
                  width: '50%',
                  marginBottom: '4px',
                }}
              />
              <div
                style={{
                  height: '3px',
                  backgroundColor: theme.colors.textSecondary,
                  borderRadius: '2px',
                  width: '70%',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;



