'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/api';
import { Product, NavigationItem, ContactInfo, FooterSection, ContentContextType, Store } from '@/src/types';

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  
  // All dynamic content state
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [homepageSections, setHomepageSections] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [footerSections, setFooterSections] = useState<FooterSection[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  
  // Fetch all content on mount
  useEffect(() => {
    if (user) {
      fetchAllContent();
    }
  }, [user]);
  
  const fetchAllContent = async (): Promise<void> => {
    try {
      setLoading(true);
      // Fetch store data which contains everything
      const storeRes = await api.get<Store>('/store/my-store');
      const storeData = storeRes.data;
      
      // Extract products from store_data
      setProducts(storeData.products || []);
      
      // For backward compatibility, set empty arrays for other content
      // These can be added to store_data JSON if needed
      setNavigation([]);
      setCategories([]);
      setBanners([]);
      setHomepageSections([]);
      setContactInfo(null);
      setFooterSections([]);
      setLabels({});
      
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getLabel = (key: string, defaultValue: string = ''): string => {
    return labels[key] || defaultValue;
  };
  
  const getFeaturedProducts = (): Product[] => {
    return products.filter(p => p.is_featured);
  };
  
  const getProductsByCategory = (categoryId: number): Product[] => {
    return products.filter(p => p.category_id === categoryId);
  };
  
  const getHeroBanner = (): any => {
    // Hero banner can be stored in store_data if needed
    return null;
  };
  
  const value: ContentContextType = {
    loading,
    navigation,
    products,
    categories,
    banners,
    homepageSections,
    contactInfo,
    footerSections,
    labels,
    getLabel,
    getFeaturedProducts,
    getProductsByCategory,
    getHeroBanner,
    refreshContent: fetchAllContent
  };
  
  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};


