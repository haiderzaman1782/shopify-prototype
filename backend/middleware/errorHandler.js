export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Log full error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
    console.error('Error Details:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      constraint: err.constraint
    });
  }

  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  
  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({ error: 'Invalid reference' });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

