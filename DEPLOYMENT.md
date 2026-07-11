# Deployment Guide - Rostar Notes Hub

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] All tests passing
- [ ] Code pushed to GitHub
- [ ] Backend on Render
- [ ] Frontend on Vercel
- [ ] Email SMTP configured
- [ ] External note search API configured
- [ ] SSL certificates configured
- [ ] Domain name configured
- [ ] Analytics setup

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. Ensure all environment variables are set in `.env`
2. Test locally:
   ```bash
   npm run dev
   ```
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

### Step 2: Create Render Service

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repository
6. Configure:
   - **Name**: rostar-notes-hub-api
   - **Runtime**: Node
   - **Build Command**: `npm install`
     - This runs the root package install and the root `postinstall` script.
     - The `postinstall` script installs backend dependencies from `backend/package.json`.
   - **Start Command**: `npm run start:backend`
     - This changes into `backend` and starts `node src/server.js` there.

### Step 3: Set Environment Variables

In Render dashboard:
1. Go to Service Settings
2. Go to Environment
3. Add all variables from `.env`:

```
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email
EMAIL_PASS=your_app_password
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your_frontend_domain.vercel.app
ADMIN_EMAIL=admin@your_domain.com
ADMIN_PASSWORD=secure_admin_password
SEARCH_API_KEY=your_google_custom_search_api_key
SEARCH_ENGINE_ID=your_google_custom_search_engine_id
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Get your service URL: `https://rostar-notes-hub-api.onrender.com`

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update `vite.config.js` to use production API:
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'https://rostar-notes-hub-api.onrender.com',
         changeOrigin: true,
       },
     },
   }
   ```

2. Create `.env.production`:
   ```
   VITE_API_URL=https://rostar-notes-hub-api.onrender.com/api
   ```

3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Prepare frontend for production"
   git push
   ```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New..."
4. Select "Project"
5. Import your repository
6. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables

In Vercel project settings:
1. Go to Settings
2. Go to Environment Variables
3. Add:
   ```
   VITE_API_URL=https://rostar-notes-hub-api.onrender.com/api
   ```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Get your site URL: `https://rostar-notes-hub.vercel.app`

## Domain Configuration

### Add Custom Domain

#### To Vercel:
1. Go to Project Settings
2. Go to Domains
3. Add your domain
4. Follow DNS setup instructions

#### To Render:
1. Go to Service Settings
2. Go to Custom Domain
3. Add your domain
4. Update DNS records

## SSL/HTTPS

Both Render and Vercel provide free SSL certificates automatically.

## Database Backup

### MongoDB Atlas Backup

1. Go to https://cloud.mongodb.com
2. Navigate to your cluster
3. Go to Backup section
4. Create automatic backups:
   - Frequency: Daily
   - Retention: 7 days

## Monitoring & Logging

### Render Logs
1. Dashboard → Service → Logs
2. View real-time application logs

### Vercel Analytics
1. Project → Analytics
2. Monitor performance and errors

### MongoDB Monitoring
1. Dashboard → Monitoring
2. View query performance and resources

## Performance Optimization

### Frontend
- Enable gzip compression
- Implement code splitting
- Optimize images
- Enable caching headers

### Backend
- Enable response compression
- Implement caching strategies
- Optimize database queries
- Use connection pooling

## Scaling

### As Users Grow

1. **Backend** → Upgrade Render plan
2. **Database** → Upgrade MongoDB Atlas tier
3. **Storage** → Monitor Cloudinary usage
4. **CDN** → Cloudinary handles image CDN

## Security Hardening

1. **HTTPS Only**
   ```javascript
   app.use((req, res, next) => {
     if (!req.secure && process.env.NODE_ENV === 'production') {
       return res.redirect('https://' + req.get('host') + req.url);
     }
     next();
   });
   ```

2. **CORS Whitelist**
   ```javascript
   const allowedOrigins = [
     'https://rostar-notes-hub.vercel.app',
   ];
   ```

3. **Rate Limiting** - Already configured in middleware

4. **SQL Injection Prevention** - Using Mongoose (NoSQL)

## Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Render Deploy
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
```

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify email notifications
- [ ] Check file uploads work
- [ ] Test authentication flow
- [ ] Verify admin panel
- [ ] Check database backups
- [ ] Monitor error logs
- [ ] Test on mobile devices
- [ ] Check page load times
- [ ] Verify all external services connected

## Troubleshooting Deployment

### Render Issues
- Check build logs for errors
- Ensure environment variables are set
- Verify MongoDB connection string

### Vercel Issues
- Check build logs
- Verify API endpoint configuration
- Clear cache and redeploy

### General Issues
- Enable debug logging
- Check service status pages
- Review recent changes
- Check external service quotas

## Support & Resources

- Render Support: https://render.com/support
- Vercel Support: https://vercel.com/support
- MongoDB Support: https://support.mongodb.com
- Cloudinary Support: https://support.cloudinary.com

---

**Your Rostar Notes Hub is now live in production!**
