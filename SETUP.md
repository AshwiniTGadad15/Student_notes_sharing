# Setup Instructions - Rostar Notes Hub

## Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Git
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Create Environment File
```bash
cp .env.example .env
```

### 1.4 Configure Environment Variables

Edit `.env` file and fill in:

#### MongoDB Atlas Setup
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Update `MONGODB_URI` in `.env`

#### Cloudinary Setup
1. Create account at https://cloudinary.com
2. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Update CLOUDINARY_* variables in `.env`

#### JWT & Security
```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and paste as JWT_SECRET
```

#### Email Setup (Gmail)
1. Enable 2-factor authentication on Gmail
2. Create App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password as EMAIL_PASS

#### Final .env File Example
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rostar-notes-hub
JWT_SECRET=your_generated_secret_here
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_16_char
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@rostar.com
ADMIN_PASSWORD=Admin@12345
```

### 1.5 Start Backend Server
```bash
npm run dev
```

Server will run on http://localhost:5000

## Step 2: Frontend Setup

### 2.1 Navigate to Frontend Directory (in new terminal)
```bash
cd frontend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Step 3: Testing the Application

### 3.1 Access the Application
Open browser and go to: http://localhost:5173

### 3.2 Create Test Account
1. Click "Sign Up"
2. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPass123
   - University: VTU
   - Branch: CSE
   - Semester: 4

### 3.3 Login
1. Go to Login page
2. Use credentials from registration

### 3.4 Upload a Test Note
1. Go to "Upload" page
2. Fill in details:
   - Title: "OS Module 1 Notes"
   - Description: "Complete operating systems notes"
   - Subject: "Operating Systems"
   - Category: (select from dropdown)
   - University: "VTU"
   - Branch: "CSE"
   - Semester: "4"
3. Upload a PDF file (< 50MB)

### 3.5 Admin Panel Access
1. Create admin user manually in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. Or login with ADMIN_EMAIL from .env
3. Go to /admin route

## Step 4: Database Initialization

### 4.1 Create Initial Categories
Insert sample categories in MongoDB:
```javascript
db.categories.insertMany([
  {
    name: "Programming",
    description: "Programming languages and concepts",
    color: "#3B82F6",
    isActive: true
  },
  {
    name: "Web Development",
    description: "Frontend and Backend development",
    color: "#EC4899",
    isActive: true
  },
  {
    name: "Databases",
    description: "Database management systems",
    color: "#8B5CF6",
    isActive: true
  }
])
```

## Step 5: Production Build

### 5.1 Build Frontend
```bash
cd frontend
npm run build
```

This creates `dist` folder ready for Vercel deployment

### 5.2 Backend is Ready for Render
Push `backend` folder to GitHub for Render deployment

## Troubleshooting

### MongoDB Connection Error
- Check MONGODB_URI in .env
- Ensure IP is whitelisted in MongoDB Atlas
- Check username and password are URL encoded

### Cloudinary Upload Error
- Verify API Key and Secret
- Check file size < 50MB
- Ensure file type is allowed

### CORS Error
- Ensure FRONTEND_URL in .env matches your frontend URL
- Check browser console for exact error

### Email Not Sending
- Enable "Less secure apps" if using Gmail
- Use App Password instead of regular password
- Check EMAIL_USER and EMAIL_PASS in .env

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9
```

## Next Steps

1. **Customize UI** - Modify Tailwind classes and colors
2. **Add Features** - Implement remaining pages
3. **Setup Analytics** - Integrate Google Analytics
4. **Deploy** - Push to Render (backend) and Vercel (frontend)
5. **SSL Certificate** - Ensure HTTPS in production

## Useful Links

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Cloudinary: https://cloudinary.com
- Render: https://render.com
- Vercel: https://vercel.com
- JWT Guide: https://jwt.io
- Express Docs: https://expressjs.com
- React Docs: https://react.dev

## API Testing with Postman

Import the API routes and test manually or use included collection.

---

**Setup Complete! Your Rostar Notes Hub is ready to use.**
