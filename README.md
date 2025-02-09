# PH-University Management System Backend

## Introduction
PH-University Management System is a robust backend application designed to manage university operations efficiently. It handles student records, course management, faculty administration, and more, ensuring seamless institutional management.

## Features
- **User Authentication & Authorization** (Admin, Faculty, Students)
- **Student Enrollment & Management**
- **Course & Curriculum Management**
- **Faculty & Staff Management**
- **Exam & Grading System**
- **Attendance Tracking**
- **Payment & Fees Management**
- **Reports & Analytics**
- **RESTful API for Frontend Integration**

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, bcrypt
- **Cloud Storage:** AWS S3
- **Deployment:** Docker, CI/CD with GitHub Actions

## Installation
### Prerequisites
- Node.js & npm installed
- MongoDB database
- Environment variables configured

### Steps
```bash
# Clone the repository
git clone https://github.com/mdnoyonhossain/University-Management-Server.git
cd PH-University-Backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the server
npm run start:dev
```

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/students` | Fetch all students |
| GET | `/api/courses` | Fetch all courses |
| POST | `/api/courses` | Add a new course |

### [More detailed API documentation available in Postman Collection](https://documenter.getpostman.com/view/26694209/2sA2xjyWRv)

## Contributing
We welcome contributions! Please follow these steps:
1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature-branch`)
3. **Commit changes** (`git commit -m "feat: Added new feature"`)
4. **Push** to your fork and create a **Pull Request**

---
Made with ❤️ by [Noyon Hossain](https://noyonhossain.vercel.app/)
