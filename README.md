# Rostar Notes Hub - Full Stack Web Application

A modern, production-ready platform for students to share, discover, and collaborate on educational notes with a comprehensive admin dashboard.

## 🌟 Features

### For Students
- **Upload Notes** - Share PDFs, PPTs, DOCXs, and images
- **Search & Discover** - Find notes by subject, semester, branch, and university
- **Download Tracking** - Monitor your downloads and access history
- **Bookmarks** - Save favorite notes for quick access
- **Ratings & Reviews** - Rate and review notes from other students
- **User Profiles** - Create detailed academic profiles
- **Dark/Light Mode** - Comfortable viewing experience

### For Admins
- **Content Moderation** - Approve or reject uploaded notes
- **Analytics Dashboard** - View platform statistics and metrics
- **User Management** - Manage user accounts and roles
- **Category Management** - Create and manage note categories
- **Performance Tracking** - Monitor downloads, uploads, and engagement

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- Role-based access control
- Protected API routes

## 🏗️ Tech Stack

### Frontend
- **React.js 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Cloudinary** - File storage
- **Multer** - File upload handling

## 📁 Project Structure

```
STUDENT NOTES SHARING WEBSITE/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand stores
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context
│   │   ├── assets/         # Images, icons, fonts
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── index.html          # HTML entry point
│
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── config/         # Configuration files
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express app setup
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment variables template
│   └── README.md           # Backend documentation
│
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Cloudinary account
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**
   - Add MongoDB URI
   - Configure Cloudinary credentials
   - Set JWT secret
   - Add email credentials

5. **Start the server**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secure_password_123",
  "confirmPassword": "secure_password_123",
  "university": "VTU",
  "branch": "CSE",
  "semester": 4
}

Response: {
  "success": true,
  "token": "jwt_token",
  "user": { ...user_object }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password_123"
}

Response: {
  "success": true,
  "token": "jwt_token",
  "user": { ...user_object }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer token

Response: {
  "success": true,
  "user": { ...user_object }
}
```

### Notes Endpoints

#### Upload Note
```http
POST /api/notes/upload
Authorization: Bearer token
Content-Type: multipart/form-data

{
  "title": "Operating Systems Module 1",
  "description": "Complete notes on OS fundamentals",
  "subject": "Operating Systems",
  "module": "Module 1",
  "category": "category_id",
  "university": "VTU",
  "branch": "CSE",
  "semester": 4,
  "tags": "OS,DBMS,Processes",
  "file": <binary_file>
}

Response: {
  "success": true,
  "message": "Note uploaded successfully",
  "note": { ...note_object }
}
```

#### Search Notes
```http
GET /api/notes/search?q=operating+system&university=VTU&branch=CSE&semester=4&sortBy=downloads&page=1&limit=10

Response: {
  "success": true,
  "notes": [...],
  "total": 150,
  "pages": 15,
  "currentPage": 1
}
```

#### Get Note by ID
```http
GET /api/notes/{noteId}

Response: {
  "success": true,
  "note": { ...note_object }
}
```

#### Download Note
```http
GET /api/notes/{noteId}/download
Authorization: Bearer token

Response: {
  "success": true,
  "downloadUrl": "cloudinary_url",
  "fileName": "note_title"
}
```

#### Bookmark Note
```http
POST /api/notes/{noteId}/bookmark
Authorization: Bearer token

Response: {
  "success": true,
  "message": "Note bookmarked",
  "isBookmarked": true
}
```

#### Rate Note
```http
POST /api/notes/{noteId}/rate
Authorization: Bearer token
Content-Type: application/json

{
  "rating": 4,
  "comment": "Great notes!"
}

Response: {
  "success": true,
  "message": "Rating submitted",
  "rating": { ...rating_object }
}
```

### Admin Endpoints

#### Get Pending Notes
```http
GET /api/admin/notes/pending?page=1&limit=10
Authorization: Bearer admin_token

Response: {
  "success": true,
  "notes": [...],
  "total": 45,
  "pages": 5,
  "currentPage": 1
}
```

#### Approve Note
```http
POST /api/admin/notes/{noteId}/approve
Authorization: Bearer admin_token

Response: {
  "success": true,
  "message": "Note approved",
  "note": { ...note_object }
}
```

#### Reject Note
```http
POST /api/admin/notes/{noteId}/reject
Authorization: Bearer admin_token
Content-Type: application/json

{
  "rejectionReason": "Inappropriate content"
}

Response: {
  "success": true,
  "message": "Note rejected",
  "note": { ...note_object }
}
```

