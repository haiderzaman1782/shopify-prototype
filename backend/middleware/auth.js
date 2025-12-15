import jwt from 'jsonwebtoken';
import supabase from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Verify user still exists
    const { data: user, error } = await supabase
      .from('users')
      .select('u_id, email')
      .eq('u_id', decoded.u_id)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};
