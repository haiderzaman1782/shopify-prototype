import { ThemeProvider } from '@/src/components/ThemeProvider';
import Storefront from '@/src/components/Storefront';

export default function StorefrontPage() {
  return (
    <ThemeProvider>
      <Storefront />
    </ThemeProvider>
  );
}



