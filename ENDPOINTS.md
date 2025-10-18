# Natura API - Complete Endpoints Reference

Base URL: `http://localhost:3000/api/v1`

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Schools](#schools)
4. [Classrooms](#classrooms)
5. [Children](#children)
6. [Attendance](#attendance)
7. [Activities](#activities)
8. [Conversations & Messages](#conversations--messages)
9. [Invoices & Payments](#invoices--payments)
10. [Learning Activities & Assessments](#learning-activities--assessments)
11. [Notifications](#notifications)
12. [Events](#events)
13. [Reports](#reports)
14. [File Uploads](#file-uploads)

---

## Authentication

### Register User
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "parent",
  "schoolId": "school_id_here"
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
**POST** `/auth/refresh`

Request:
```json
{
  "refreshToken": "your_refresh_token"
}
```

### Logout
**POST** `/auth/logout` 🔒

### Forgot Password
**POST** `/auth/forgot-password`

Request:
```json
{
  "email": "user@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

Request:
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

---

## Users

### Get Current User
**GET** `/users/me` 🔒

### Update Current User
**PUT** `/users/me` 🔒

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "profileImageUrl": "https://..."
}
```

### Get All Users
**GET** `/users?role=teacher&schoolId=xxx&page=1&limit=20` 🔒👑

Query Parameters:
- `role` - Filter by role (parent, teacher, admin, director)
- `schoolId` - Filter by school
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Get User by ID
**GET** `/users/:userId` 🔒

### Create User
**POST** `/users` 🔒👑

### Update User
**PUT** `/users/:userId` 🔒👑

### Delete User
**DELETE** `/users/:userId` 🔒👑

---

## Schools

### Get All Schools
**GET** `/schools` 🔒

### Get School by ID
**GET** `/schools/:schoolId` 🔒

### Create School
**POST** `/schools` 🔒👑

Request:
```json
{
  "name": "Natura Learning Center",
  "address": "123 Main St",
  "city": "Springfield",
  "state": "CA",
  "zipCode": "12345",
  "phoneNumber": "+1234567890",
  "email": "info@natura.com",
  "logoUrl": "https://...",
  "websiteUrl": "https://natura.com"
}
```

### Update School
**PUT** `/schools/:schoolId` 🔒👑

### Delete School
**DELETE** `/schools/:schoolId` 🔒👑

---

## Classrooms

### Get All Classrooms
**GET** `/classrooms?schoolId=xxx` 🔒

### Get Classroom by ID
**GET** `/classrooms/:classroomId` 🔒

### Create Classroom
**POST** `/classrooms` 🔒👑

Request:
```json
{
  "name": "Sunny Tots",
  "schoolId": "school_id",
  "description": "A warm environment",
  "teacherIds": ["teacher_id_1"],
  "capacity": 12,
  "ageGroup": "Infants (0-12 months)",
  "roomImageUrl": "https://..."
}
```

### Update Classroom
**PUT** `/classrooms/:classroomId` 🔒👑

### Delete Classroom
**DELETE** `/classrooms/:classroomId` 🔒👑

---

## Children

### Get All Children
**GET** `/children?classroomId=xxx&parentId=xxx` 🔒

### Get Child by ID
**GET** `/children/:childId` 🔒

### Create Child
**POST** `/children` 🔒

Request:
```json
{
  "firstName": "Emma",
  "lastName": "Johnson",
  "dateOfBirth": "2023-01-01",
  "gender": "female",
  "profileImageUrl": "https://...",
  "classroomId": "classroom_id",
  "schoolId": "school_id",
  "parentIds": ["parent_id_1"],
  "authorizedPickupIds": ["parent_id_1"],
  "allergies": "Peanuts",
  "medicalNotes": "Carries EpiPen",
  "emergencyContact": "+1234567890"
}
```

### Update Child
**PUT** `/children/:childId` 🔒

### Delete Child
**DELETE** `/children/:childId` 🔒👑

---

## Attendance

### Get Attendance Records
**GET** `/attendance?childId=xxx&classroomId=xxx&date=2024-01-01` 🔒

Query Parameters:
- `childId` - Filter by child
- `classroomId` - Filter by classroom
- `date` - Specific date (YYYY-MM-DD)
- `startDate` - Range start
- `endDate` - Range end

### Get Attendance by ID
**GET** `/attendance/:attendanceId` 🔒

### Check In Child
**POST** `/attendance/checkin` 🔒

Request:
```json
{
  "childId": "child_id",
  "classroomId": "classroom_id",
  "checkInTime": "2024-01-01T08:30:00Z",
  "checkInNotes": "Had a good breakfast",
  "temperature": 98.6,
  "mood": "Happy",
  "checkInSignature": "base64_or_url"
}
```

### Check Out Child
**POST** `/attendance/checkout` 🔒

Request:
```json
{
  "childId": "child_id",
  "checkOutTime": "2024-01-01T16:30:00Z",
  "checkOutNotes": "Picked up on time",
  "checkOutSignature": "base64_or_url"
}
```

### Mark Absent
**POST** `/attendance/absent` 🔒

Request:
```json
{
  "childId": "child_id",
  "date": "2024-01-01",
  "reason": "Sick"
}
```

---

## Activities

### Get Activities
**GET** `/activities?childId=xxx&type=meal&startDate=xxx&endDate=xxx` 🔒

Query Parameters:
- `childId` - Filter by child
- `classroomId` - Filter by classroom
- `teacherId` - Filter by teacher
- `type` - Filter by type (meal, nap, bathroom, learning, etc.)
- `startDate` / `endDate` - Date range
- `page` / `limit` - Pagination

### Get Activity by ID
**GET** `/activities/:activityId` 🔒

### Create Activity
**POST** `/activities` 🔒👨‍🏫

Request:
```json
{
  "childId": "child_id",
  "classroomId": "classroom_id",
  "type": "meal",
  "timestamp": "2024-01-01T12:00:00Z",
  "title": "Lunch",
  "description": "Had a great lunch today!",
  "mediaUrls": ["https://..."],
  "metadata": {
    "mealType": "lunch",
    "amount": "most",
    "foodItems": ["Chicken", "Rice", "Broccoli"]
  },
  "isSharedWithParents": true
}
```

### Update Activity
**PUT** `/activities/:activityId` 🔒👨‍🏫

### Delete Activity
**DELETE** `/activities/:activityId` 🔒👨‍🏫

### Upload Media
**POST** `/activities/media` 🔒👨‍🏫
(Multipart form data)

---

## Conversations & Messages

### Get Conversations
**GET** `/conversations?userId=xxx` 🔒

### Get Conversation by ID
**GET** `/conversations/:conversationId` 🔒

### Create Conversation
**POST** `/conversations` 🔒

Request:
```json
{
  "participantIds": ["parent_id", "teacher_id"],
  "childId": "child_id",
  "classroomId": "classroom_id",
  "title": "Emma's Progress"
}
```

### Get Messages
**GET** `/conversations/:conversationId/messages?page=1&limit=50` 🔒

### Send Message
**POST** `/conversations/:conversationId/messages` 🔒

Request:
```json
{
  "type": "text",
  "content": "Thank you for the update!",
  "attachmentUrls": []
}
```

### Mark All Messages as Read
**PUT** `/conversations/:conversationId/read-all` 🔒

### Mark Message as Read
**PUT** `/messages/:messageId/read` 🔒

---

## Invoices & Payments

### Get Invoices
**GET** `/invoices?parentId=xxx&status=pending&childId=xxx` 🔒

### Get Invoice by ID
**GET** `/invoices/:invoiceId` 🔒

### Create Invoice
**POST** `/invoices` 🔒👑

Request:
```json
{
  "parentId": "parent_id",
  "childId": "child_id",
  "schoolId": "school_id",
  "invoiceDate": "2024-01-01",
  "dueDate": "2024-01-15",
  "amount": 1200.00,
  "items": [
    {
      "description": "Monthly Tuition",
      "quantity": 1,
      "unitPrice": 1000.00,
      "total": 1000.00
    }
  ],
  "notes": "Thank you!"
}
```

### Update Invoice
**PUT** `/invoices/:invoiceId` 🔒👑

### Delete Invoice
**DELETE** `/invoices/:invoiceId` 🔒👑

### Process Payment
**POST** `/payments` 🔒

Request:
```json
{
  "invoiceId": "invoice_id",
  "amount": 1200.00,
  "method": "creditCard",
  "transactionId": "txn_123456",
  "notes": "Payment via Stripe"
}
```

### Get Payment History
**GET** `/payments?parentId=xxx&invoiceId=xxx` 🔒

### Get Payment by ID
**GET** `/payments/:paymentId` 🔒

---

## Learning Activities & Assessments

### Get Learning Activities
**GET** `/learning-activities?ageGroup=Toddlers&domain=cognitive` 🔒

### Get Learning Activity by ID
**GET** `/learning-activities/:activityId` 🔒

### Create Learning Activity
**POST** `/learning-activities` 🔒👨‍🏫

### Update Learning Activity
**PUT** `/learning-activities/:activityId` 🔒👨‍🏫

### Delete Learning Activity
**DELETE** `/learning-activities/:activityId` 🔒👨‍🏫

### Get Assessments
**GET** `/assessments?childId=xxx&domain=cognitive` 🔒

### Get Assessment by ID
**GET** `/assessments/:assessmentId` 🔒

### Create Assessment
**POST** `/assessments` 🔒👨‍🏫

Request:
```json
{
  "childId": "child_id",
  "classroomId": "classroom_id",
  "assessmentDate": "2024-01-01",
  "skillName": "Recognizes primary colors",
  "domain": "cognitive",
  "level": "emerging",
  "notes": "Emma is beginning to identify red and yellow",
  "mediaUrls": ["https://..."]
}
```

### Update Assessment
**PUT** `/assessments/:assessmentId` 🔒👨‍🏫

### Delete Assessment
**DELETE** `/assessments/:assessmentId` 🔒👨‍🏫

### Get Development Reports
**GET** `/reports?childId=xxx` 🔒

### Create Development Report
**POST** `/reports` 🔒👨‍🏫

---

## Notifications

### Get Notifications
**GET** `/notifications?userId=xxx&isRead=false` 🔒

### Mark Notification as Read
**PUT** `/notifications/:notificationId/read` 🔒

### Mark All as Read
**PUT** `/notifications/read-all` 🔒

### Delete Notification
**DELETE** `/notifications/:notificationId` 🔒

### Send Push Notification
**POST** `/notifications/push` 🔒👨‍🏫

Request:
```json
{
  "userIds": ["parent_id_1", "parent_id_2"],
  "type": "announcement",
  "title": "School Event Tomorrow",
  "body": "Don't forget about the field trip!",
  "data": {
    "eventId": "event_id"
  }
}
```

---

## Events

### Get Calendar Events
**GET** `/events?schoolId=xxx&classroomId=xxx&startDate=xxx&endDate=xxx` 🔒

### Get Event by ID
**GET** `/events/:eventId` 🔒

### Create Event
**POST** `/events` 🔒👨‍🏫

Request:
```json
{
  "title": "Parent-Teacher Conference",
  "description": "Quarterly progress review",
  "type": "parentTeacherConference",
  "startDate": "2024-01-15T14:00:00Z",
  "endDate": "2024-01-15T15:00:00Z",
  "isAllDay": false,
  "location": "Classroom A",
  "schoolId": "school_id",
  "classroomId": "classroom_id",
  "attendeeIds": ["parent_id", "teacher_id"],
  "color": "#4CAF50"
}
```

### Update Event
**PUT** `/events/:eventId` 🔒👨‍🏫

### Delete Event
**DELETE** `/events/:eventId` 🔒👨‍🏫

---

## Reports

### Get Attendance Report
**GET** `/reports/attendance?schoolId=xxx&startDate=2024-01-01&endDate=2024-01-31` 🔒👨‍🏫

### Get Financial Report
**GET** `/reports/financial?schoolId=xxx&year=2024&month=1` 🔒👨‍🏫

### Get Enrollment Report
**GET** `/reports/enrollment?schoolId=xxx` 🔒👨‍🏫

### Get Activity Summary Report
**GET** `/reports/activities?childId=xxx&startDate=xxx&endDate=xxx` 🔒

---

## File Uploads

### Upload Media
**POST** `/upload/media` 🔒
- Content-Type: multipart/form-data
- Max size: 50MB
- Formats: JPG, PNG, GIF, MP4, MOV, WEBP

### Upload Document
**POST** `/upload/documents` 🔒
- Content-Type: multipart/form-data
- Max size: 10MB
- Formats: PDF, DOC, DOCX, XLS, XLSX

### Upload Avatar
**POST** `/upload/avatar` 🔒
- Content-Type: multipart/form-data
- Max size: 5MB
- Formats: JPG, PNG

### Upload Multiple Files
**POST** `/upload/multiple` 🔒
- Content-Type: multipart/form-data
- Max files: 10
- Max size per file: 50MB

---

## Legend

- 🔒 = Requires authentication (JWT token)
- 👑 = Requires admin or director role
- 👨‍🏫 = Requires teacher role or above

---

## Rate Limiting

- Default: 1000 requests per hour per user
- School-wide: 10,000 requests per hour

Response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## Pagination

All list endpoints support:
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sort` (e.g., `createdAt:desc`)

Response format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

