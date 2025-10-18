# Natura API Server

Backend API server for the Natura childcare management application.

## Features

- **Authentication**: JWT-based authentication with refresh tokens
- **User Management**: Support for parents, teachers, admins, and directors
- **School & Classroom Management**: Multi-school and classroom support
- **Child Profiles**: Comprehensive child information management
- **Attendance Tracking**: Check-in/check-out with signatures and notes
- **Activity Logging**: Meals, naps, bathroom, learning activities, and more
- **Messaging**: Real-time communication between parents and teachers
- **Billing & Payments**: Invoice generation and payment processing
- **Learning Assessments**: Track child development and milestones
- **Notifications**: Push notifications for important events
- **Calendar**: Events, field trips, and reminders
- **Reports & Analytics**: Comprehensive reporting for admins

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Payment Processing**: Stripe
- **Email**: Nodemailer

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in `.env` with your configuration

5. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

See `.env.example` for all required environment variables.

## API Documentation

The API follows RESTful principles and returns JSON responses.

**Base URL**: `http://localhost:3000/api/v1`

### Authentication

All endpoints (except `/auth/login` and `/auth/register`) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Main Endpoints

- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Schools**: `/api/v1/schools/*`
- **Classrooms**: `/api/v1/classrooms/*`
- **Children**: `/api/v1/children/*`
- **Attendance**: `/api/v1/attendance/*`
- **Activities**: `/api/v1/activities/*`
- **Messages**: `/api/v1/conversations/*`
- **Billing**: `/api/v1/invoices/*`, `/api/v1/payments/*`
- **Learning**: `/api/v1/learning-activities/*`, `/api/v1/assessments/*`
- **Notifications**: `/api/v1/notifications/*`
- **Events**: `/api/v1/events/*`
- **Reports**: `/api/v1/reports/*`

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validators
│   ├── services/        # Business logic
│   └── server.js        # Entry point
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── package.json         # Dependencies
└── README.md           # This file
```

## License

ISC

