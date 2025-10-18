# Demo Data Seed Guide

## How to Create Demo Data & Login

### Step 1: Make sure MongoDB is running

```bash
# If using local MongoDB
mongod

# OR if using MongoDB Atlas, update your .env file with the connection string
```

### Step 2: Make sure your .env file is configured

```bash
# Ensure .env exists and has at least:
MONGODB_URI=mongodb://localhost:27017/natura
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

### Step 3: Run the seed script

```bash
node seeds/demoData.js
```

You should see output like this:
```
MongoDB Connected
Clearing existing data...
Data cleared!
Creating demo data...

Creating school...
✓ School created: Little Sprouts Academy

Creating users...
✓ Admin created: admin@natura.com
✓ Director created: director@natura.com
✓ Teacher 1 created: sarah@natura.com
✓ Teacher 2 created: michael@natura.com
✓ Parent 1 created: emma.wilson@example.com
✓ Parent 2 created: david.smith@example.com

... (more output)

✅ Demo data created successfully!
```

### Step 4: Login with Demo Accounts

You can now login with any of these accounts:

#### 🔑 ADMIN ACCOUNT
- **Email**: `admin@natura.com`
- **Password**: `password123`
- **Access**: Full system access

#### 🔑 DIRECTOR ACCOUNT
- **Email**: `director@natura.com`
- **Password**: `password123`
- **Access**: School management

#### 🔑 TEACHER ACCOUNTS
- **Email**: `sarah@natura.com`
- **Password**: `password123`
- **Classroom**: Sunshine Room (Toddlers)

- **Email**: `michael@natura.com`
- **Password**: `password123`
- **Classroom**: Rainbow Room (Preschool)

#### 🔑 PARENT ACCOUNTS
- **Email**: `emma.wilson@example.com`
- **Password**: `password123`
- **Child**: Lily Wilson (in Sunshine Room)

- **Email**: `david.smith@example.com`
- **Password**: `password123`
- **Child**: Liam Smith (in Rainbow Room)

---

## What Demo Data is Created?

### 📚 1 School
- **Little Sprouts Academy**

### 🏫 2 Classrooms
- **Sunshine Room** (Toddlers 1-2 years) - Teacher: Sarah
- **Rainbow Room** (Preschool 3-5 years) - Teacher: Michael

### 👥 6 Users
- 1 Admin
- 1 Director
- 2 Teachers
- 2 Parents

### 👶 2 Children
- **Lily Wilson** (Parent: Emma Wilson, Classroom: Sunshine Room)
- **Liam Smith** (Parent: David Smith, Classroom: Rainbow Room)

### ✅ Today's Attendance
- Both children checked in this morning
- Temperature and mood recorded

### 🎨 Activities
- Finger painting activity for Lily
- Counting blocks activity for Liam
- Lunch record for Lily

### 💬 Messages
- 1 conversation between Emma (parent) and Sarah (teacher) about Lily's progress

### 💰 Invoices
- 1 PAID invoice for Emma Wilson ($1,200 - February tuition)
- 1 PENDING invoice for David Smith ($1,200 - March tuition)

### 💳 Payments
- 1 payment record for Emma's February invoice

### 📖 Learning Activities
- Color Recognition (for Toddlers)
- Number Recognition 1-10 (for Preschool)

### 📊 Assessments
- 1 cognitive assessment for Lily

### 🔔 Notifications
- Activity update for Emma
- Payment reminder for David

### 📅 Calendar Events
- Parent-Teacher Conference (March 15)
- Spring Break (March 25-29)

---

## Testing the API

### Example 1: Login as Parent

**POST** `http://localhost:3000/api/v1/auth/login`

```json
{
  "email": "emma.wilson@example.com",
  "password": "password123"
}
```

**Response:** You'll get a token - save it!

### Example 2: Get My Children (as Parent)

**GET** `http://localhost:3000/api/v1/children`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:** You'll see Lily Wilson's profile

### Example 3: Get Today's Activities (as Parent)

**GET** `http://localhost:3000/api/v1/activities?childId=LILY_ID`

**Response:** You'll see finger painting and lunch activities

### Example 4: Check Messages (as Parent)

**GET** `http://localhost:3000/api/v1/conversations`

**Response:** You'll see conversation with Sarah (teacher)

---

## Re-running the Seed

If you want to reset the database and create fresh demo data:

```bash
# Just run the seed script again
node seeds/demoData.js
```

⚠️ **Warning:** This will DELETE ALL EXISTING DATA and create fresh demo data!

---

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Make sure MongoDB is running: `mongod`
- Check your `.env` file has correct `MONGODB_URI`

### Error: "Module not found"
- Run: `npm install`

### Error: "Invalid password"
- The seed script creates all passwords as `password123`
- Make sure you're using the exact email from the list above

### Want to see the data in MongoDB?
```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use natura

# View users
db.users.find().pretty()

# View children
db.children.find().pretty()

# View activities
db.activities.find().pretty()
```

---

## Next Steps

1. ✅ Run the seed script
2. ✅ Login with one of the demo accounts
3. ✅ Test the API endpoints
4. ✅ Build your frontend using this API!

Happy testing! 🚀


