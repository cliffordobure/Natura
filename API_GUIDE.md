# Natura API - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file and update with your settings:

```bash
cp .env.example .env
```

Update these critical values in `.env`:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `JWT_REFRESH_SECRET` - A different secure random string for refresh tokens
- `EMAIL_*` - Your email service credentials (optional for testing)

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

---

## API Testing

### Using Postman or Thunder Client

#### 1. Register a New User

**POST** `http://localhost:3000/api/v1/auth/register`

```json
{
  "email": "admin@natura.com",
  "password": "password123",
  "firstName": "Admin",
  "lastName": "User",
  "phoneNumber": "+1234567890",
  "role": "admin",
  "schoolId": "CREATE_SCHOOL_FIRST"
}
```

**Note:** You need to create a school first (see below) to get the schoolId.

#### 2. Create a School (Admin Only)

First, register an admin user, then:

**POST** `http://localhost:3000/api/v1/schools`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

Body:
```json
{
  "name": "Natura Learning Center",
  "address": "123 Main Street",
  "city": "Springfield",
  "state": "CA",
  "zipCode": "12345",
  "phoneNumber": "+1234567890",
  "email": "info@natura.com"
}
```

#### 3. Login

**POST** `http://localhost:3000/api/v1/auth/login`

```json
{
  "email": "admin@natura.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@natura.com",
    "role": "admin",
    ...
  }
}
```

**Important:** Save the `token` - you'll need it for all subsequent requests!

#### 4. Make Authenticated Requests

For all protected endpoints, add this header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Common API Workflows

### A. Setting Up a New School

1. **Register Admin User** → Save token
2. **Create School** → Save school ID
3. **Create Classrooms** → Save classroom IDs
4. **Register Teachers** (with classroom IDs)
5. **Register Parents**
6. **Add Children** (linked to parents and classrooms)

### B. Daily Check-In Flow

1. **Check In Child**
   ```
   POST /api/v1/attendance/checkin
   ```

2. **Log Activities** (meals, naps, etc.)
   ```
   POST /api/v1/activities
   ```

3. **Send Messages to Parents**
   ```
   POST /api/v1/conversations/:conversationId/messages
   ```

4. **Check Out Child**
   ```
   POST /api/v1/attendance/checkout
   ```

### C. Parent View Flow

1. **Login as Parent**
2. **View My Children**
   ```
   GET /api/v1/children
   ```

3. **View Today's Activities**
   ```
   GET /api/v1/activities?childId=XXX&date=2024-01-01
   ```

4. **View Attendance**
   ```
   GET /api/v1/attendance?childId=XXX
   ```

5. **Check Messages**
   ```
   GET /api/v1/conversations
   ```

---

## Key Endpoints Reference

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users` - Get all users (Admin)

### Schools
- `GET /api/v1/schools` - Get all schools
- `POST /api/v1/schools` - Create school (Admin)
- `GET /api/v1/schools/:schoolId` - Get school details

### Classrooms
- `GET /api/v1/classrooms?schoolId=XXX` - Get classrooms
- `POST /api/v1/classrooms` - Create classroom (Admin)

### Children
- `GET /api/v1/children` - Get children (filtered by role)
- `POST /api/v1/children` - Add child
- `GET /api/v1/children/:childId` - Get child details

### Attendance
- `POST /api/v1/attendance/checkin` - Check in child
- `POST /api/v1/attendance/checkout` - Check out child
- `GET /api/v1/attendance?childId=XXX&date=2024-01-01` - Get attendance

### Activities
- `POST /api/v1/activities` - Log activity (Teacher)
- `GET /api/v1/activities?childId=XXX` - Get activities

### Messages
- `GET /api/v1/conversations` - Get conversations
- `POST /api/v1/conversations/:id/messages` - Send message
- `GET /api/v1/conversations/:id/messages` - Get messages

### Billing
- `GET /api/v1/invoices?parentId=XXX` - Get invoices
- `POST /api/v1/invoices` - Create invoice (Admin)
- `POST /api/v1/payments` - Process payment

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read

### File Uploads
- `POST /api/v1/upload/media` - Upload image/video
- `POST /api/v1/upload/documents` - Upload document
- `POST /api/v1/upload/avatar` - Upload profile picture

### Reports
- `GET /api/v1/reports/attendance` - Attendance report
- `GET /api/v1/reports/financial` - Financial report
- `GET /api/v1/reports/enrollment` - Enrollment report
- `GET /api/v1/reports/activities` - Activity summary

---

## User Roles & Permissions

### Admin
- Full access to all endpoints
- Can create schools, classrooms, users
- Can view all data

### Director
- Similar to admin but school-specific
- Can manage their school's data
- Can create classrooms and manage staff

### Teacher
- Can view assigned classrooms and children
- Can log activities, check in/out children
- Can communicate with parents
- Can create assessments and reports

### Parent
- Can view only their own children
- Can view activities and attendance
- Can communicate with teachers
- Can view invoices and make payments

---

## File Upload Examples

### Upload Activity Photo

```bash
POST /api/v1/upload/media
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN

