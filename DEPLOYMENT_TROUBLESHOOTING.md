# Backend Deployment Troubleshooting Guide

## Issues Identified and Fixed

### 1. CORS Configuration Problem ✅ FIXED
**Issue**: The production CORS origins were set to placeholder URLs that didn't include your actual Netlify frontend URL.

**Fix Applied**: Updated `src/app.ts` to include `https://axiomancer.netlify.app` in the allowed origins for production.

### 2. Database Configuration Problem ✅ FIXED
**Issue**: The backend was using MongoDB Memory Server even in production, causing data loss on restarts.

**Fix Applied**: Modified `src/core/infra/database/mongodb.ts` to require a real database connection in production and exit if not provided.

### 3. Vercel Configuration Enhancement ✅ FIXED
**Issue**: Missing explicit CORS headers in Vercel configuration.

**Fix Applied**: Updated `vercel.json` to include proper CORS headers for your Netlify frontend.

## Required Environment Variables for Production

You MUST set these environment variables in your Vercel deployment:

### 1. Database Connection
```
DB_CONNECTION=mongodb+srv://username:password@cluster.mongodb.net/axiomancer?retryWrites=true&w=majority
```
- **Required**: Yes, absolutely critical for production
- **Where to get**: Create a free MongoDB Atlas cluster at https://cloud.mongodb.com/
- **Note**: Without this, your backend will crash in production

### 2. JWT Secret
```
JWT_SECRET=your-super-secure-jwt-secret-key-here
```
- **Required**: Highly recommended for security
- **Generate**: Use a strong, random string (at least 32 characters)
- **Note**: If not set, uses a development default (insecure)

### 3. Allowed Origins (Optional)
```
ALLOWED_ORIGINS=https://axiomancer.netlify.app,https://your-other-domain.com
```
- **Required**: No (now hardcoded in the app)
- **Use case**: If you have multiple frontend domains

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add each variable:
   - Name: `DB_CONNECTION`
   - Value: Your MongoDB connection string
   - Environment: Production (and Preview if needed)
5. Redeploy your application

## MongoDB Atlas Setup (If you don't have a database)

1. Go to https://cloud.mongodb.com/
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose password authentication
   - Set username and password
   - Give "Read and write to any database" permissions
5. Whitelist your IP:
   - Go to Network Access
   - Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for Vercel deployment
6. Get connection string:
   - Go to Clusters
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `axiomancer`

## Testing Your Backend

After deployment, test these endpoints:

### 1. Health Check
```
GET https://your-backend.vercel.app/
```
Should return: "Hello from Axiomancer!"

### 2. User Registration
```
POST https://your-backend.vercel.app/api/create-user
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpassword123"
}
```

### 3. User Login
```
POST https://your-backend.vercel.app/api/login-user
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpassword123"
}
```

## Common Issues and Solutions

### Issue: "Page Not Found" in Production
**Cause**: Vercel can't find your built files
**Solution**: Make sure you run `npm run build` before deploying, or set up automatic builds

### Issue: CORS Errors
**Cause**: Frontend domain not in allowed origins
**Solution**: Check that `https://axiomancer.netlify.app` is in your CORS configuration (now fixed)

### Issue: Database Connection Errors
**Cause**: Missing or incorrect `DB_CONNECTION` environment variable
**Solution**: Set up MongoDB Atlas and add the connection string to Vercel environment variables

### Issue: "Cannot connect to database" in production
**Cause**: 
1. Missing `DB_CONNECTION` environment variable
2. Incorrect MongoDB connection string
3. IP address not whitelisted in MongoDB Atlas

**Solution**: 
1. Verify environment variable is set in Vercel
2. Test connection string locally
3. Add `0.0.0.0/0` to MongoDB Atlas Network Access

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with proper permissions
- [ ] Network access configured (0.0.0.0/0 for Vercel)
- [ ] `DB_CONNECTION` environment variable set in Vercel
- [ ] `JWT_SECRET` environment variable set in Vercel
- [ ] Code built successfully (`npm run build`)
- [ ] Vercel deployment completed
- [ ] Health check endpoint working
- [ ] User registration endpoint working
- [ ] CORS working from your frontend

## Next Steps

1. **Set up your MongoDB database** (if you haven't already)
2. **Add the environment variables to Vercel**
3. **Redeploy your backend**
4. **Test the registration from your frontend**

The main issue was that your backend was using an in-memory database that resets on every deployment, and CORS wasn't configured for your actual frontend URL. With these fixes, your registration should work in production!