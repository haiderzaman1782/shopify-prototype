# Fix Database Connection Error

## Error: `getaddrinfo ENOTFOUND db.oesujavrchpdwwirrucu.supabase.co`

This means the hostname cannot be found. Here's how to fix it:

## Solution 1: Get Correct Supabase Connection Details

### Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Get Database Connection String**
   - Click **Settings** (gear icon) → **Database**
   - Scroll to **Connection string** section
   - Select **URI** tab
   - Copy the connection string

3. **Extract Information**
   The connection string looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

4. **Update backend/.env**
   
   **IMPORTANT:** For Supabase, the database name is usually `postgres`, NOT `shopify-preview`!
   
   Update your `.env` file:
   ```env
   DB_USER=postgres
   DB_HOST=db.xxxxx.supabase.co  # Use the correct hostname from Supabase
   DB_NAME=postgres              # Usually 'postgres' for Supabase
   DB_PASSWORD=your_password     # Your Supabase database password
   DB_PORT=5432
   DB_SSL=true
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   ```

## Solution 2: Use Connection Pooling (Recommended)

Supabase provides connection pooling which is more reliable:

1. In Supabase Dashboard → Settings → Database
2. Find **Connection pooling** section
3. Use the **Session mode** connection string
4. Port will be `6543` instead of `5432`

Update `.env`:
```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=6543  # Connection pooling port
DB_NAME=postgres
DB_SSL=true
```

## Solution 3: Create Database in Supabase

If you want to use `shopify-preview` as database name:

1. Go to Supabase SQL Editor
2. Run:
   ```sql
   CREATE DATABASE "shopify-preview";
   ```
3. Then update `.env`:
   ```env
   DB_NAME=shopify-preview
   ```

**Note:** Supabase projects typically use `postgres` as the default database name.

## Verify Connection

After updating `.env`:

1. **Restart backend server**
   ```powershell
   # Stop server (Ctrl+C)
   cd backend
   npm run dev
   ```

2. **Test connection**
   ```
   GET http://localhost:5000/api/test-db
   ```

## Quick Check

Your current `.env` has:
- Host: `db.oesujavrchpdwwirrucu.supabase.co`
- Database: `shopify-preview`

**Try changing database name to `postgres` first** - this is the most common issue!

