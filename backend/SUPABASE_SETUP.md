# Supabase Connection Setup

## How to Get Correct Supabase Connection Details

### Step 1: Get Connection String from Supabase

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **Database** in the settings menu
4. Scroll down to **Connection string** section
5. Select **URI** tab
6. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### Step 2: Extract Connection Details

From the connection string, extract:
- **Host**: `db.xxxxx.supabase.co` (the part after `@` and before `:5432`)
- **Database**: Usually `postgres` (the part after the last `/`)
- **Port**: Usually `5432`
- **User**: Usually `postgres`
- **Password**: Your Supabase database password

### Step 3: Update backend/.env

Update your `backend/.env` file with the correct values:

```env
DB_USER=postgres
DB_HOST=db.xxxxx.supabase.co
DB_NAME=postgres
DB_PASSWORD=your_supabase_password
DB_PORT=5432
DB_SSL=true
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### Alternative: Use Connection Pooling (Recommended for Supabase)

Supabase also provides a connection pooling URL. Look for:
- **Connection pooling** section in Database settings
- Use the **Session mode** connection string
- Port is usually `6543` for connection pooling

### Common Issues

1. **Wrong Hostname**: Make sure you're using the exact hostname from Supabase
2. **Database Name**: For Supabase, it's usually `postgres`, not `shopify-preview`
3. **SSL Required**: Always set `DB_SSL=true` for Supabase
4. **Password**: Use the database password, not your Supabase account password

### Verify Connection

After updating `.env`, restart the backend and test:
```
GET http://localhost:5000/api/test-db
```

