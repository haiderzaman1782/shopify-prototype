'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { User, Store, AuthContextType } from '@/src/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedStore = localStorage.getItem('store');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser) as User);
      if (savedStore) {
        setStore(JSON.parse(savedStore) as Store);
      }
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (): Promise<void> => {
    try {
      const response = await api.get<{ user: User; store: Store }>('/auth/me');
      setUser(response.data.user);
      setStore(response.data.store);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('store', JSON.stringify(response.data.store));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post<{ token: string; user: User; store: Store }>('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('store', JSON.stringify(response.data.store));
      setUser(response.data.user);
      setStore(response.data.store);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (email: string, password: string, full_name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post<{ token: string; user: User; store: Store }>('/auth/register', { email, password, full_name });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('store', JSON.stringify(response.data.store));
      setUser(response.data.user);
      setStore(response.data.store);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('store');
    setUser(null);
    setStore(null);
  };

  const updateStore = async (storeData: Partial<Store>): Promise<{ success: boolean; store?: Store; error?: string }> => {
    try {
      const response = await api.put<Store>('/store/my-store', { store_data: storeData });
      const updatedStore = response.data;
      setStore(updatedStore);
      localStorage.setItem('store', JSON.stringify(updatedStore));
      return { success: true, store: updatedStore };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Update failed' 
      };
    }
  };

  const value: AuthContextType = {
    user,
    store,
    loading,
    login,
    register,
    logout,
    updateStore,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


