# EduTrack System - API Endpoints Reference

**Base URL**: `http://localhost:3000/api`

---

## 🔐 AUTHENTICATION & USERS

### Auth Endpoints
```
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
GET    /auth/me
```

### User Endpoints
```
GET    /users (list all users)
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

---

## 👨‍💼 ADMIN MANAGEMENT

**Prefix**: `/admin`

```
GET    /admin                    # List all admins
GET    /admin/:id                # Get admin details
POST   /admin                    # Create new admin
PUT    /admin/:id                # Update admin
DELETE /admin/:id                # Delete admin (cascades to User)
```

**Example Request** (POST /admin):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Example Response**:
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": "...",
    "userId": "...",
    "user": { "email": "john@example.com", "role": "ADMIN" }
  }
}
```

---

## 👨‍🏫 TEACHER MANAGEMENT

**Prefix**: `/teacher`

```
GET    /teacher                       # List all teachers
GET    /teacher/:id                   # Get teacher details
POST   /teacher                       # Create teacher
PUT    /teacher/:id                   # Update teacher
DELETE /teacher/:id                   # Delete teacher
```

**Payload** (POST):
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@school.com",
  "password": "password123",
  "registrationNumber": "T001",
  "qualification": "M.Sc Computer Science",
  "designation": "Senior Teacher",
  "experience": 5,
  "gender": "FEMALE"
}
```

---

## 👨‍🎓 STUDENT MANAGEMENT

**Prefix**: `/student`

```
GET    /student                           # List all students
GET    /student/:id                       # Get student details
POST   /student                           # Create student
PUT    /student/:id                       # Update student
DELETE /student/:id                       # Delete student
POST   /student/:id/enroll                # Enroll student in class
```

**Create Payload**:
```json
{
  "name": "Ali Khan",
  "email": "ali@student.com",
  "password": "student123",
  "enrollmentNumber": "S001",
  "rollNumber": "01",
  "gender": "MALE"
}
```

**Enroll in Class** (POST /student/:studentId/enroll):
```json
{
  "classId": "uuid-of-class"
}
```

---

## 🏢 ORGANIZATION MANAGEMENT

**Prefix**: `/organizations`

```
GET    /organizations                    # List all organizations
GET    /organizations/:id                # Get organization details (with classes, children)
POST   /organizations                    # Create organization
PUT    /organizations/:id                # Update organization
DELETE /organizations/:id                # Delete organization
```

**Payload**:
```json
{
  "name": "ABC Academy",
  "description": "Leading educational institution",
  "parentId": null,                      # For hierarchical structure
  "logo": "https://example.com/logo.png"
}
```

---

## 📚 CLASS MANAGEMENT

**Prefix**: `/classes`

```
GET    /classes                          # List all classes
GET    /classes/:id                      # Get class with students & teacher
POST   /classes                          # Create class
PUT    /classes/:id                      # Update class
DELETE /classes/:id                      # Delete class
```

**Payload**:
```json
{
  "name": "Class 10-A",
  "description": "Science Stream",
  "classNumber": 10,
  "sectionCode": "A",
  "organizationId": "uuid-of-org",
  "teacherId": "uuid-of-teacher",
  "academicYear": "2024-2025"
}
```

---

## 🔍 LOOKUP MANAGEMENT (Dropdowns/Enums)

**Prefix**: `/lookups`

```
GET    /lookups                          # List all lookups
GET    /lookups/:id                      # Get lookup with values
POST   /lookups                          # Create lookup
PUT    /lookups/:id                      # Update lookup
DELETE /lookups/:id                      # Delete lookup
POST   /lookups/:id/values               # Add value to lookup
```

**Create Lookup** (POST):
```json
{
  "code": "BLOOD_TYPE",
  "name": "Blood Type",
  "description": "Medical blood group types",
  "organizationId": null                 # Optional: org-specific
}
```

**Add Lookup Value** (POST /lookups/:id/values):
```json
{
  "value": "O+",
  "label": "O Positive",
  "description": "Blood group O positive",
  "sortOrder": 1,
  "parentId": null                       # For hierarchical values
}
```

---

## 📖 WORD STORY CARDS

**Prefix**: `/word-story-cards`

```
GET    /word-story-cards                 # List all cards
GET    /word-story-cards/:id             # Get card with content & quizzes
POST   /word-story-cards                 # Create card
PUT    /word-story-cards/:id             # Update card
DELETE /word-story-cards/:id             # Delete card
POST   /word-story-cards/:id/publish     # Publish card (DRAFT → PUBLISHED)
```

**Create Card**:
```json
{
  "title": "Story of the Forest",
  "keywords": "nature, adventure, learning",
  "description": "An interactive story about forest exploration",
  "coverImage": "https://example.com/image.jpg",
  "dialogContent": {
    "dialogues": [
      {
        "character": "narrator",
        "text": "Once upon a time...",
        "audioUrl": "https://example.com/audio.mp3"
      }
    ]
  },
  "status": "DRAFT"
}
```

**Publish Card** (POST /word-story-cards/:id/publish):
```json
{}
# Changes status from DRAFT to PUBLISHED
```

---

## ✅ TASK MANAGEMENT

**Prefix**: `/tasks`

```
GET    /tasks                            # List all tasks
GET    /tasks/:id                        # Get task details
POST   /tasks                            # Create task
PUT    /tasks/:id                        # Update task
DELETE /tasks/:id                        # Delete task
```

**Payload**:
```json
{
  "title": "Homework Chapter 3",
  "description": "Complete exercises 1-10",
  "dueDate": "2024-03-15",
  "status": "PENDING",
  "classId": null                        # Optional: assign to class
}
```

**Status Values**: `PENDING`, `IN_PROGRESS`, `COMPLETED`

---

## 💬 MESSAGE MANAGEMENT

**Prefix**: `/messages`

```
GET    /messages                         # List all messages
GET    /messages/:id                     # Get message details
POST   /messages                         # Send message
PUT    /messages/:id                     # Update message
DELETE /messages/:id                     # Delete message
POST   /messages/:id/read                # Mark message as read
```

**Create Message**:
```json
{
  "title": "Important Announcement",
  "content": "Class will be held tomorrow at 2 PM",
  "audioUrl": "https://example.com/announcement.mp3",
  "senderId": "uuid-of-sender",
  "receiverId": "uuid-of-receiver",      # Optional: for individual message
  "classId": null,                       # Optional: for class broadcast
  "receiverType": "STUDENT"              # STUDENT or CLASS
}
```

**Mark as Read** (POST /messages/:id/read):
```json
{}
# Sets isRead: true
```

---

## 📊 RESPONSE FORMAT

### Success Response (2xx)
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Data retrieved successfully",
  "data": { /* resource data */ }
}
```

