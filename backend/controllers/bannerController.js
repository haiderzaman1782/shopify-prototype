import pool from '../config/database.js';

export const getBanners = async (req, res) => {
  try {
    const { section_type } = req.query;
    
    let query = 'SELECT * FROM banners WHERE u_id = $1';
    const params = [req.user.u_id];
    
    if (section_type) {
      query += ' AND section_type = $2';
      params.push(section_type);
    }
    
    query += ' ORDER BY order_index ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, description, image_url, button_text, button_url, section_type, order_index } = req.body;
    
    const result = await pool.query(
      'INSERT INTO banners (u_id, title, subtitle, description, image_url, button_text, button_url, section_type, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [req.user.u_id, title, subtitle, description, image_url, button_text, button_url, section_type || 'hero', order_index || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { title, subtitle, description, image_url, button_text, button_url, section_type, order_index, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE banners 
       SET title = COALESCE($1, title),
           subtitle = COALESCE($2, subtitle),
           description = COALESCE($3, description),
           image_url = COALESCE($4, image_url),
           button_text = COALESCE($5, button_text),
           button_url = COALESCE($6, button_url),
           section_type = COALESCE($7, section_type),
           order_index = COALESCE($8, order_index),
           is_active = COALESCE($9, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE banner_id = $10 AND u_id = $11
       RETURNING *`,
      [title, subtitle, description, image_url, button_text, button_url, section_type, order_index, is_active, bannerId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM banners WHERE banner_id = $1 AND u_id = $2 RETURNING *',
      [bannerId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