#### Get Admin Stats
```http
GET /api/admin/stats
Authorization: Bearer admin_token

Response: {
  "success": true,
  "stats": {
    "totalUsers": 500,
    "totalNotes": 2500,
    "approvedNotes": 2300,
    "pendingNotes": 150,
    "rejectedNotes": 50,
    "totalDownloads": 15000
  }
}
```

## 🗄️ Database Schemas

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  profileImage: String,
  bio: String,
  university: String,
  branch: String (enum),
  semester: Number,
  role: String (enum: ['student', 'admin', 'moderator']),
  isVerified: Boolean,
  isActive: Boolean,
  googleId: String,
  bookmarks: [ObjectId],
  uploadedNotes: [ObjectId],
  ratings: [ObjectId],
  downloads: [ObjectId],
  notifications: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Note Schema
```javascript
{
  title: String,
  description: String,
  subject: String,
  module: String,
  category: ObjectId,
  university: String,
  branch: String,
  semester: Number,
  uploadedBy: ObjectId,
  fileUrl: String,
  fileType: String,
  fileSize: Number,
  thumbnail: String,
  tags: [String],
  status: String (enum: ['pending', 'approved', 'rejected', 'archived']),
  approvedBy: ObjectId,
  rejectionReason: String,
  downloadCount: Number,
  viewCount: Number,
  bookmarkCount: Number,
  averageRating: Number,
  ratings: [ObjectId],
  reviews: [Object],
  downloads: [ObjectId],
  bookmarkedBy: [ObjectId],
  isPrivate: Boolean,
  sharedWith: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: String (unique),
  description: String,
  icon: String,
  color: String,
  notesCount: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Download Schema
```javascript
{
  noteId: ObjectId,
  userId: ObjectId,
  downloadedAt: Date,
  ipAddress: String,
  userAgent: String
}
```

### Bookmark Schema
```javascript
{
  noteId: ObjectId,
  userId: ObjectId,
  createdAt: Date
}
```

### Rating Schema
```javascript
{
  noteId: ObjectId,
  userId: ObjectId,
  rating: Number (1-5),
  comment: String,
  helpful: Number,
  notHelpful: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema
```javascript
{
  userId: ObjectId,
  type: String (enum),
  title: String,
  message: String,
  relatedNote: ObjectId,
  relatedUser: ObjectId,
  isRead: Boolean,
  actionUrl: String,
  createdAt: Date,
  expiresAt: Date
}
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rostar-notes-hub

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Admin
ADMIN_EMAIL=admin@rostar.com
ADMIN_PASSWORD=strong_password
```

## 🚢 Deployment

### Backend (Render)

1. **Create Render account** and connect GitHub
2. **Push code to GitHub**
3. **Create new Web Service**
4. **Connect to your repository**
5. **Set environment variables**
6. **Deploy**

### Frontend (Vercel)

1. **Create Vercel account**
2. **Import project from GitHub**
3. **Set environment variables:**
   ```
   VITE_API_URL=your_backend_url
   ```
4. **Deploy**

## 📊 Key Features Implementation

### Search Functionality
The search uses MongoDB text indexes and supports filtering by:
- Subject
- University
- Branch
- Semester
- Category

### File Upload
- Integrated with Cloudinary for secure file storage
- Supports PDF, PPT, DOCX, and image files
- Automatic thumbnail generation for images
- File size validation (50MB limit)

### Admin Approval Workflow
- All notes start in "pending" status
- Admins review and approve/reject
- Email notifications sent to uploaders
- Analytics tracking for all actions

### Real-time Notifications
- Automatic notifications for note approvals
- Rating alerts for note owners
- Download tracking
- Bookmark confirmations

## 🔒 Security Implementation

1. **Authentication** - JWT tokens with 7-day expiration
2. **Authorization** - Role-based access control
3. **Password Security** - Bcrypt hashing with salt
4. **Rate Limiting** - 100 requests/15 min per IP
5. **Input Validation** - Express validator on all inputs
6. **CORS** - Configured for frontend URL only
7. **Helmet** - Security headers middleware
8. **Compression** - Response compression enabled

## 📈 Performance Optimizations

1. **Database Indexes** - On frequently searched fields
2. **Pagination** - 10 items per page default
3. **Caching** - Recommended for frequently accessed data
4. **Compression** - Gzip compression enabled
5. **CDN** - Cloudinary for image delivery

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please:
- Check existing issues
- Create a detailed issue report
- Include screenshots if applicable

## 🎉 Acknowledgments

Built with modern tech stack for scalability and performance. Special thanks to all contributors!

---

**Happy Learning and Sharing! 📚**
