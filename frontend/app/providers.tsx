'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ContentProvider } from '@/src/contexts/ContentContext';
import { TenantProvider } from '@/src/contexts/TenantContext';
import { CartProvider } from '@/src/contexts/CartContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <ContentProvider>
          <TenantProvider>
            {children}
          </TenantProvider>
        </ContentProvider>
      </CartProvider>
    </AuthProvider>
  );
}


