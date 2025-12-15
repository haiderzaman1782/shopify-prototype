'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CartContextType } from '@/src/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[]);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product): void => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.store_id === product.store_id
      );
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.store_id === product.store_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number, storeId: number): void => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === productId && item.store_id === storeId))
    );
  };

  const updateQuantity = (productId: number, storeId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId, storeId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.store_id === storeId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = (): void => {
    setCart([]);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


