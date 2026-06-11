# Rostar Notes Hub - Complete API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://rostar-notes-hub-api.onrender.com/api
```

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication API

### 1. Register User
**Endpoint:** `POST /auth/register`
**Auth Required:** No

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "university": "VTU",
  "branch": "CSE",
  "semester": 4
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "university": "VTU",
    "branch": "CSE",
    "semester": 4,
    "role": "student",
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- 400: Validation error
- 400: Email already registered

---

### 2. Login User
**Endpoint:** `POST /auth/login`
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Responses:**
- 401: Invalid email or password
- 401: Account is inactive

---

### 3. Get Profile
**Endpoint:** `GET /auth/profile`
**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profileImage": "https://cloudinary.com/...",
    "bio": "Computer Science Student",
    "university": "VTU",
    "branch": "CSE",
    "semester": 4,
    "role": "student",
    "bookmarks": [],
    "uploadedNotes": [],
    "ratings": []
  }
}
```

---

### 4. Update Profile
**Endpoint:** `PUT /auth/profile`
**Auth Required:** Yes

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio",
  "university": "VTU",
  "branch": "CSE",
  "semester": 5,
  "phone": "9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ...updated_user }
}
```

---

### 5. Get User by ID
**Endpoint:** `GET /auth/user/:id`
**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://cloudinary.com/...",
    "bio": "Computer Science Student",
    "uploadedNotes": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "OS Notes",
        "subject": "Operating Systems"
      }
    ]
  }
}
```

---

### 6. Logout
**Endpoint:** `POST /auth/logout`
**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📚 Notes API

### 1. Upload Note
**Endpoint:** `POST /notes/upload`
**Auth Required:** Yes
**Content-Type:** multipart/form-data

**Form Data:**
- file: (binary) - PDF, PPT, DOCX, or Image
- title: string (required)
- description: string (required)
- subject: string (required)
- module: string (optional)
- category: ObjectId (required)
- university: string (required)
- branch: string (required) - CSE, ECE, EEE, MECH, CIVIL, OTHER
- semester: number (required) - 1-8
- tags: string (optional) - comma-separated

**Response (201):**
```json
{
  "success": true,
  "message": "Note uploaded successfully. Awaiting admin approval.",
  "note": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Operating Systems Module 1",
    "description": "Complete notes on OS fundamentals",
    "subject": "Operating Systems",
    "uploadedBy": "507f1f77bcf86cd799439011",
    "status": "pending",
    "fileUrl": "https://res.cloudinary.com/...",
    "fileType": "pdf",
    "downloadCount": 0,
    "viewCount": 0,
    "averageRating": 0
  }
}
```

---

### 2. Search Notes
**Endpoint:** `GET /notes/search`
**Auth Required:** No
**Query Parameters:**
- q: string (search query)
- category: ObjectId (optional)
- university: string (optional)
- branch: string (optional)
- semester: number (optional)
- sortBy: string (optional) - downloads, rating, recent, views
- page: number (default: 1)
- limit: number (default: 10, max: 50)

**Example:** `/notes/search?q=operating%20system&university=VTU&branch=CSE&sortBy=downloads&page=1`

**Response (200):**
```json
{
  "success": true,
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Operating Systems Module 1",
      "description": "Complete notes on OS fundamentals",
      "subject": "Operating Systems",
      "uploadedBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "profileImage": "https://..."
      },
      "category": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Core Subjects",
        "color": "#3B82F6"
      },
      "downloadCount": 150,
      "viewCount": 500,
      "averageRating": 4.5,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 245,
  "pages": 25,
  "currentPage": 1
}
```

---

### 3. Get Note by ID
**Endpoint:** `GET /notes/:id`
**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "note": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Operating Systems Module 1",
    "description": "Complete notes on OS fundamentals",
    "subject": "Operating Systems",
    "module": "Module 1",
    "category": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Core Subjects"
    },
    "uploadedBy": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe"
    },
    "fileUrl": "https://res.cloudinary.com/...",
    "fileType": "pdf",
    "fileSize": 2048576,
    "downloadCount": 150,
    "viewCount": 501,
    "bookmarkCount": 25,
    "averageRating": 4.5,
    "ratings": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "userId": {
          "firstName": "Jane",
          "lastName": "Smith",
          "profileImage": "https://..."
        },
        "rating": 5,
        "comment": "Excellent notes!",
        "createdAt": "2024-01-20T14:30:00Z"
      }
    ],
    "reviews": [],
    "tags": ["OS", "Processes", "Memory"]
  }
}
```

---

### 4. Download Note
**Endpoint:** `GET /notes/:id/download`
**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "downloadUrl": "https://res.cloudinary.com/...",
  "fileName": "Operating Systems Module 1"
}
```

---

### 5. Bookmark Note
**Endpoint:** `POST /notes/:id/bookmark`
**Auth Required:** Yes

