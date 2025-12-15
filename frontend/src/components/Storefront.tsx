'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useTenant } from '@/src/contexts/TenantContext';
import { useContent } from '@/src/contexts/ContentContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { getTheme } from '@/src/themes/themes';
import { StorefrontProps } from '@/src/types';

const Storefront: React.FC<StorefrontProps> = () => {
  const { currentTenant } = useTenant();
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    navigation,
    products,
    contactInfo,
    footerSections,
    labels,
    getLabel,
    getFeaturedProducts,
    getHeroBanner,
    loading: contentLoading,
  } = useContent();

  const theme = getTheme(currentTenant.theme);

  // Check for custom theme
  const customThemes = JSON.parse(localStorage.getItem('customThemes') || '{}');
  const activeTheme = customThemes[currentTenant.theme] || theme;

  // Get layout settings
  const layoutSettings: any = JSON.parse(localStorage.getItem('layoutSettings') || '{}');
  const navbarSettings = layoutSettings.navbar || {
    visible: true,
    style: 'sticky' as const,
    position: 'top' as const,
  };

  // Get dynamic content
  const featuredProducts = getFeaturedProducts();
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  // Get hero banner from store data if available
  const heroBanner = currentTenant?.banner || null;

  if (contentLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: activeTheme.colors.background }}
      >
        <div style={{ color: activeTheme.colors.text }}>Loading...</div>
      </div>
    );
  }

  // Get navbar styles based on settings
  const getNavbarStyles = () => {
    const baseStyles: React.CSSProperties = {};

    // Background color
    if (navbarSettings.backgroundColor) {
      baseStyles.backgroundColor = navbarSettings.backgroundColor;
    } else {
      baseStyles.backgroundColor = activeTheme.colors.surface;
    }

    // Text color
    const textColor = navbarSettings.textColor || activeTheme.colors.text;
    const textSecondaryColor = navbarSettings.textColor || activeTheme.colors.textSecondary;

    // Border and shadow based on style
    if (navbarSettings.style === 'transparent') {
      baseStyles.borderBottom = 'none';
      baseStyles.boxShadow = 'none';
      baseStyles.backgroundColor = navbarSettings.backgroundColor || 'transparent';
    } else if (navbarSettings.style === 'solid') {
      baseStyles.borderBottom = `1px solid ${activeTheme.colors.border}`;
      baseStyles.boxShadow = activeTheme.shadows.md;
    } else {
      baseStyles.borderBottom = `1px solid ${activeTheme.colors.border}`;
      baseStyles.boxShadow = activeTheme.shadows.sm;
    }

    // Position
    if (navbarSettings.style === 'sticky') {
      baseStyles.position = 'sticky';
      // position can be 'top' or 'bottom'
      (baseStyles as any)[navbarSettings.position] = 0;
      baseStyles.zIndex = 10;
    } else {
      baseStyles.position = 'static';
    }

    return { baseStyles, textColor, textSecondaryColor };
  };

  const { baseStyles, textColor, textSecondaryColor } = getNavbarStyles();

  const handleSwal = (
    text: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question',
    confirmButtonColor: string,
    confirmButtonText: string,
  ): void => {
    void Swal.fire({
      text,
      icon,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toastElement) => {
        toastElement.addEventListener('mouseenter', Swal.stopTimer);
        toastElement.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  };

  return (
    <div
      style={{
        backgroundColor: activeTheme.colors.background,
        color: activeTheme.colors.text,
        fontFamily: activeTheme.fonts.body,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      {navbarSettings.visible !== false && (
        <header style={baseStyles}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1
                  style={{
                    color: textColor,
                    fontFamily: activeTheme.fonts.heading,
                  }}
                  className="text-2xl font-bold flex items-center gap-2"
                >
                  {currentTenant?.logo && <span>{currentTenant.logo}</span>}
                  {currentTenant?.name || 'My Store'}
                </h1>
                {currentTenant?.tagline && (
                  <p
                    style={{ color: textSecondaryColor }}
                    className="text-sm mt-1"
                  >
                    {currentTenant.tagline}
                  </p>
                )}
              </div>
              <nav className="flex gap-6 items-center">
                <a
                  href="#products"
                  style={{ color: textSecondaryColor }}
                  className="hover:opacity-80 transition-opacity"
                >
                  Products
                </a>
                <a
                  href="#contact"
                  style={{ color: textSecondaryColor }}
                  className="hover:opacity-80 transition-opacity"
                >
                  Contact
                </a>
                {user ? (
                  <>
                    <Link
                      href="/admin"
                      style={{ color: textSecondaryColor }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      Admin
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        router.push('/login');
                      }}
                      style={{ color: textSecondaryColor }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    style={{
                      backgroundColor: activeTheme.colors.primary || '#3B82F6',
                      color: '#FFFFFF',
                    }}
                    className="px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      {layoutSettings.hero?.visible !== false && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            style={{
              backgroundColor: activeTheme.colors.surface,
              borderRadius: activeTheme.borderRadius,
              padding: '4rem',
              boxShadow: activeTheme.shadows.md,
            }}
            className="text-center"
          >
            <h2
              style={{
                color: activeTheme.colors.text,
                fontFamily: activeTheme.fonts.heading,
              }}
              className="text-4xl font-bold mb-4"
            >
              Welcome to {currentTenant?.name || 'My Store'}
            </h2>
            {currentTenant?.description && (
              <p
                style={{ color: activeTheme.colors.textSecondary }}
                className="text-xl mb-4"
              >
                {currentTenant.description}
              </p>
            )}
            {currentTenant?.tagline && (
              <p
                style={{ color: activeTheme.colors.textSecondary }}
                className="text-lg mb-8"
              >
                {currentTenant.tagline}
              </p>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSwal(
                  'Thank you for visiting our store. Browse our amazing products!',
                  'success',
                  activeTheme.colors.primary,
                  'Continue Shopping',
                );
              }}
              style={{
                backgroundColor: activeTheme.colors.primary,
                borderRadius: activeTheme.borderRadius,
                boxShadow: activeTheme.shadows.md,
              }}
              className="px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {getLabel('shop_now_button', 'Shop Now')}
            </button>
          </div>
        </section>
      )}

      {/* Products Grid */}
      {displayProducts.length > 0 && (
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2
            style={{
              color: activeTheme.colors.text,
              fontFamily: activeTheme.fonts.heading,
            }}
            className="text-3xl font-bold mb-8 text-center"
          >
            {getLabel('featured_products_title', 'Featured Products')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, index) => (
              <div
                key={product.id || index}
                style={{
                  backgroundColor: activeTheme.colors.surface,
                  border: `1px solid ${activeTheme.colors.border}`,
                  borderRadius: activeTheme.borderRadius,
                  boxShadow: activeTheme.shadows.md,
                }}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div
                  style={{
                    backgroundColor: activeTheme.colors.border,
                    borderRadius: activeTheme.borderRadius,
                  }}
                  className="w-full h-48 mb-4 flex items-center justify-center overflow-hidden"
                >
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span style={{ color: activeTheme.colors.textSecondary }}>
                      Product Image
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <h3
                    style={{ color: activeTheme.colors.text }}
                    className="text-xl font-semibold mb-2"
                  >
                    {product.name.slice(0, 20)}..
                  </h3>
                  <p
                    style={{ color: activeTheme.colors.textSecondary }}
                    className="text-sm mb-4"
                  >
                    {product.description.slice(0, 30)}...
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    style={{ color: activeTheme.colors.primary }}
                    className="text-2xl font-bold"
                  >
                    ${product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSwal(
                        `${product.name} has been added to your cart.`,
                        'success',
                        activeTheme.colors.accent,
                        'Great!',
                      );
                    }}
                    style={{
                      backgroundColor: activeTheme.colors.accent,
                      borderRadius: activeTheme.borderRadius,
                    }}
                    className="px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    {getLabel('add_to_cart_button', 'Add to Cart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Us Section */}
      {layoutSettings.contact?.visible !== false && (
        <section
          id="contact"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div
            style={{
              backgroundColor: activeTheme.colors.surface,
              borderRadius: activeTheme.borderRadius,
              padding: '3rem',
              boxShadow: activeTheme.shadows.md,
            }}
          >
            <h2
              style={{
                color: activeTheme.colors.text,
                fontFamily: activeTheme.fonts.heading,
              }}
              className="text-3xl font-bold mb-8 text-center"
            >
              {getLabel('contact_us_title', 'Contact Us')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h3
                  style={{
                    color: activeTheme.colors.text,
                    fontFamily: activeTheme.fonts.heading,
                  }}
                  className="text-xl font-semibold mb-4"
                >
                  {getLabel('get_in_touch_title', 'Get in Touch')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm font-medium mb-1"
                    >
                      Email
                    </p>
                    <a
                      href="mailto:contact@store.com"
                      style={{ color: activeTheme.colors.primary }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      contact@store.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3
                  style={{
                    color: activeTheme.colors.text,
                    fontFamily: activeTheme.fonts.heading,
                  }}
                  className="text-xl font-semibold mb-4"
                >
                  {getLabel('send_message_title', 'Send us a Message')}
                </h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      style={{
                        backgroundColor: activeTheme.colors.background,
                        border: `1px solid ${activeTheme.colors.border}`,
                        borderRadius: activeTheme.borderRadius,
                        color: activeTheme.colors.text,
                        padding: '0.5rem 1rem',
                        width: '100%',
                      }}
                      className="focus:outline-none focus:ring-2"
                      onFocus={(e) => {
                        e.target.style.borderColor = activeTheme.colors.primary;
                        e.target.style.boxShadow = `0 0 0 2px ${activeTheme.colors.primary}33`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = activeTheme.colors.border;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      style={{
                        backgroundColor: activeTheme.colors.background,
                        border: `1px solid ${activeTheme.colors.border}`,
                        borderRadius: activeTheme.borderRadius,
                        color: activeTheme.colors.text,
                        padding: '0.5rem 1rem',
                        width: '100%',
                      }}
                      className="focus:outline-none focus:ring-2"
                      onFocus={(e) => {
                        e.target.style.borderColor = activeTheme.colors.primary;
                        e.target.style.boxShadow = `0 0 0 2px ${activeTheme.colors.primary}33`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = activeTheme.colors.border;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Subject"
                      style={{
                        backgroundColor: activeTheme.colors.background,
                        border: `1px solid ${activeTheme.colors.border}`,
                        borderRadius: activeTheme.borderRadius,
                        color: activeTheme.colors.text,
                        padding: '0.5rem 1rem',
                        width: '100%',
                      }}
                      className="focus:outline-none focus:ring-2"
                      onFocus={(e) => {
                        e.target.style.borderColor = activeTheme.colors.primary;
                        e.target.style.boxShadow = `0 0 0 2px ${activeTheme.colors.primary}33`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = activeTheme.colors.border;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      style={{
                        backgroundColor: activeTheme.colors.background,
                        border: `1px solid ${activeTheme.colors.border}`,
                        borderRadius: activeTheme.borderRadius,
                        color: activeTheme.colors.text,
                        padding: '0.5rem 1rem',
                        width: '100%',
                        resize: 'vertical',
                      }}
                      className="focus:outline-none focus:ring-2"
                      onFocus={(e) => {
                        e.target.style.borderColor = activeTheme.colors.primary;
                        e.target.style.boxShadow = `0 0 0 2px ${activeTheme.colors.primary}33`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = activeTheme.colors.border;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSwal(
                        'Thank you for contacting us. We will get back to you soon.',
                        'success',
                        activeTheme.colors.primary,
                        'OK',
                      );
                    }}
                    style={{
                      backgroundColor: activeTheme.colors.primary,
                      borderRadius: activeTheme.borderRadius,
                      boxShadow: activeTheme.shadows.md,
                    }}
                    className="w-full px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    {getLabel('send_message_button', 'Send Message')}
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
            backgroundColor: activeTheme.colors.surface,
            borderTop: `1px solid ${activeTheme.colors.border}`,
          }}
          className="mt-16 py-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3
                  style={{
                    color: activeTheme.colors.text,
                    fontFamily: activeTheme.fonts.heading,
                  }}
                  className="text-lg font-semibold mb-4"
                >
                  About Us
                </h3>
                <p
                  style={{ color: activeTheme.colors.textSecondary }}
                  className="text-sm"
                >
                  {currentTenant?.name || 'My Store'} is your trusted destination for
                  quality products and exceptional service.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    color: activeTheme.colors.text,
                    fontFamily: activeTheme.fonts.heading,
                  }}
                  className="text-lg font-semibold mb-4"
                >
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#products"
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3
                  style={{
                    color: activeTheme.colors.text,
                    fontFamily: activeTheme.fonts.heading,
                  }}
                  className="text-lg font-semibold mb-4"
                >
                  Customer Service
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      Returns
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm hover:opacity-80 transition-opacity"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3
                  style={{
                    color: activeTheme.colors.text,
                    fontFamily: activeTheme.fonts.heading,
                  }}
                  className="text-lg font-semibold mb-4"
                >
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    style={{ color: activeTheme.colors.primary }}
                    className="hover:opacity-80 transition-opacity text-xl"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    style={{ color: activeTheme.colors.primary }}
                    className="hover:opacity-80 transition-opacity text-xl"
                    aria-label="Twitter"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    style={{ color: activeTheme.colors.primary }}
                    className="hover:opacity-80 transition-opacity text-xl"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                borderTop: `1px solid ${activeTheme.colors.border}`,
              }}
              className="pt-8 mt-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p
                  style={{ color: activeTheme.colors.textSecondary }}
                  className="text-sm"
                >
                  © 2024 {currentTenant?.name || 'My Store'}. All rights reserved.
                </p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <a
                    href="#"
                    style={{ color: activeTheme.colors.textSecondary }}
                    className="text-sm hover:opacity-80 transition-opacity"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    style={{ color: activeTheme.colors.textSecondary }}
                    className="text-sm hover:opacity-80 transition-opacity"
                  >
                    Privacy Policy
                  </a>
                  <span
                    style={{ color: activeTheme.colors.textSecondary }}
                    className="text-sm"
                  >
                    Theme: {activeTheme.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Storefront;


