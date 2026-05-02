# Backend Setup & Run Instructions

## Prerequisites

1. **Node.js** installed (v16 or higher)
2. **PostgreSQL** or **Supabase** database set up
3. Database `shopify-preview` created

## Step-by-Step Setup

### 1. Navigate to Backend Directory

```powershell
cd backend
```

### 2. Install Dependencies

```powershell
npm install
```

This will install all required packages:
- express
- pg (PostgreSQL client)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cors (Cross-Origin Resource Sharing)
- multer (file uploads)
- nodemon (dev dependency for auto-restart)

### 3. Create Environment File

Create a `.env` file in the `backend` directory:

**For Local PostgreSQL:**
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=shopify-preview
DB_PASSWORD=your_postgres_password
DB_PORT=5432
DB_SSL=false
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

**For Supabase:**
```env
DB_USER=postgres
DB_HOST=db.your-project-id.supabase.co
DB_NAME=shopify-preview
DB_PASSWORD=your_supabase_password
DB_PORT=5432
DB_SSL=true
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### 4. Set Up Database

**Option A: Local PostgreSQL**
```powershell
# Create database
psql -U postgres -c "CREATE DATABASE \"shopify-preview\";"

# Run schema
psql -U postgres -d shopify-preview -f ..\database\schema.sql
```

**Option B: Supabase**
1. Go to your Supabase project
2. Open SQL Editor
3. Copy and paste the contents of `database/schema.sql`
4. Run the SQL

### 5. Run the Backend

**Development Mode (with auto-restart):**
```powershell
npm run dev
```

**Production Mode:**
```powershell
npm start
```

### 6. Verify Backend is Running

You should see:
```
Server running on port 5000
Database connected successfully
```

Test the health endpoint:
- Open browser: `http://localhost:5000/api/health`
- Or use PowerShell:
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Troubleshooting

### Error: "Cannot find module"
**Solution:** Run `npm install` again

### Error: "Database connection failed"
**Solutions:**
1. Check PostgreSQL is running
2. Verify database credentials in `.env`
3. Ensure database `shopify-preview` exists
4. For Supabase: Check connection string and SSL settings

### Error: "Port 5000 already in use"
**Solutions:**
1. Change PORT in `.env` to another port (e.g., 5001)
2. Or stop the process using port 5000:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Error: "JWT_SECRET is not defined"
**Solution:** Make sure `.env` file exists and contains `JWT_SECRET`

## API Endpoints

Once running, your backend will be available at:
- Base URL: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`
- Auth: `http://localhost:5000/api/auth/*`
- Store: `http://localhost:5000/api/store/*`
- Products: `http://localhost:5000/api/products/*`

## Next Steps

1. Start the frontend in a separate terminal
2. Test registration/login
3. Test API endpoints using Postman or similar tool

