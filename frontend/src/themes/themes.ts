import { Theme } from '../types';

export const themes: Record<string, Theme> = {
  modern: {
    name: 'Modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '12px',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  },
  classic: {
    name: 'Classic',
    colors: {
      primary: '#DC2626',
      secondary: '#B91C1C',
      accent: '#F59E0B',
      background: '#FEFEFE',
      surface: '#F5F5F5',
      text: '#1F2937',
      textSecondary: '#4B5563',
      border: '#D1D5DB',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Georgia, serif',
    },
    borderRadius: '4px',
    shadows: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    },
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#4B5563',
      accent: '#6B7280',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#000000',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
    },
    fonts: {
      heading: 'Helvetica, sans-serif',
      body: 'Helvetica, sans-serif',
    },
    borderRadius: '0px',
    shadows: {
      sm: 'none',
      md: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '8px',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    },
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#0EA5E9',
      background: '#F0FDFA',
      surface: '#E0F2FE',
      text: '#0C4A6E',
      textSecondary: '#075985',
      border: '#B6E6E6',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '16px',
    shadows: {
      sm: '0 1px 2px 0 rgba(6, 182, 212, 0.1)',
      md: '0 4px 6px -1px rgba(6, 182, 212, 0.15)',
      lg: '0 10px 15px -3px rgba(6, 182, 212, 0.2)',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C',
      background: '#FFF7ED',
      surface: '#FFEDD5',
      text: '#7C2D12',
      textSecondary: '#9A3412',
      border: '#FED7AA',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '12px',
    shadows: {
      sm: '0 1px 2px 0 rgba(249, 115, 22, 0.1)',
      md: '0 4px 6px -1px rgba(249, 115, 22, 0.15)',
      lg: '0 10px 15px -3px rgba(249, 115, 22, 0.2)',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10B981',
      background: '#F0FDF4',
      surface: '#D1FAE5',
      text: '#064E3B',
      textSecondary: '#065F46',
      border: '#A7F3D0',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '10px',
    shadows: {
      sm: '0 1px 2px 0 rgba(5, 150, 105, 0.1)',
      md: '0 4px 6px -1px rgba(5, 150, 105, 0.15)',
      lg: '0 10px 15px -3px rgba(5, 150, 105, 0.2)',
    },
  },
  royal: {
    name: 'Royal',
    colors: {
      primary: '#7C3AED',
      secondary: '#6D28D9',
      accent: '#A855F7',
      background: '#FAF5FF',
      surface: '#F3E8FF',
      text: '#4C1D95',
      textSecondary: '#5B21B6',
      border: '#DDD6FE',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Georgia, serif',
    },
    borderRadius: '8px',
    shadows: {
      sm: '0 1px 2px 0 rgba(124, 58, 237, 0.1)',
      md: '0 4px 6px -1px rgba(124, 58, 237, 0.15)',
      lg: '0 10px 15px -3px rgba(124, 58, 237, 0.2)',
    },
  },
  neon: {
    name: 'Neon',
    colors: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#CBD5E1',
      border: '#334155',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '20px',
    shadows: {
      sm: '0 1px 2px 0 rgba(239, 68, 68, 0.3)',
      md: '0 4px 6px -1px rgba(239, 68, 68, 0.4)',
      lg: '0 10px 15px -3px rgba(239, 68, 68, 0.5)',
    },
  },
  vintage: {
    name: 'Vintage',
    colors: {
      primary: '#92400E',
      secondary: '#78350F',
      accent: '#D97706',
      background: '#FEF3C7',
      surface: '#FDE68A',
      text: '#451A03',
      textSecondary: '#78350F',
      border: '#FCD34D',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Georgia, serif',
    },
    borderRadius: '6px',
    shadows: {
      sm: '0 1px 3px 0 rgba(146, 64, 14, 0.2)',
      md: '0 4px 6px -1px rgba(146, 64, 14, 0.25)',
      lg: '0 10px 15px -3px rgba(146, 64, 14, 0.3)',
    },
  },
  elegant: {
    name: 'Elegant',
    colors: {
      primary: '#1F2937',
      secondary: '#111827',
      accent: '#D97706',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Georgia, serif',
    },
    borderRadius: '4px',
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
    },
  },
  vibrant: {
    name: 'Vibrant',
    colors: {
      primary: '#EC4899',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#FFFFFF',
      surface: '#FDF2F8',
      text: '#831843',
      textSecondary: '#9F1239',
      border: '#FBCFE8',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: '14px',
    shadows: {
      sm: '0 1px 2px 0 rgba(236, 72, 153, 0.1)',
      md: '0 4px 6px -1px rgba(236, 72, 153, 0.15)',
      lg: '0 10px 15px -3px rgba(236, 72, 153, 0.2)',
    },
  },
};

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || themes.modern;
};