### Error Response (4xx, 5xx)
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid request",
  "data": null
}
```

### Validation Error
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation error",
  "data": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🔑 HTTP STATUS CODES USED

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email/code |
| 500 | Server Error | Unexpected error |

---

## 🔒 AUTHENTICATION

All endpoints except Auth require `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

**Get Token**:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📝 EXAMPLE COMPLETE WORKFLOW

### 1. Create Organization
```bash
POST /api/organizations
{
  "name": "XYZ School",
  "description": "Quality Education"
}
```

### 2. Create Teacher
```bash
POST /api/teacher
{
  "firstName": "Ahmed",
  "lastName": "Teacher",
  "email": "ahmed@xyz.com",
  "password": "secure123",
  "registrationNumber": "T0001",
  "qualification": "B.Sc",
  "designation": "Math Teacher",
  "experience": 3,
  "gender": "MALE"
}
```

### 3. Create Class
```bash
POST /api/classes
{
  "name": "Class 9-B",
  "classNumber": 9,
  "sectionCode": "B",
  "organizationId": "{orgId from step 1}",
  "teacherId": "{teacherId from step 2}",
  "academicYear": "2024-2025"
}
```

### 4. Create Student
```bash
POST /api/student
{
  "firstName": "Hassan",
  "lastName": "Student",
  "email": "hassan@xyz.com",
  "password": "student123",
  "enrollmentNumber": "S0001",
  "rollNumber": "1",
  "gender": "MALE"
}
```

### 5. Enroll Student in Class
```bash
POST /api/student/{studentId}/enroll
{
  "classId": "{classId from step 3}"
}
```

### 6. Create Task for Class
```bash
POST /api/tasks
{
  "title": "Math Assignment",
  "description": "Do exercises 1-5",
  "dueDate": "2024-03-20",
  "status": "PENDING",
  "classId": "{classId from step 3}"
}
```

### 7. Send Message to Class
```bash
POST /api/messages
{
  "title": "Class Update",
  "content": "Tomorrow's class is postponed",
  "senderId": "{teacherId from step 2}",
  "classId": "{classId from step 3}",
  "receiverType": "CLASS"
}
```

---

## 🛠️ TESTING TIPS

### Using cURL
```bash
# Get all teachers
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/teacher

# Create teacher
curl -X POST http://localhost:3000/api/teacher \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"firstName":"John","email":"john@example.com",...}'
```

### Using Postman
1. Create collection: "EduTrack API"
2. Set variable: `{{base_url}}` = http://localhost:3000/api
3. Add requests for each endpoint
4. Use pre-request script to set Authorization header
5. Run as collection with test data

---

**Version**: 1.0
**Last Updated**: Phase 2 Complete
**Ready for**: Database Migration & Testing
