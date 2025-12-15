import { Providers } from './providers';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Multi-Tenant Storefront',
  description: 'Dynamic storefront platform',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


