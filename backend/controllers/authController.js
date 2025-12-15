import supabase from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('u_id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user (store will be auto-created via trigger)
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash,
        full_name
      })
      .select('u_id, email, full_name, created_at')
      .single();

    if (insertError) {
      throw insertError;
    }

    // Get the auto-created store with JSON data
    const { data: storeResult, error: storeError } = await supabase
      .from('stores')
      .select('store_id, store_data')
      .eq('u_id', user.u_id)
      .single();

    // If store wasn't created by trigger, create it manually
    let storeData;
    if (!storeResult) {
      // Create store manually if trigger didn't work
      const defaultStoreData = {
        store_id: `store_${user.u_id}`,
        u_id: user.u_id,
        name: 'My Store',
        theme: 'modern',
        logo: '🏪',
        tagline: 'Welcome to my store',
        description: 'Store description',
        colors: {
          primary: '#3B82F6',
          secondary: '#FFFFFF'
        },
        products: [],
        settings: {
          layout: 'grid',
          currency: 'USD',
          shipping: true
        }
      };

      const { data: newStore, error: newStoreError } = await supabase
        .from('stores')
        .insert({
          u_id: user.u_id,
          store_data: defaultStoreData
        })
        .select('store_id, store_data')
        .single();

      if (newStoreError) {
        throw newStoreError;
      }

      storeData = newStore.store_data;
      storeData.store_id = newStore.store_id;
      storeData.u_id = user.u_id;
    } else {
      // Ensure store_id and u_id are in the response
      storeData = storeResult.store_data;
      storeData.store_id = storeResult.store_id;
      storeData.u_id = user.u_id;
    }

    // Generate JWT (using default secret if not set)
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    const token = jwt.sign(
      { u_id: user.u_id, email: user.email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        u_id: user.u_id,
        email: user.email,
        full_name: user.full_name,
      },
      store: storeData
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (findError || !users) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users;

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last_login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('u_id', user.u_id);

    // Get user's store with JSON data
    const { data: storeResult, error: storeError } = await supabase
      .from('stores')
      .select('store_id, store_data')
      .eq('u_id', user.u_id)
      .single();
    
    if (!storeResult) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // Ensure store_id and u_id are in the response
    const storeData = storeResult.store_data;
    storeData.store_id = storeResult.store_id;
    storeData.u_id = user.u_id;
    
    // Generate JWT (using default secret if not set)
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    const token = jwt.sign(
      { u_id: user.u_id, email: user.email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        u_id: user.u_id,
        email: user.email,
        full_name: user.full_name,
      },
      store: storeData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('u_id, email, full_name, created_at, last_login')
      .eq('u_id', req.user.u_id)
      .single();
    
    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { data: storeResult, error: storeError } = await supabase
      .from('stores')
      .select('store_id, store_data')
      .eq('u_id', req.user.u_id)
      .single();
    
    let storeData = null;
    if (storeResult) {
      storeData = storeResult.store_data;
      storeData.store_id = storeResult.store_id;
      storeData.u_id = req.user.u_id;
    }
    
    res.json({
      user,
      store: storeData
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
