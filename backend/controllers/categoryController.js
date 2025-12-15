import pool from '../config/database.js';

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE u_id = $1 AND is_active = TRUE ORDER BY order_index ASC',
      [req.user.u_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image_url, order_index } = req.body;
    
    const result = await pool.query(
      'INSERT INTO categories (u_id, name, slug, description, image_url, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.u_id, name, slug || name.toLowerCase().replace(/\s+/g, '-'), description, image_url, order_index || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, slug, description, image_url, order_index, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE categories 
       SET name = COALESCE($1, name),
           slug = COALESCE($2, slug),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           order_index = COALESCE($5, order_index),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE category_id = $7 AND u_id = $8
       RETURNING *`,
      [name, slug, description, image_url, order_index, is_active, categoryId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM categories WHERE category_id = $1 AND u_id = $2 RETURNING *',
      [categoryId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

