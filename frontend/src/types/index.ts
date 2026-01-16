// User and Auth Types
export interface User {
  u_id: number;
  email: string;
  full_name: string;
  created_at?: string;
}

export interface Store {
  store_id: number;
  u_id: number;
  id?: string | number; // For backward compatibility
  name: string;
  theme: string;
  logo: string;
  tagline?: string;
  description?: string;
  banner?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  products: Product[];
  settings: {
    layout: string;
    currency: string;
    shipping: boolean;
  };
  navigation_items?: NavigationItem[];
  contact_info?: ContactInfo;
  content_labels?: Record<string, string>;
  footer_sections?: FooterSection[];
}

// Product Types
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  store_id?: number;
  store_name?: string;
  store_logo?: string;
  is_featured?: boolean;
  category_id?: number;
  quantity?: number;
}

// Store Types
export interface StoreData {
  store_id: number;
  u_id: number;
  name: string;
  theme: string;
  logo: string;
  tagline?: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
  };
  products: Product[];
  settings: {
    layout: string;
    currency: string;
    shipping: boolean;
  };
}

// Theme Types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export interface FooterSection {
  title: string;
  links: Array<{ label: string; href: string }>;
}

// API Response Types
export interface AuthResponse {
  token: string;
  user: User;
  store: Store;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  store: Store | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, full_name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateStore: (storeData: Partial<Store>) => Promise<{ success: boolean; store?: Store; error?: string }>;
  fetchUserData: () => Promise<void>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number, storeId: number) => void;
  updateQuantity: (productId: number, storeId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export interface ContentContextType {
  loading: boolean;
  navigation: NavigationItem[];
  products: Product[];
  categories: any[];
  banners: any[];
  homepageSections: any[];
  contactInfo: ContactInfo | null;
  footerSections: FooterSection[];
  labels: Record<string, string>;
  getLabel: (key: string, defaultValue?: string) => string;
  getFeaturedProducts: () => Product[];
  getProductsByCategory: (categoryId: number) => Product[];
  getHeroBanner: () => any;
  refreshContent: () => Promise<void>;
}

export interface TenantContextType {
  currentTenant: Store;
  tenants: Store[];
  loading: boolean;
  updateTenantTheme: (themeName: string) => Promise<{ success: boolean }>;
  updateTenantData: (data: Partial<Store>) => Promise<void>;
  switchTenant: (tenantId: number) => void;
}

// Component Props Types
export interface MarketplaceProps {}

export interface LoginProps {}

export interface CartProps {}

export interface DashboardProps {}

export interface StorefrontProps {}

export interface AdminPanelProps {}

export interface StoreEditorProps {}

export interface ProductEditorProps {}

export interface ThemeEditorProps {
  themeName: string;
  onClose: () => void;
}

export interface ThemePreviewProps {
  themeName: string;
  customTheme?: Theme | null;
}

export interface ThemePreviewModalProps {
  themeName: string;
  onClose: () => void;
  onActivate: (themeName: string) => Promise<void>;
  onEdit: (themeName: string) => void;
}

export interface LayoutEditorProps {
  onClose: () => void;
}

export interface FullStorefrontPreviewProps {
  themeName: string;
  customTheme?: Theme | null;
  tenant: Store;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface ScrollToTopProps {}

// Store response from marketplace API
export interface MarketplaceStore {
  store_id: number;
  store_name: string;
  store_logo: string;
  store_tagline?: string;
  products?: Product[];
}

export interface MarketplaceResponse {
  stores: MarketplaceStore[];
  products: Product[];
  totalProducts: number;
  totalStores: number;
}

