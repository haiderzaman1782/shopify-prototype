import React, { useState, useEffect } from 'react';
import { useTenant } from '@/src/contexts/TenantContext';
import { getTheme } from '@/src/themes/themes';
import { ScrollToTopProps } from '@/src/types';

const ScrollToTop: React.FC<ScrollToTopProps> = () => {
  const { currentTenant } = useTenant();
  const theme = getTheme(currentTenant.theme);

  // Check for custom theme
  const customThemes = JSON.parse(localStorage.getItem('customThemes') || '{}');
  const activeTheme = customThemes[currentTenant.theme] || theme;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: activeTheme.colors.primary,
            color: '#FFFFFF',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            boxShadow: activeTheme.shadows.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            transition: 'all 0.3s ease',
          }}
          className="hover:opacity-90 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;


