import pool from '../config/database.js';

export const getFooterSections = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM footer_sections WHERE u_id = $1 AND is_active = TRUE ORDER BY order_index ASC',
      [req.user.u_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get footer sections error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createFooterSection = async (req, res) => {
  try {
    const { section_type, title, content, links, order_index } = req.body;
    
    const result = await pool.query(
      'INSERT INTO footer_sections (u_id, section_type, title, content, links, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.u_id, section_type, title, content, links ? JSON.stringify(links) : null, order_index || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create footer section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateFooterSection = async (req, res) => {
  try {
    const { footerId } = req.params;
    const { section_type, title, content, links, order_index, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE footer_sections 
       SET section_type = COALESCE($1, section_type),
           title = COALESCE($2, title),
           content = COALESCE($3, content),
           links = COALESCE($4, links),
           order_index = COALESCE($5, order_index),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE footer_id = $7 AND u_id = $8
       RETURNING *`,
      [section_type, title, content, links ? JSON.stringify(links) : null, order_index, is_active, footerId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Footer section not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update footer section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteFooterSection = async (req, res) => {
  try {
    const { footerId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM footer_sections WHERE footer_id = $1 AND u_id = $2 RETURNING *',
      [footerId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Footer section not found' });
    }
    
    res.json({ message: 'Footer section deleted successfully' });
  } catch (error) {
    console.error('Delete footer section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

