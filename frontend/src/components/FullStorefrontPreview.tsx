'use client';

import React from 'react';
import { getTheme } from '@/src/themes/themes';
import { FullStorefrontPreviewProps } from '@/src/types';

const FullStorefrontPreview: React.FC<FullStorefrontPreviewProps> = ({
  themeName,
  customTheme = null,
  tenant,
}) => {
  const baseTheme = getTheme(themeName);
  const theme = customTheme || baseTheme;

  // Get layout settings
  const layoutSettings: any = JSON.parse(localStorage.getItem('layoutSettings') || '{}');
  const navbarSettings = layoutSettings.navbar || { visible: true, style: 'sticky', position: 'top' };

  const previewProducts = tenant?.products || [
    { id: 1, name: 'Product 1', price: 29.99, description: 'Amazing product' },
    { id: 2, name: 'Product 2', price: 49.99, description: 'Great product' },
  ];

  // Get navbar styles based on settings
  const getNavbarStyles = () => {
    const baseStyles: React.CSSProperties = {
      padding: '1rem 2rem',
    };

    // Background color
    if (navbarSettings.backgroundColor) {
      baseStyles.backgroundColor = navbarSettings.backgroundColor;
    } else {
      baseStyles.backgroundColor = theme.colors.surface;
    }

    // Text color
    const textColor = navbarSettings.textColor || theme.colors.text;
    const textSecondaryColor = navbarSettings.textColor || theme.colors.textSecondary;

    // Border and shadow based on style
    if (navbarSettings.style === 'transparent') {
      baseStyles.borderBottom = 'none';
      baseStyles.boxShadow = 'none';
      baseStyles.backgroundColor = navbarSettings.backgroundColor || 'transparent';
    } else if (navbarSettings.style === 'solid') {
      baseStyles.borderBottom = `1px solid ${theme.colors.border}`;
      baseStyles.boxShadow = theme.shadows.md;
    } else {
      baseStyles.borderBottom = `1px solid ${theme.colors.border}`;
      baseStyles.boxShadow = theme.shadows.sm;
    }

    // Position
    if (navbarSettings.style === 'sticky') {
      baseStyles.position = 'sticky';
      const position = navbarSettings.position as 'top' | 'bottom' | 'left' | 'right';
      if (position === 'top' || position === 'bottom' || position === 'left' || position === 'right') {
        baseStyles[position] = 0;
      } else {
        baseStyles.top = 0; // Default fallback
      }
      baseStyles.zIndex = 10;
    } else {
      baseStyles.position = 'static';
    }

    return { baseStyles, textColor, textSecondaryColor };
  };

  const { baseStyles, textColor, textSecondaryColor } = getNavbarStyles();

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
        width: '100%',
        minHeight: '0%',
      }}
    >
      {/* Header */}
      {navbarSettings.visible !== false && (
        <header style={baseStyles}>
          <div className="flex justify-between items-center">
            <div>
              <h1
                style={{
                  color: textColor,
                  fontFamily: theme.fonts.heading,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                {tenant?.logo && <span style={{ marginRight: '0.5rem' }}>{tenant.logo}</span>}
                {tenant?.name || 'Store Name'}
              </h1>
              {tenant?.tagline && (
                <p style={{ color: textSecondaryColor, fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                  {tenant.tagline}
                </p>
              )}
            </div>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" style={{ color: textSecondaryColor, fontSize: '0.875rem' }}>
                Home
              </a>
              <a href="#" style={{ color: textSecondaryColor, fontSize: '0.875rem' }}>
                Products
              </a>
              <a href="#" style={{ color: textSecondaryColor, fontSize: '0.875rem' }}>
                Contact
              </a>
            </nav>
          </div>
        </header>
      )}

      {/* Hero Section */}
      {layoutSettings.hero?.visible !== false && (
        <section style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius,
              padding: '3rem',
              boxShadow: theme.shadows.md,
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Welcome to {tenant?.name || 'Our Store'}
            </h2>
            {tenant?.description && (
              <p style={{ color: theme.colors.textSecondary, fontSize: '1rem', marginBottom: '1rem' }}>
                {tenant.description}
              </p>
            )}
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: '#FFFFFF',
                borderRadius: theme.borderRadius,
                padding: '0.75rem 2rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: theme.shadows.md,
                cursor: 'pointer',
              }}
            >
              Shop Now
            </button>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Featured Products
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {previewProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius,
                padding: '1.5rem',
                boxShadow: theme.shadows.md,
              }}
            >
              <div
                style={{
                  backgroundColor: theme.colors.border,
                  borderRadius: theme.borderRadius,
                  height: '150px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: theme.colors.textSecondary, fontSize: '0.75rem' }}>Product Image</span>
              </div>
              <h3
                style={{
                  color: theme.colors.text,
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                {product.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    color: theme.colors.primary,
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  }}
                >
                  ${product.price}
                </span>
                <button
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: '#FFFFFF',
                    borderRadius: theme.borderRadius,
                    padding: '0.5rem 1rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      {layoutSettings.contact?.visible !== false && (
        <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius,
              padding: '2rem',
              boxShadow: theme.shadows.md,
            }}
          >
            <h2
              style={{
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              Contact Us
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {/* Contact Information */}
              <div>
                <h3
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                  }}
                >
                  Get in Touch
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Email
                    </p>
                    <a href="mailto:contact@store.com" style={{ color: theme.colors.primary, fontSize: '0.75rem' }}>
                      contact@store.com
                    </a>
                  </div>
                  <div>
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Phone
                    </p>
                    <a href="tel:+1234567890" style={{ color: theme.colors.primary, fontSize: '0.75rem' }}>
                      +1 (234) 567-890
                    </a>
                  </div>
                  <div>
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Address
                    </p>
                    <p style={{ color: theme.colors.text, fontSize: '0.75rem' }}>
                      123 Store Street
                      <br />
                      City, State 12345
                      <br />
                      United States
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Business Hours
                    </p>
                    <p style={{ color: theme.colors.text, fontSize: '0.75rem' }}>
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                  }}
                >
                  Send us a Message
                </h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    style={{
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius,
                      color: theme.colors.text,
                      padding: '0.5rem 0.75rem',
                      width: '100%',
                      fontSize: '0.75rem',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    style={{
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius,
                      color: theme.colors.text,
                      padding: '0.5rem 0.75rem',
                      width: '100%',
                      fontSize: '0.75rem',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    style={{
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius,
                      color: theme.colors.text,
                      padding: '0.5rem 0.75rem',
                      width: '100%',
                      fontSize: '0.75rem',
                    }}
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={3}
                    style={{
                      backgroundColor: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius,
                      color: theme.colors.text,
                      padding: '0.5rem 0.75rem',
                      width: '100%',
                      fontSize: '0.75rem',
                      resize: 'vertical',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: '#FFFFFF',
                      borderRadius: theme.borderRadius,
                      padding: '0.5rem 1rem',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      boxShadow: theme.shadows.md,
                      cursor: 'pointer',
                    }}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {layoutSettings.footer?.visible !== false && (
        <footer
          style={{
            backgroundColor: theme.colors.surface,
            borderTop: `1px solid ${theme.colors.border}`,
            padding: '2rem',
            marginTop: '2rem',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* About Section */}
              <div>
                <h3
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                  }}
                >
                  About Us
                </h3>
                <p style={{ color: theme.colors.textSecondary, fontSize: '0.7rem' }}>
                  {tenant?.name || 'Store'} is your trusted destination for quality products and exceptional service.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                  }}
                >
                  Quick Links
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      Products
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h3
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                  }}
                >
                  Customer Service
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      Returns
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                  }}
                >
                  Follow Us
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href="#" style={{ color: theme.colors.primary, fontSize: '1rem' }} aria-label="Facebook">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" style={{ color: theme.colors.primary, fontSize: '1rem' }} aria-label="Twitter">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a href="#" style={{ color: theme.colors.primary, fontSize: '1rem' }} aria-label="Instagram">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                borderTop: `1px solid ${theme.colors.border}`,
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <p style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', margin: 0 }}>
                © 2024 {tenant?.name || 'Store'}. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                  Terms of Service
                </a>
                <a href="#" style={{ color: theme.colors.textSecondary, fontSize: '0.7rem', textDecoration: 'none' }}>
                  Privacy Policy
                </a>
                <span style={{ color: theme.colors.textSecondary, fontSize: '0.7rem' }}>Theme: {theme.name}</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default FullStorefrontPreview;


