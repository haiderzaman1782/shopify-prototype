import pool from '../config/database.js';

export const getLabels = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM content_labels WHERE u_id = $1 ORDER BY label_key ASC',
      [req.user.u_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get labels error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLabelsByContext = async (req, res) => {
  try {
    const { context } = req.params;
    const result = await pool.query(
      'SELECT * FROM content_labels WHERE u_id = $1 AND context = $2 ORDER BY label_key ASC',
      [req.user.u_id, context]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get labels by context error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLabel = async (req, res) => {
  try {
    const { labelKey } = req.params;
    const result = await pool.query(
      'SELECT * FROM content_labels WHERE u_id = $1 AND label_key = $2',
      [req.user.u_id, labelKey]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Label not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get label error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createOrUpdateLabel = async (req, res) => {
  try {
    const { label_key, label_value, context } = req.body;
    
    // Check if exists
    const checkResult = await pool.query(
      'SELECT label_id FROM content_labels WHERE u_id = $1 AND label_key = $2',
      [req.user.u_id, label_key]
    );
    
    let result;
    if (checkResult.rows.length === 0) {
      // Create
      result = await pool.query(
        'INSERT INTO content_labels (u_id, label_key, label_value, context) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.u_id, label_key, label_value, context || 'storefront']
      );
    } else {
      // Update
      result = await pool.query(
        `UPDATE content_labels 
         SET label_value = $1, context = COALESCE($2, context), updated_at = CURRENT_TIMESTAMP
         WHERE u_id = $3 AND label_key = $4
         RETURNING *`,
        [label_value, context, req.user.u_id, label_key]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create/update label error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteLabel = async (req, res) => {
  try {
    const { labelKey } = req.params;
    
    const result = await pool.query(
      'DELETE FROM content_labels WHERE u_id = $1 AND label_key = $2 RETURNING *',
      [req.user.u_id, labelKey]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Label not found' });
    }
    
    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error('Delete label error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

