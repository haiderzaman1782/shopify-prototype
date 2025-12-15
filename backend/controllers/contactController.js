import pool from '../config/database.js';

export const getContactInfo = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_info WHERE u_id = $1',
      [req.user.u_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact info not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    const {
      email,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      zip_code,
      country,
      business_hours,
      social_media
    } = req.body;
    
    // Check if exists
    const checkResult = await pool.query(
      'SELECT contact_id FROM contact_info WHERE u_id = $1',
      [req.user.u_id]
    );
    
    let result;
    if (checkResult.rows.length === 0) {
      // Create
      result = await pool.query(
        `INSERT INTO contact_info (u_id, email, phone, address_line1, address_line2, city, state, zip_code, country, business_hours, social_media)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          req.user.u_id, email, phone, address_line1, address_line2,
          city, state, zip_code, country,
          business_hours ? JSON.stringify(business_hours) : null,
          social_media ? JSON.stringify(social_media) : null
        ]
      );
    } else {
      // Update
      result = await pool.query(
        `UPDATE contact_info 
         SET email = COALESCE($1, email),
             phone = COALESCE($2, phone),
             address_line1 = COALESCE($3, address_line1),
             address_line2 = COALESCE($4, address_line2),
             city = COALESCE($5, city),
             state = COALESCE($6, state),
             zip_code = COALESCE($7, zip_code),
             country = COALESCE($8, country),
             business_hours = COALESCE($9, business_hours),
             social_media = COALESCE($10, social_media),
             updated_at = CURRENT_TIMESTAMP
         WHERE u_id = $11
         RETURNING *`,
        [
          email, phone, address_line1, address_line2, city, state, zip_code, country,
          business_hours ? JSON.stringify(business_hours) : null,
          social_media ? JSON.stringify(social_media) : null,
          req.user.u_id
        ]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

