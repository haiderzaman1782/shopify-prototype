'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '@/lib/api';
import { Store, TenantContextType } from '@/src/types';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { user, store: authStore, updateStore } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Store | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authStore) {
      setCurrentTenant(authStore);
      setLoading(false);
    } else if (user) {
      // Fetch store data if not in auth context
      fetchStoreData();
    } else {
      setLoading(false);
    }
  }, [authStore, user]);

  const fetchStoreData = async (): Promise<void> => {
    try {
      const response = await api.get<Store>('/store/my-store');
      setCurrentTenant(response.data);
    } catch (error) {
      console.error('Failed to fetch store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTenantTheme = async (themeName: string): Promise<{ success: boolean }> => {
    if (!currentTenant) {
      console.error('No current tenant to update');
      return { success: false };
    }
    
    try {
      const updated = { ...currentTenant, theme: themeName };
      const result = await updateStore(updated);
      if (result.success && result.store) {
        setCurrentTenant(result.store);
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to update theme');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  };

  const updateTenantData = async (data: Partial<Store>): Promise<void> => {
    if (!currentTenant) return;
    
    const updated = { ...currentTenant, ...data };
    const result = await updateStore(updated);
    if (result.success && result.store) {
      setCurrentTenant(result.store);
    }
  };

  // For backward compatibility, keep tenants array but it will only contain current store
  const tenants: Store[] = currentTenant ? [currentTenant] : [];
  const switchTenant = (tenantId: number): void => {
    // Since we only have one store per user now, this is mainly for backward compatibility
    if (currentTenant && currentTenant.store_id === tenantId) {
      return;
    }
  };

  const defaultTenant: Store = {
    store_id: 0,
    u_id: 0,
    id: '',
    name: '',
    theme: 'modern',
    logo: '',
    tagline: '',
    description: '',
    colors: { primary: '#3B82F6', secondary: '#FFFFFF' },
    products: [],
    settings: { layout: 'grid', currency: 'USD', shipping: true }
  };

  const value: TenantContextType = {
    currentTenant: currentTenant || defaultTenant,
    tenants,
    loading,
    updateTenantTheme,
    updateTenantData,
    switchTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};


