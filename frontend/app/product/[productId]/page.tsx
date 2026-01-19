import ProductDetail from '@/src/components/ProductDetail';
import { ThemeProvider } from '@/src/components/ThemeProvider';

export default function ProductPage() {
  return (
    <ThemeProvider>
      <ProductDetail />
    </ThemeProvider>
  );
}