Form Data:
- file: [select image/video file]
```

Response:
```json
{
  "url": "http://localhost:3000/uploads/media/file-1234567890.jpg",
  "filename": "file-1234567890.jpg",
  "size": 245678,
  "mimetype": "image/jpeg"
}
```

Then use the URL in your activity:
```json
{
  "childId": "...",
  "classroomId": "...",
  "type": "photo",
  "title": "Playing Outside",
  "mediaUrls": ["http://localhost:3000/uploads/media/file-1234567890.jpg"]
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Common error codes:
- `400` - BAD_REQUEST
- `401` - UNAUTHORIZED (invalid/missing token)
- `403` - FORBIDDEN (insufficient permissions)
- `404` - NOT_FOUND
- `409` - CONFLICT (e.g., duplicate email)
- `422` - VALIDATION_ERROR
- `500` - INTERNAL_SERVER_ERROR

---

## Testing Tips

1. **Start with Admin User**: Create an admin user first to set up schools and classrooms

2. **Use Postman Collections**: Save your requests in a Postman collection for easy testing

3. **Environment Variables in Postman**: 
   - Set `baseUrl` = `http://localhost:3000/api/v1`
   - Set `token` = your JWT token
   - Use `{{baseUrl}}` and `{{token}}` in requests

4. **Check Health**: Visit `http://localhost:3000/health` to verify server is running

5. **View Logs**: Watch the console for detailed request logs (Morgan middleware)

---

## Production Deployment

### Environment Variables for Production

Update these in your production `.env`:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/natura
JWT_SECRET=use-very-strong-random-string-here
CORS_ORIGIN=https://your-frontend-domain.com
BASE_URL=https://your-api-domain.com
```

### Security Checklist

- ✅ Change all default passwords
- ✅ Use strong JWT secrets
- ✅ Enable HTTPS
- ✅ Set proper CORS origins
- ✅ Use MongoDB Atlas or secured MongoDB
- ✅ Enable rate limiting
- ✅ Set up email service (SendGrid, AWS SES, etc.)
- ✅ Configure file upload limits
- ✅ Set up monitoring and logging

---

## Support & Documentation

- Full API Documentation: See the main documentation file
- GitHub Issues: Report bugs and feature requests
- Email: api-support@natura.com (if configured)

---

## Sample Data Seeds (Optional)

You can create a seed script to populate sample data:

```javascript
// seeds/sampleData.js
const mongoose = require('mongoose');
const User = require('../src/models/User');
const School = require('../src/models/School');
// ... import other models

// Create sample schools, users, classrooms, children
```

Run with: `node seeds/sampleData.js`

---

## Next Steps

1. **Install dependencies**: `npm install`
2. **Configure .env**: Update with your settings
3. **Start MongoDB**: Ensure it's running
4. **Run server**: `npm run dev`
5. **Test health endpoint**: `http://localhost:3000/health`
6. **Register first admin user**: Use Postman/Thunder Client
7. **Create school and classrooms**: Set up your structure
8. **Add users and children**: Populate with data
9. **Test workflows**: Try check-in, activities, messages

Happy coding! 🚀

