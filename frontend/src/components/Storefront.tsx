'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useTenant } from '@/src/contexts/TenantContext';
import { useContent } from '@/src/contexts/ContentContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { getTheme } from '@/src/themes/themes';
import { StorefrontProps, Product, Store } from '@/src/types';
import ProductDetail from './ProductDetail';
import api from '@/lib/api';

const Storefront: React.FC<StorefrontProps> = ({ storeId }) => {
  const { currentTenant: contextTenant } = useTenant();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [publicStore, setPublicStore] = useState<Store | null>(null);
  const [publicLoading, setPublicLoading] = useState(!!storeId);

  const {
    navigation: contextNavigation,
    products: contextProducts,
    contactInfo: contextContactInfo,
    footerSections: contextFooterSections,
    getFeaturedProducts: getContextFeaturedProducts,
    getLabel: getContextLabel,
    loading: contentLoading,
  } = useContent();

  useEffect(() => {
    if (storeId) {
      const fetchPublicStore = async () => {
        try {
          setPublicLoading(true);
          const response = await api.get<Store>(`/marketplace/store/${storeId}`);
          setPublicStore(response.data);
        } catch (error) {
          console.error('Failed to fetch public store:', error);
          Swal.fire({
            icon: 'error',
            title: 'Store Not Found',
            text: 'Could not load the requested store.'
          });
        } finally {
          setPublicLoading(false);
        }
      };
      fetchPublicStore();
    }
  }, [storeId]);

  // Use either public data or context data
  const store = storeId ? publicStore : contextTenant;
  const products = storeId ? (publicStore?.products || []) : contextProducts;
  const featuredProducts = storeId
    ? products.filter(p => p.is_featured)
    : getContextFeaturedProducts();
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  const contentLoadingFinal = storeId ? publicLoading : contentLoading;

  const theme = getTheme(store?.theme || 'modern');
  const activeTheme = theme; // Skip custom localStorage themes for public view for simplicity

  // Default layout settings or from store data
  const layoutSettings = {
    navbar: { visible: true, style: 'sticky', position: 'top' },
    hero: { visible: true },
    contact: { visible: true },
    footer: { visible: true },
    ...(store?.settings || {})
  };

  const navbarSettings = (layoutSettings as any).navbar || {
    visible: true,
    style: 'sticky' as const,
    position: 'top' as const,
  };

  const getLabel = (key: string, defaultValue: string) => {
    if (storeId) {
      if (key === 'shop_now_button') return 'Shop Now';
      if (key === 'featured_products_title') return 'Featured Products';
      if (key === 'add_to_cart_button') return 'Add to Cart';
      if (key === 'contact_us_title') return 'Contact Us';
      if (key === 'get_in_touch_title') return 'Get in Touch';
      if (key === 'send_message_title') return 'Send us a Message';
      if (key === 'send_message_button') return 'Send Message';
      return (store as any)?.content_labels?.[key] || defaultValue;
    }
    return getContextLabel(key, defaultValue);
  };

  if (contentLoadingFinal) {
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

    if (navbarSettings.backgroundColor) {
      baseStyles.backgroundColor = navbarSettings.backgroundColor;
    } else {
      baseStyles.backgroundColor = activeTheme.colors.surface;
    }

    const textColor = navbarSettings.textColor || activeTheme.colors.text;
    const textSecondaryColor = navbarSettings.textColor || activeTheme.colors.textSecondary;

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

    if (navbarSettings.style === 'sticky') {
      baseStyles.position = 'sticky';
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
                  {store?.logo && <span>{store.logo}</span>}
                  {store?.name || 'Store'}
                </h1>
                {store?.tagline && (
                  <p
                    style={{ color: textSecondaryColor }}
                    className="text-sm mt-1"
                  >
                    {store.tagline}
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
                    {!storeId && (
                      <Link
                        href="/admin"
                        style={{ color: textSecondaryColor }}
                        className="hover:opacity-80 transition-opacity"
                      >
                        Admin
                      </Link>
                    )}
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
      {(layoutSettings as any).hero?.visible !== false && (
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
              Welcome to {store?.name || 'Our Store'}
            </h2>
            {store?.description && (
              <p
                style={{ color: activeTheme.colors.textSecondary }}
                className="text-xl mb-4"
              >
                {store.description}
              </p>
            )}
            {store?.tagline && (
              <p
                style={{ color: activeTheme.colors.textSecondary }}
                className="text-lg mb-8"
              >
                {store.tagline}
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
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                >
                  <div
                    style={{
                      backgroundColor: activeTheme.colors.border,
                      borderRadius: activeTheme.borderRadius,
                    }}
                    className="w-full h-48 mb-4 flex items-center justify-center overflow-hidden"
                  >
                    {product.image ? (
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
                      {product.name}
                    </h3>
                    <p
                      style={{ color: activeTheme.colors.textSecondary }}
                      className="text-sm mb-4"
                    >
                      {product.description?.slice(0, 60)}...
                    </p>
                  </div>
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
      {(layoutSettings as any).contact?.visible !== false && (
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
                      href={`mailto:${(store as any)?.contact_info?.email || 'contact@store.com'}`}
                      style={{ color: activeTheme.colors.primary }}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {(store as any)?.contact_info?.email || 'contact@store.com'}
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
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSwal(
                        'Thank you for contacting us.',
                        'success',
                        activeTheme.colors.primary,
                        'OK',
                      );
                    }}
                    style={{
                      backgroundColor: activeTheme.colors.primary,
                      borderRadius: activeTheme.borderRadius,
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
      {(layoutSettings as any).footer?.visible !== false && (
        <footer
          style={{
            backgroundColor: activeTheme.colors.surface,
            borderTop: `1px solid ${activeTheme.colors.border}`,
          }}
          className="mt-16 py-12"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p style={{ color: activeTheme.colors.textSecondary }}>
              © 2024 {store?.name || 'Store'}. All rights reserved.
            </p>
          </div>
        </footer>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Storefront;
