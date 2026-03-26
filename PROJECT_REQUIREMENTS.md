# ELODI Platform - Project Overview

## 1. Project Overview

**Project Name:** eduTrack System  
**Author:** Edict Digital  
**Type:** Educational Management Platform  
**Version:** 1.0.6

### Core Purpose
EduTrack is an educational platform for interactive learning through:
- **Word Story Cards** - Interactive learning content with text, audio, and quizzes
- **Messaging** - Teacher-student communication (including audio)
- **Assessments & Quizzes** - Multiple question types
- **Task Management** - Assign and track student work
- **Material Management** - Rich text learning materials



# Simple Explanation of Organizations, Classes, and Lookups

---

## 1. Organizations (School / Institution)

Think of this as a **School or Company** that uses the system.

### Examples:
- Green Valley School  
- Oxford University  
- ABC Company Training  

### Features:
- Can have **child organizations** (like branches):
  - Main School → Branch 1, Branch 2  
  - Company HQ → Department A, Department B  

### Why needed?
- Separate different schools/companies  
- Each organization has its own **classes, teachers, and students**  
- Admin of one school **can't see another school's data**  

---

## 2. Classes (Grade / Group)

Think of this as a **Class or Grade** in a school.

### Examples:
- Class 5-A  
- Grade 10 Science  
- Batch 2024  

### Features:
- Belongs to **one Organization**  
- Has **one Teacher** (main teacher)  
- Has **many Students** enrolled  

### Why needed?
- Group students together  
- Teacher can send messages to the **entire class**  
- Assign tasks to a **specific class**  

---

## 3. Lookups (Dropdown Options / Settings)

Think of this as **dropdown menus or settings** that admins can customize.

### Examples:
- Gender: Male, Female, Other  
- Country: Bangladesh, India, USA  
- Blood Type: A+, B+, O+, AB+  
- Card Difficulty: Easy, Medium, Hard  
- Quiz Type: Multiple Choice, True/False  

### How it works:
1. Admin creates a **Lookup** (e.g., "Country")  
2. Admin adds **Values** (Bangladesh, India, USA...)  
3. When creating a User/Card/Student, users select from a dropdown  

### Why needed?
- Easy dropdown menus instead of typing  
- Admin can **add/change options without coding**  
- Ensures **consistent data** (everyone uses same values)  

---

## Summary

| Feature        | Purpose |
|----------------|--------|
| Organization   | Represents a school/company |
| Class          | Groups students under an organization |
| Lookup         | Provides customizable dropdown options |


### User Roles (Simple)
| Role | Description |
|------|-------------|
| Admin | Administrative access - manages organizations, classes, users, lookups |
| Teacher | Content creation & management - creates cards, materials, tasks, messages |
| Student | Learning content access - views cards, receives messages, completes tasks |

---

## 2. Module Structure

### A. Administration Module
1. **Organizations** - Hierarchical organization management (parent-child)
2. **Classes** - Class management with teacher assignment, student enrollment
3. **Users** - User CRUD + bulk CSV import
4. **Lookups** - System lookup tables & values (hierarchical)

### B. Content Module
1. **Word Story Cards** - Interactive learning cards with:
   - Title, Keywords, Description, Description Sound (audio URL)
   - Dialog Title, Dialog Content (JSON - multi-character conversations)
   - Card Contents (images, sounds positioned on card)
   - Quizzes integration
   - Status: DRAFT or PUBLISHED

2. **Card Contents** - Visual elements positioned on cards:
   - Image URLs
   - Sound/Audio URLs
   - Position: x, y coordinates
   - Size: width, height
   - Sequence order

3. **Materials** - Learning materials:
   - Title, Rich text content
   - Material types
   - Card association (optional)

4. **Assessments** - Quiz management:
   - MULTIPLE_CHOICE
   - TRUE_FALSE
   - FILL_BLANK
   - MATCHING
   - Passing score per assessment

### C. Student Module
1. **Word Story Cards** - Student view:
   - Read mode (text content)
   - Listen mode (audio playback)
   - Quiz mode
   - Progress: isRead, isListened, completedQuizzes

2. **Messages** - Communication:
   - Receive messages from teachers
   - Audio messages
   - Read/unread status

3. **Assignments** - Task viewing:
   - Assigned tasks
   - Due dates
   - Completion status

### D. Teacher Module
1. **Tasks** - Task management:
   - Create/edit/delete tasks
   - Assign to students
   - Due date management
   - Status: PENDING, IN_PROGRESS, COMPLETED
   - Progress tracking

2. **Students** - Student management:
   - View enrolled students
   - Monitor progress
   - Track assignments

3. **Messages** - Send messages:
   - Create messages
   - Audio recording support
   - Send to individual students or classes

