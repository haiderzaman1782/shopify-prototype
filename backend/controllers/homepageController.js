import pool from '../config/database.js';

export const getHomepageSections = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM homepage_sections WHERE u_id = $1 AND is_visible = TRUE ORDER BY order_index ASC',
      [req.user.u_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get homepage sections error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createHomepageSection = async (req, res) => {
  try {
    const { section_type, title, content, image_url, order_index, is_visible, settings } = req.body;
    
    const result = await pool.query(
      'INSERT INTO homepage_sections (u_id, section_type, title, content, image_url, order_index, is_visible, settings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.user.u_id, section_type, title, content, image_url, order_index || 0, is_visible !== false, settings ? JSON.stringify(settings) : null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create homepage section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateHomepageSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { section_type, title, content, image_url, order_index, is_visible, settings } = req.body;
    
    const result = await pool.query(
      `UPDATE homepage_sections 
       SET section_type = COALESCE($1, section_type),
           title = COALESCE($2, title),
           content = COALESCE($3, content),
           image_url = COALESCE($4, image_url),
           order_index = COALESCE($5, order_index),
           is_visible = COALESCE($6, is_visible),
           settings = COALESCE($7, settings),
           updated_at = CURRENT_TIMESTAMP
       WHERE section_id = $8 AND u_id = $9
       RETURNING *`,
      [section_type, title, content, image_url, order_index, is_visible, settings ? JSON.stringify(settings) : null, sectionId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Homepage section not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update homepage section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteHomepageSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM homepage_sections WHERE section_id = $1 AND u_id = $2 RETURNING *',
      [sectionId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Homepage section not found' });
    }
    
    res.json({ message: 'Homepage section deleted successfully' });
  } catch (error) {
    console.error('Delete homepage section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

