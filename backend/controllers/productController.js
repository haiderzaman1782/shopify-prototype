import pool from '../config/database.js';

// Get products from store_data JSON
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT store_data FROM stores WHERE u_id = $1',
      [req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const products = result.rows[0].store_data.products || [];
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const result = await pool.query(
      'SELECT store_data FROM stores WHERE u_id = $1',
      [req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const products = result.rows[0].store_data.products || [];
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create product (add to products array)
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Get current store
    const result = await pool.query(
      'SELECT store_data FROM stores WHERE u_id = $1',
      [req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const storeData = result.rows[0].store_data;
    const products = storeData.products || [];
    
    // Generate ID if not provided
    const newId = productData.id || (products.length > 0 ? Math.max(...products.map(p => p.id || 0)) + 1 : 1);
    
    const newProduct = {
      id: newId,
      name: productData.name,
      price: parseFloat(productData.price),
      description: productData.description || '',
      image: productData.image || ''
    };
    
    products.push(newProduct);
    
    // Update store_data
    storeData.products = products;
    
    await pool.query(
      `UPDATE stores 
       SET store_data = $1, updated_at = CURRENT_TIMESTAMP
       WHERE u_id = $2`,
      [JSON.stringify(storeData), req.user.u_id]
    );
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const productData = req.body;
    
    // Get current store
    const result = await pool.query(
      'SELECT store_data FROM stores WHERE u_id = $1',
      [req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const storeData = result.rows[0].store_data;
    const products = storeData.products || [];
    
    const productIndex = products.findIndex(p => p.id === parseInt(productId));
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product
    products[productIndex] = {
      ...products[productIndex],
      ...productData,
      id: parseInt(productId) // Ensure ID doesn't change
    };
    
    storeData.products = products;
    
    await pool.query(
      `UPDATE stores 
       SET store_data = $1, updated_at = CURRENT_TIMESTAMP
       WHERE u_id = $2`,
      [JSON.stringify(storeData), req.user.u_id]
    );
    
    res.json(products[productIndex]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get current store
    const result = await pool.query(
      'SELECT store_data FROM stores WHERE u_id = $1',
      [req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const storeData = result.rows[0].store_data;
    const products = storeData.products || [];
    
    const filteredProducts = products.filter(p => p.id !== parseInt(productId));
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    storeData.products = filteredProducts;
    
    await pool.query(
      `UPDATE stores 
       SET store_data = $1, updated_at = CURRENT_TIMESTAMP
       WHERE u_id = $2`,
      [JSON.stringify(storeData), req.user.u_id]
    );
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get featured products (products with is_featured flag or first N products)
export const getFeaturedProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT store_data FROM stores WHERE u_id = $1',
      [req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const products = result.rows[0].store_data.products || [];
    // Return featured products or first 8 products
    const featured = products.filter(p => p.is_featured === true);
    const displayProducts = featured.length > 0 ? featured : products.slice(0, 8);
    
    res.json(displayProducts);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
