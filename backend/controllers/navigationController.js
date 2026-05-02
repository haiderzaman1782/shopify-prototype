import pool from '../config/database.js';

export const getNavigation = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM navigation_items WHERE u_id = $1 AND is_active = TRUE ORDER BY order_index ASC',
      [req.user.u_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createNavigationItem = async (req, res) => {
  try {
    const { label, url, icon, order_index } = req.body;
    
    const result = await pool.query(
      'INSERT INTO navigation_items (u_id, label, url, icon, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.u_id, label, url, icon || null, order_index || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create navigation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateNavigationItem = async (req, res) => {
  try {
    const { navId } = req.params;
    const { label, url, icon, order_index, is_active } = req.body;
    
    // Verify ownership
    const verifyResult = await pool.query(
      'SELECT nav_id FROM navigation_items WHERE nav_id = $1 AND u_id = $2',
      [navId, req.user.u_id]
    );
    
    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Navigation item not found' });
    }
    
    const result = await pool.query(
      `UPDATE navigation_items 
       SET label = COALESCE($1, label),
           url = COALESCE($2, url),
           icon = COALESCE($3, icon),
           order_index = COALESCE($4, order_index),
           is_active = COALESCE($5, is_active)
       WHERE nav_id = $6 AND u_id = $7
       RETURNING *`,
      [label, url, icon, order_index, is_active, navId, req.user.u_id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update navigation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteNavigationItem = async (req, res) => {
  try {
    const { navId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM navigation_items WHERE nav_id = $1 AND u_id = $2 RETURNING *',
      [navId, req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Navigation item not found' });
    }
    
    res.json({ message: 'Navigation item deleted successfully' });
  } catch (error) {
    console.error('Delete navigation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const reorderNavigationItems = async (req, res) => {
  try {
    const { items } = req.body; // Array of {nav_id, order_index}
    
    await pool.query('BEGIN');
    
    for (const item of items) {
      await pool.query(
        'UPDATE navigation_items SET order_index = $1 WHERE nav_id = $2 AND u_id = $3',
        [item.order_index, item.nav_id, req.user.u_id]
      );
    }
    
    await pool.query('COMMIT');
    
    const result = await pool.query(
      'SELECT * FROM navigation_items WHERE u_id = $1 ORDER BY order_index ASC',
      [req.user.u_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Reorder navigation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

