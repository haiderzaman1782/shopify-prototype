# Supabase Client Migration Guide

## Overview
The backend has been migrated from direct PostgreSQL connection (`pg`) to Supabase client library (`@supabase/supabase-js`).

## Changes Made

### 1. Package Updates
- Added `@supabase/supabase-js` dependency
- Removed direct `pg` dependency (can be removed if not needed elsewhere)

### 2. Database Configuration
- **File**: `backend/config/database.js`
- Now uses Supabase client instead of PostgreSQL Pool
- Uses `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` from environment

### 3. Controllers Updated
- **authController.js**: Converted all `pool.query()` to Supabase client methods
- **middleware/auth.js**: Updated to use Supabase for user verification

### 4. Server Updates
- Test endpoint updated to use Supabase client

## Environment Variables

Update your `backend/.env` file:

```env
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

## How to Get Supabase Keys

1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (keep this secret!)

## Installation

```powershell
cd backend
npm install
```

## Benefits

1. **No Connection Blocking**: Uses Supabase REST API instead of direct DB connections
2. **Better Security**: Service key bypasses RLS for admin operations
3. **Easier Management**: No need to manage connection pools
4. **Built-in Features**: Access to Supabase features like real-time, storage, etc.

## Testing

After updating `.env` and installing packages:

```powershell
# Restart backend
npm run dev

# Test connection
# GET http://localhost:5000/api/test-db
```

## Remaining Controllers

The following controllers may still need updates if they use `pool.query()`:
- productController.js
- categoryController.js
- navigationController.js
- bannerController.js
- homepageController.js
- contactController.js
- footerController.js
- labelController.js
- storeController.js

Update them similarly to use Supabase client methods.

