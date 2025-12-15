import supabase from '../config/database.js';

// Get all stores with products (public, no auth required)
export const getAllStores = async (req, res) => {
  try {
    const { data: stores, error } = await supabase
      .from('stores')
      .select('store_id, store_data, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Format stores with products
    const formattedStores = stores.map(store => ({
      store_id: store.store_id,
      store_name: store.store_data?.name || 'Unnamed Store',
      store_logo: store.store_data?.logo || '🏪',
      store_tagline: store.store_data?.tagline || '',
      products: (store.store_data?.products || []).map(product => ({
        ...product,
        store_id: store.store_id,
        store_name: store.store_data?.name || 'Unnamed Store',
        store_logo: store.store_data?.logo || '🏪'
      }))
    }));
    
    // Flatten all products from all stores
    const allProducts = formattedStores.flatMap(store => store.products);
    
    res.json({
      stores: formattedStores,
      products: allProducts,
      totalProducts: allProducts.length,
      totalStores: formattedStores.length
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Search products across all stores
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    const { data: stores, error } = await supabase
      .from('stores')
      .select('store_id, store_data');
    
    if (error) {
      throw error;
    }
    
    const searchTerm = query?.toLowerCase() || '';
    const allProducts = [];
    
    stores.forEach(store => {
      const products = store.store_data?.products || [];
      products.forEach(product => {
        if (
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          store.store_data?.name?.toLowerCase().includes(searchTerm)
        ) {
          allProducts.push({
            ...product,
            store_id: store.store_id,
            store_name: store.store_data?.name || 'Unnamed Store',
            store_logo: store.store_data?.logo || '🏪'
          });
        }
      });
    });
    
    res.json({
      products: allProducts,
      count: allProducts.length,
      query: searchTerm
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