4. **Card Management** - View & manage:
   - All cards list
   - Card details with quizzes
   - Material association
   - Smart presentation mode

5. **Reports** - Generate reports:
   - Student reports
   - Progress reports
   - Assessment results

---

## 3. Database Schema (PostgreSQL with Prisma)

### Core Tables

```prisma
// Users Table
model User {
  id             Int       @id @default(autoincrement())
  email          String    @unique
  password       String
  name           String
  userType       UserType  // ADMIN, TEACHER, STUDENT
  organizationId Int?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  // Relations
  classes           Class[]
  sentMessages      Message[] @relation("Sender")
  receivedMessages  Message[] @relation("Receiver")
  tasks             Task[]    @relation("AssignedTasks")
  studentProgress   StudentProgress[]
}

enum UserType {
  ADMIN
  TEACHER
  STUDENT
}

// Organization Table (Hierarchical)
model Organization {
  id          Int           @id @default(autoincrement())
  name        String
  description String?
  parentId    Int?
  parent      Organization? @relation("OrgHierarchy", fields: [parentId], references: [id])
  children    Organization[] @relation("OrgHierarchy")
  classes     Class[]
  users       User[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

// Class Table
model Class {
  id             Int           @id @default(autoincrement())
  name           String
  description    String?
  organizationId Int?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  teacherId      Int?
  teacher        User?         @relation(fields: [teacherId], references: [id])
  students       User[]        // Many-to-many with User
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

// Word Story Card Table
model WordStoryCard {
  id               Int          @id @default(autoincrement())
  title            String
  keywords         String?
  description      String?
  descriptionSound String?      // Sound/Audio URL
  dialogTitle      String?
  dialogContent    Json?        // Array of dialog items
  status           CardStatus   @default(DRAFT)
  cardContents     CardContent[]
  quizzes          Quiz[]
  materials        Material[]
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
}

enum CardStatus {
  DRAFT
  PUBLISHED
}

// Card Content Table
model CardContent {
  id        Int            @id @default(autoincrement())
  cardId    Int
  card      WordStoryCard  @relation(fields: [cardId], references: [id], onDelete: Cascade)
  imageUrl  String?
  soundUrl  String?
  xPosition Int            @default(0)
  yPosition Int            @default(0)
  width     Int            @default(100)
  height    Int            @default(100)
  seq       Int            @default(0)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}

// Quiz Table
model Quiz {
  id            Int         @id @default(autoincrement())
  cardId        Int
  card          WordStoryCard @relation(fields: [cardId], references: [id], onDelete: Cascade)
  type          QuizType
  question      String
  options       Json?       // Array of options
  correctAnswer Json
  points        Int        @default(1)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

enum QuizType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  FILL_BLANK
  MATCHING
}

// Material Table
model Material {
  id        Int          @id @default(autoincrement())
  title     String
  content   String       // Rich text (HTML)
  type      String?
  cardId    Int?
  card      WordStoryCard? @relation(fields: [cardId], references: [id], onDelete: SetNull)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}

// Assessment Table
model Assessment {
  id           Int       @id @default(autoincrement())
  title        String
  description  String?
  cardId       Int?
  questions    Json      // Array of question objects
  passingScore Int       @default(60)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

// Task Table
model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  cardId      Int?
  dueDate     DateTime?
  status      TaskStatus @default(PENDING)
  assignedTo  User[]    @relation("AssignedTasks")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

// Message Table
model Message {
  id           Int           @id @default(autoincrement())
  title        String
  content      String?
  audioUrl     String?
  senderId     Int
  sender       User          @relation("Sender", fields: [senderId], references: [id])
  receiverId   Int?
  receiver     User?         @relation("Receiver", fields: [receiverId], references: [id])
  receiverType ReceiverType @default(STUDENT)
  isRead       Boolean       @default(false)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

enum ReceiverType {
  STUDENT
  CLASS
}

// Lookup Table
model Lookup {
  id          Int           @id @default(autoincrement())
  code        String        @unique
  name        String
  description String?
  values      LookupValue[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model LookupValue {
  id         Int      @id @default(autoincrement())
  lookupId   Int
  lookup     Lookup   @relation(fields: [lookupId], references: [id], onDelete: Cascade)
  value      String
  label      String
  sortOrder  Int      @default(0)
  parentId   Int?     // For hierarchical lookups
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// Student Progress Table
model StudentProgress {
  id            Int      @id @default(autoincrement())
  studentId     Int
  student       User     @relation(fields: [studentId], references: [id])
  cardId        Int?
  quizId        Int?
  score         Int?
  completed     Boolean  @default(false)
  isRead        Boolean  @default(false)
  isListened    Boolean  @default(false)
  hasQuiz       Boolean  @default(false)
  hasAssignment Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 4. API Endpoints (Backend)

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/register` | User registration |

### Organizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations` | List organizations |
| POST | `/api/organizations` | Create organization |
| GET | `/api/organizations/:id` | Get by ID |
| PUT | `/api/organizations/:id` | Update |
| DELETE | `/api/organizations/:id` | Delete |

### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | List classes |
| POST | `/api/classes` | Create class |
| GET | `/api/classes/:id` | Get by ID |
| PUT | `/api/classes/:id` | Update |
| DELETE | `/api/classes/:id` | Delete |
| GET | `/api/classes/:id/students` | Get students |
| POST | `/api/classes/:id/students` | Add students |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| POST | `/api/users/bulk` | Bulk create (CSV) |
| GET | `/api/users/:id` | Get by ID |
| PUT | `/api/users/:id` | Update |
| DELETE | `/api/users/:id` | Delete |

### Word Story Cards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/word-story-cards` | List cards |
| POST | `/api/word-story-cards` | Create card |
| GET | `/api/word-story-cards/:id` | Get by ID |
| PUT | `/api/word-story-cards/:id` | Update |
| DELETE | `/api/word-story-cards/:id` | Delete |
| POST | `/api/word-story-cards/:id/publish` | Publish |
| GET | `/api/word-story-cards/:id/contents` | Get contents |
| POST | `/api/word-story-cards/:id/contents` | Add content |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/word-story-cards/:id/quizzes` | Get card quizzes |
| POST | `/api/word-story-cards/:id/quizzes` | Create quiz |
| PUT | `/api/quizzes/:id` | Update |
| DELETE | `/api/quizzes/:id` | Delete |

### Materials
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/materials` | List materials |
| POST | `/api/materials` | Create material |
| GET | `/api/materials/:id` | Get by ID |
| PUT | `/api/materials/:id` | Update |
| DELETE | `/api/materials/:id` | Delete |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get by ID |
| PUT | `/api/tasks/:id` | Update |
| DELETE | `/api/tasks/:id` | Delete |
| POST | `/api/tasks/:id/assign` | Assign students |
| GET | `/api/tasks/student/:studentId` | Student tasks |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | List messages |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/:id` | Get by ID |
| DELETE | `/api/messages/:id` | Delete |
| PUT | `/api/messages/:id/read` | Mark read |
| GET | `/api/messages/student/:studentId` | Student messages |

### Lookups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lookups` | List lookups |
| POST | `/api/lookups` | Create lookup |
| GET | `/api/lookups/:id` | Get by ID |
| PUT | `/api/lookups/:id` | Update |
| DELETE | `/api/lookups/:id` | Delete |
| GET | `/api/lookups/:code/values` | Get values |
| POST | `/api/lookups/:id/values` | Add value |

### Student APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/cards` | Get assigned cards |
| GET | `/api/student/cards/:id` | Get card details |
| POST | `/api/student/cards/:id/read` | Mark read |
| POST | `/api/student/cards/:id/listen` | Mark listened |
| GET | `/api/student/messages` | Get messages |
| GET | `/api/student/assignments` | Get assignments |
| GET | `/api/student/progress` | Get progress |
| POST | `/api/student/quiz/:quizId/submit` | Submit quiz |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/image` | Upload image |
| POST | `/api/upload/audio` | Upload audio |
| POST | `/api/upload/file` | Upload file |

---

## 5. Frontend Routes (React)

### Public Routes
| Route | Description |
|-------|-------------|
| `/login` | User login |
| `/access-denied` | Unauthorized access |

### Student Routes
| Route | Description |
|-------|-------------|
| `/student/word-story-card` | Browse cards |
| `/student/word-story-card/:id` | Card detail |
| `/student/messages` | Student messages |
| `/student/assignments` | Student assignments |

### Teacher Routes
| Route | Description |
|-------|-------------|
| `/teacher/all-cards` | All cards management |
| `/teacher/storycard/:id` | Card details |
| `/teacher/material/:id` | Material details |
| `/teacher/smart-presentation/:id` | Presentation mode |
| `/teacher/tasks` | Task list |
| `/teacher/tasks/create` | Create task |
| `/teacher/tasks/:id/edit` | Edit task |
| `/teacher/students` | Student list |
| `/teacher/messages` | Message list |
| `/teacher/messages/create` | Create message |
| `/teacher/reports` | Reports |

### Admin Routes
| Route | Description |
|-------|-------------|
| `/home` | Dashboard |
| `/organizations` | Organizations |
| `/organizations/create` | Create org |
| `/organizations/:id/edit` | Edit org |
| `/classes` | Classes |
| `/classes/create` | Create class |
| `/classes/:id/edit` | Edit class |
| `/users` | Users |
| `/users/create` | Create user |
| `/users/create-bulk` | Bulk create |
| `/users/:id/edit` | Edit user |
| `/word-story-cards` | Card management |
| `/word-story-cards/create` | Create card |
| `/word-story-cards/:id/edit` | Edit card |
| `/materials` | Materials |
| `/materials/create` | Create material |
| `/materials/:id/edit` | Edit material |
| `/assessments` | Assessments |
| `/assessments/create` | Create assessment |
| `/assessments/:id/edit` | Edit assessment |
| `/lookups` | Lookups |
| `/lookups/create` | Create lookup |
| `/lookups/:id/edit` | Edit lookup |
| `/values` | Lookup values |

---

## 6. Authorization

### Simple Role-Based Access

Access is controlled by checking the user's `userType` field:

```typescript
// Simple role checking examples
if (user.userType === 'ADMIN') {
  // Access to admin features
}

