-- ============================================
-- SIMPLIFIED JSON-BASED STORE SCHEMA FOR SUPABASE
-- Database: shopify-preview
-- ============================================

-- Users Table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    u_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Stores Table (All store data stored as JSONB)
CREATE TABLE IF NOT EXISTS stores (
    store_id SERIAL PRIMARY KEY,
    u_id INTEGER NOT NULL REFERENCES users(u_id) ON DELETE CASCADE,
    store_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_store UNIQUE(u_id)
);

-- Images Table (for storing image references)
CREATE TABLE IF NOT EXISTS images (
    image_id SERIAL PRIMARY KEY,
    u_id INTEGER NOT NULL REFERENCES users(u_id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_name VARCHAR(255),
    image_type VARCHAR(50), -- 'product', 'banner', 'logo', 'general'
    related_id INTEGER, -- Product ID or other related entity ID
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stores_u_id ON stores(u_id);
CREATE INDEX IF NOT EXISTS idx_stores_data ON stores USING GIN(store_data);
CREATE INDEX IF NOT EXISTS idx_images_u_id ON images(u_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create default store with complete JSON structure
CREATE OR REPLACE FUNCTION create_default_store()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO stores (u_id, store_data)
    VALUES (NEW.u_id, jsonb_build_object(
        'store_id', 'store_' || NEW.u_id,
        'u_id', NEW.u_id,
        'name', 'My Store',
        'theme', 'modern',
        'logo', '🏪',
        'tagline', 'Welcome to my store',
        'description', 'Store description',
        'colors', jsonb_build_object(
            'primary', '#3B82F6',
            'secondary', '#FFFFFF'
        ),
        'products', '[]'::jsonb,
        'settings', jsonb_build_object(
            'layout', 'grid',
            'currency', 'USD',
            'shipping', true
        )
    ));
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_store_on_user_creation ON users;
CREATE TRIGGER create_store_on_user_creation
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_store();
