import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import storeRoutes from './routes/store.js';
import navigationRoutes from './routes/navigation.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import bannerRoutes from './routes/banners.js';
import homepageRoutes from './routes/homepage.js';
import contactRoutes from './routes/contact.js';
import footerRoutes from './routes/footer.js';
import labelRoutes from './routes/labels.js';
import marketplaceRoutes from './routes/marketplace.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const supabase = (await import('./config/database.js')).default;
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DB_NAME || 'shopify-preview'}`);
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET is not set in environment variables!');
  }
});