**Response (201/200):**
```json
{
  "success": true,
  "message": "Note bookmarked",
  "isBookmarked": true
}
```

**Or (if removing):**
```json
{
  "success": true,
  "message": "Bookmark removed",
  "isBookmarked": false
}
```

---

### 6. Rate Note
**Endpoint:** `POST /notes/:id/rate`
**Auth Required:** Yes

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Great notes with clear explanations!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Rating submitted",
  "rating": {
    "_id": "507f1f77bcf86cd799439015",
    "noteId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "rating": 4,
    "comment": "Great notes with clear explanations!",
    "helpful": 0,
    "notHelpful": 0,
    "createdAt": "2024-01-20T14:30:00Z"
  }
}
```

---

### 7. Get User's Notes
**Endpoint:** `GET /notes/user/notes/approved`
**Auth Required:** Yes
**Query Parameters:**
- page: number (default: 1)
- limit: number (default: 10)

**Response (200):**
```json
{
  "success": true,
  "notes": [...],
  "total": 15,
  "pages": 2,
  "currentPage": 1
}
```

---

### 8. Delete Note
**Endpoint:** `DELETE /notes/:id`
**Auth Required:** Yes (owner or admin)

**Response (200):**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## 🛠️ Admin API

### 1. Get Categories
**Endpoint:** `GET /admin/categories`
**Auth Required:** No

**Response (200):**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Core Subjects",
      "description": "Essential CS subjects",
      "icon": "📚",
      "color": "#3B82F6",
      "notesCount": 245,
      "isActive": true
    }
  ]
}
```

---

### 2. Create Category
**Endpoint:** `POST /admin/categories`
**Auth Required:** Yes (admin only)

**Request Body:**
```json
{
  "name": "Advanced Topics",
  "description": "Advanced computer science topics",
  "icon": "🚀",
  "color": "#EC4899"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created",
  "category": { ...category_object }
}
```

---

### 3. Get Pending Notes
**Endpoint:** `GET /admin/notes/pending`
**Auth Required:** Yes (admin only)
**Query Parameters:**
- page: number (default: 1)
- limit: number (default: 10)

**Response (200):**
```json
{
  "success": true,
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Operating Systems Module 1",
      "uploadedBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "category": { "name": "Core Subjects" },
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 45,
  "pages": 5,
  "currentPage": 1
}
```

---

### 4. Approve Note
**Endpoint:** `POST /admin/notes/:id/approve`
**Auth Required:** Yes (admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "Note approved",
  "note": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Operating Systems Module 1",
    "status": "approved",
    "approvedBy": "507f1f77bcf86cd799439001"
  }
}
```

---

### 5. Reject Note
**Endpoint:** `POST /admin/notes/:id/reject`
**Auth Required:** Yes (admin only)

**Request Body:**
```json
{
  "rejectionReason": "Inappropriate content or copyright issue"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Note rejected",
  "note": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "rejected",
    "rejectionReason": "Inappropriate content or copyright issue"
  }
}
```

---

### 6. Get Admin Statistics
**Endpoint:** `GET /admin/stats`
**Auth Required:** Yes (admin only)

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "totalNotes": 3450,
    "approvedNotes": 3200,
    "pendingNotes": 180,
    "rejectedNotes": 70,
    "totalDownloads": 45000
  }
}
```

---

### 7. Get All Users
**Endpoint:** `GET /admin/users`
**Auth Required:** Yes (admin only)
**Query Parameters:**
- page: number (default: 1)
- limit: number (default: 10)

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "university": "VTU",
      "branch": "CSE",
      "role": "student",
      "isVerified": true,
      "isActive": true,
      "createdAt": "2024-01-10T10:30:00Z"
    }
  ],
  "total": 1250,
  "pages": 125
}
```

---

### 8. Delete User
**Endpoint:** `DELETE /admin/users/:id`
**Auth Required:** Yes (admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

## ⚠️ Error Handling

All error responses follow this format:

```json
{
  "status": 400,
  "message": "Error description",
  "errors": [...] // Optional: validation errors
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests (Rate Limited)
- 500: Internal Server Error

---

## 🔒 Rate Limits

- **General API:** 100 requests per 15 minutes
- **Auth Routes:** 5 requests per 15 minutes
- **Upload:** 10 uploads per hour
- **Search:** 30 searches per minute

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. File size limit: 50MB
3. Allowed file types: PDF, PPT, PPTX, DOC, DOCX, JPG, JPEG, PNG, GIF
4. Search supports fuzzy matching
5. Pagination starts at page 1

---

## 🧪 Testing Examples

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "university": "VTU",
    "branch": "CSE",
    "semester": 4
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Search Notes:**
```bash
curl "http://localhost:5000/api/notes/search?q=operating&university=VTU&branch=CSE&sortBy=downloads"
```

---

**API Documentation Complete!**