if (user.userType === 'TEACHER') {
  // Access to teacher features
}

if (user.userType === 'STUDENT') {
  // Access to student features
}
```

### Role Permissions (Simplified)

| Feature | ADMIN | TEACHER | STUDENT |
|---------|-------|---------|---------|
| Organizations | ✓ | - | - |
| Classes | ✓ | - | - |
| Users | ✓ | - | - |
| Lookups | ✓ | - | - |
| Word Story Cards | ✓ | ✓ | - |
| Materials | ✓ | ✓ | - |
| Assessments | ✓ | ✓ | - |
| Tasks | ✓ | ✓ | - |
| Messages | ✓ | ✓ | ✓ |
| Student Features | - | - | ✓ |

### Implementation

```typescript
// Example: AuthorityGuard component
const AuthorityGuard = ({ allowedRoles }: { allowedRoles: UserType[] }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.userType)) {
    return <Navigate to="/access-denied" />;
  }
  
  return < Outlet />;
};

// Usage
<Route 
  path="/admin/users" 
  element={
    <AuthorityGuard allowedRoles={['ADMIN']}>
      <UsersPage />
    </AuthorityGuard>
  } 
/>
```

---

## 7. Recommended Tech Stack

### Frontend (React)
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- React Router v6
- React Hook Form + Zod (forms)
- TanStack Table
- Lucide React (icons)

### Backend
- Express.js or Node.js
- Prisma ORM
- PostgreSQL
- JWT (authentication)
- bcrypt (password hashing)
- multer (file uploads)

---

## Example Data
# Database Records After Complete Flow

---

## Organizations

| ID | Name                          | ParentID |
|----|-------------------------------|----------|
| 1  | Dhaka International College   | NULL     |

---

## Classes

| ID | Name                     | OrganizationID | TeacherID |
|----|--------------------------|----------------|-----------|
| 1  | Batch 2024 - Science     | 1              | 2         |

---

## Users

| ID | Name       | Email               | UserType | OrganizationID |
|----|------------|---------------------|----------|----------------|
| 1  | Admin      | admin@college.edu   | ADMIN    | 1              |
| 2  | Mr. Karim  | karim@college.edu   | TEACHER  | 1              |
| 3  | Rahim      | rahim@college.edu   | STUDENT  | 1              |
| 4  | Sara       | sara@college.edu    | STUDENT  | 1              |
| 5  | Jamil      | jamil@college.edu   | STUDENT  | 1              |

---

## Class_Students (Many-to-Many)

| ClassID | StudentID |
|---------|----------|
| 1       | 3        |
| 1       | 4        |
| 1       | 5        |

---

## WordStoryCards

| ID | Title          | Status     |
|----|----------------|------------|
| 1  | Eiffel Tower   | PUBLISHED  |

---

## Tasks

| ID | Title                    | DueDate    | Status   |
|----|--------------------------|------------|----------|
| 1  | Read Eiffel Tower Card   | 2026-03-30 | PENDING  |

---

## Task_Students (Many-to-Many)

| TaskID | StudentID | Status        |
|--------|-----------|---------------|
| 1      | 3         | COMPLETED     |
| 1      | 4         | IN_PROGRESS   |
| 1      | 5         | PENDING       |

---

## Messages

| ID | Title        | SenderID | ReceiverID | ReceiverType | isRead |
|----|--------------|----------|------------|--------------|--------|
| 1  | New Lesson!  | 2        | NULL       | CLASS        | false  |

---

## StudentProgress

| ID | StudentID | CardID | isRead | isListened | Score |
|----|-----------|--------|--------|------------|--------|
| 1  | 3         | 1      | true   | true       | 100    |
| 2  | 4         | 1      | true   | false      | NULL   |
| 3  | 5         | 1      | false  | false      | NULL   |

---

*Document generated from ELODI Platform source code analysis*
*Generated: 2026-03-25*
