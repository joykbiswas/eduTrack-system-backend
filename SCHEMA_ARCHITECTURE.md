# Prisma Schema - Modular Architecture

## Overview

The Prisma schema is now organized in a **modular, file-based structure** within the `prisma/schema/` directory. All `.prisma` files in this directory are automatically loaded and composed by Prisma v5+.

**Key Benefits:**
✅ Better organization and maintainability
✅ Logical separation of concerns  
✅ Easier to track changes in version control
✅ Team-friendly (reduces merge conflicts)
✅ Clear domain boundaries

---

## File Structure

```
prisma/schema/
├── _schema.prisma           # ⭐ CORE: Generator & Datasource
├── enums.prisma             # All enum types
├── auth.prisma              # Better-Auth & User management
├── student.prisma           # Student model
├── teacher.prisma           # Teacher model
├── admin.prisma             # Admin model
├── organization.prisma      # Organization, Class, StudentClass
├── education.prisma         # WordStoryCard, Quiz, Material, Assessment, StudentProgress
├── task.prisma              # Task, StudentTask
├── message.prisma           # Message communication
├── lookup.prisma            # Lookup, LookupValue (dropdowns)
├── payment.prisma           # Payment transactions
└── schema.prisma            # 📖 Documentation & Index (empty, self-referential)
```

---

## File Descriptions

### Core Configuration

#### `_schema.prisma` **[DO NOT REMOVE]**
- Contains the **generator** and **datasource** blocks
- Essential for Prisma client generation
- Defines PostgreSQL connection
- Output: `../../src/generated/prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Enumerations

#### `enums.prisma`
All enum types organized by domain:

**Authentication & User:**
- `Role`: SUPER_ADMIN, ADMIN, TEACHER, STUDENT
- `UserStatus`: ACTIVE, BLOCKED, DELETED

**Profile:**
- `Gender`: MALE, FEMALE, OTHER

**Education:**
- `CardStatus`: DRAFT, PUBLISHED
- `QuizType`: MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK, MATCHING
- `TaskStatus`: PENDING, IN_PROGRESS, COMPLETED
- `ReceiverType`: STUDENT, CLASS

**Legacy (for reference):**
- `BloodGroup`: A_POSITIVE, A_NEGATIVE, etc.
- `AppointmentStatus`: SCHEDULED, INPROGRESS, COMPLETED, CANCELED
- `PaymentStatus`: PAID, UNPAID

### Authentication & User Management

#### `auth.prisma` - Better-Auth Integration
Models for secure authentication with role-based access:

**User** - Core user account
```prisma
model User {
  id              String     @id
  name            String
  email           String     @unique
  role            Role       @default(STUDENT)     // Role-based access
  status          UserStatus @default(ACTIVE)      // Account status
  emailVerified   Boolean    @default(false)
  needPasswordChange Boolean @default(false)
  isDeleted       Boolean    @default(false)
  deletedAt       DateTime?
  
  // Better-Auth Relations
  sessions        Session[]
  accounts        Account[]
  
  // Role-Based Relations (1:1)
  student         Student?
  teacher         Teacher?
  admin           Admin?
  
  // Communication
  sentMessages    Message[]  @relation("Sender")
  receivedMessages Message[] @relation("Receiver")
}
```

**Session** - Active user sessions
```prisma
model Session {
  id        String   @id
  token     String   @unique
  expiresAt DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ipAddress String?
  userAgent String?
}
```

**Account** - OAuth & credential storage
```prisma
model Account {
  id          String   @id
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  providerId  String   // e.g., "google", "github", "credentials"
  accountId   String
  password    String?  // For email/password auth
  accessToken String?
  refreshToken String?
  // ... other OAuth fields
}
```

### User Role Models

#### `student.prisma`
Student learner profiles with enrollment tracking

```prisma
model Student {
  id           String   @id @default(uuid(7))
  name         String
  email        String   @unique
  userId       String   @unique  // 1:1 relation with User
  user         User     @relation(...)
  
  enrolledClasses StudentClass[]   // M:M with Class
  assignedTasks   StudentTask[]    // M:M with Task
  progress        StudentProgress[] // Progress tracking
}
```

#### `teacher.prisma`
Educational staff with qualifications and experience

```prisma
model Teacher {
  id                 String   @id @default(uuid(7))
  name               String
  registrationNumber String   @unique
  qualification      String
  designation        String
  experience         Int      @default(0)
  gender             Gender
  averageRating      Float    @default(0.0)
  userId             String   @unique  // 1:1 with User
  user               User     @relation(...)
  
  assignedClasses Class[]  // 1:M - Classes taught
}
```

#### `admin.prisma`
Platform administrators with user management capabilities

```prisma
model Admin {
  id           String   @id @default(uuid(7))
  name         String
  email        String   @unique
  userId       String   @unique  // 1:1 with User
  user         User     @relation(...)
}
```

### Institutional Structure

#### `organization.prisma` - Hierarchy & Classrooms

**Organization** - School/institution hierarchy
```prisma
model Organization {
  id          String   @id @default(uuid(7))
  name        String
  description String?
  
  // Hierarchical (parent-child)
  parentId    String?
  parent      Organization? @relation("OrgHierarchy", ...)
  children    Organization[] @relation("OrgHierarchy")
  
  classes     Class[]
  lookups     Lookup[]  // Org-specific dropdowns
}
```

**Class** - Student groupings
```prisma
model Class {
  id             String   @id @default(uuid(7))
  name           String
  classNumber    Int?
  sectionCode    String?
  academicYear   String?
  
  organizationId String
  organization   Organization @relation(...)
  teacherId      String?
  teacher        Teacher? @relation(...)
  
  students       StudentClass[]  // Enrolled students
  tasks          Task[]
  messages       Message[]
}
```

**StudentClass** - M:M junction
```prisma
model StudentClass {
  id        String @id @default(uuid(7))
  studentId String
  student   Student @relation(...)
  classId   String
  class     Class @relation(...)
  
  @@unique([studentId, classId])
}
```

### Educational Content

#### `education.prisma`
Learning materials, quizzes, and progress tracking

**WordStoryCard** - Interactive story content
```prisma
model WordStoryCard {
  id              String   @id @default(uuid(7))
  title           String
  keywords        String?
  description     String?
  dialogContent   Json?      // Dialogue structure
  status          CardStatus // DRAFT | PUBLISHED
  
  cardContents    CardContent[]  // Positioning elements
  quizzes         Quiz[]
  materials       Material[]
}
```

**Quiz** - Assessment component
```prisma
model Quiz {
  id              String   @id @default(uuid(7))
  cardId          String
  type            QuizType   // MULTIPLE_CHOICE, TRUE_FALSE, etc.
  question        String
  options         Json?
  correctAnswer   Json
  points          Int       @default(1)
  
  studentProgress StudentProgress[]
}
```

**StudentProgress** - Learning progress tracking
```prisma
model StudentProgress {
  id             String   @id @default(uuid(7))
  studentId      String
  student        Student  @relation(...)
  cardId         String?
  quizId         String?
  quiz           Quiz?    @relation(...)
  
  score          Int?
  completed      Boolean  @default(false)
  isRead         Boolean  @default(false)
  isListened     Boolean  @default(false)
  hasQuiz        Boolean  @default(false)
}
```

### Assignment & Task Management

#### `task.prisma`

**Task** - Assignment definition
```prisma
model Task {
  id          String   @id @default(uuid(7))
  title       String
  description String?
  dueDate     DateTime?
  status      TaskStatus  // PENDING | IN_PROGRESS | COMPLETED
  
  classId     String?
  class       Class? @relation(...)
  
  assignedTo  StudentTask[]  // Students assigned
}
```

**StudentTask** - Task assignment tracking
```prisma
model StudentTask {
  id        String   @id @default(uuid(7))
  studentId String
  student   Student  @relation(...)
  taskId    String
  task      Task     @relation(...)
  
  completed Boolean @default(false)
  completedAt DateTime?
  
  @@unique([studentId, taskId])
}
```

### Communication

#### `message.prisma`
Teacher-student messaging with broadcast support

```prisma
model Message {
  id           String   @id @default(uuid(7))
  title        String
  content      String?
  audioUrl     String?  // For voice messages
  
  // Sender
  senderId     String
  sender       User     @relation("Sender", ...)
  
  // Recipients
  receiverId   String?      // Individual student
  receiver     User?        @relation("Receiver", ...)
  
  classId      String?      // Class broadcast
  class        Class?       @relation(...)
  
  receiverType ReceiverType // STUDENT | CLASS
  isRead       Boolean      @default(false)
  readAt       DateTime?
}
```

### Configuration & Dropdowns

#### `lookup.prisma`
Customizable enumeration values for dropdowns

```prisma
model Lookup {
  id             String   @id @default(uuid(7))
  code           String   @unique  // "BLOOD_TYPE", "COUNTRY", etc.
  name           String
  description    String?
  
  organizationId String?           // Org-specific or global
  organization   Organization? @relation(...)
  
  values         LookupValue[]     // Individual options
}

model LookupValue {
  id        String @id @default(uuid(7))
  lookupId  String
  lookup    Lookup @relation(...)
  
  value     String
  label     String
  sortOrder Int    @default(0)
  parentId  String? // For hierarchical values
  
  @@unique([lookupId, value])
}
```

### Financial Management

#### `payment.prisma`
Payment transaction tracking

```prisma
model Payment {
  id                String   @id @default(uuid(7))
  amount            Float
  transactionId     String   @unique
  paymentGateway    String?  // "stripe", "paypal", etc.
  paymentMethod     String?  // "credit_card", "mobile_wallet"
  paymentGatewayData Json?   // Extra provider data
  
  status            PaymentStatus  // PAID | UNPAID
}
```

---

## Relationships at a Glance

```
User (1) ──┬─→ (1) Student
           ├─→ (1) Teacher
           └─→ (1) Admin

Student (M) ──→ (M) Class [StudentClass]
Student (M) ──→ (M) Task  [StudentTask]

Teacher (1) ──→ (M) Class

Class (1) ──→ (1) Organization
Class (M) ──→ (M) Student [StudentClass]
Class (1) ──→ (M) Task
Class (1) ──→ (M) Message

Organization (1) ──→ (M) Class
Organization (1) ──→ (M) Lookup
Organization (1) ──→ (M) Organization [parent-child]

WordStoryCard (1) ──→ (M) CardContent
WordStoryCard (1) ──→ (M) Quiz
WordStoryCard (1) ──→ (M) Material

StudentProgress (M) ──→ (1) Student
StudentProgress (M) ──→ (1) Quiz

Message (M) ──→ (1) User (Sender)
Message (1) ──→ (1) User (Receiver)
Message (1) ──→ (1) Class
```

---

## Key Features

### ✅ Soft Deletes
All main entities have soft-delete support:
```prisma
isDeleted Boolean   @default(false)
deletedAt DateTime?
```

### ✅ Role-Based Access Control
User table includes role field for RBAC:
```prisma
role Role @default(STUDENT)  // SUPER_ADMIN, ADMIN, TEACHER, STUDENT
```

### ✅ Cascading Deletes
- Deleting User cascades to all related Student/Teacher/Admin
- Deleting Class cascades to StudentClass entries
- Deleting lookup cascades to lookup values

### ✅ Soft References
Some relations use `onDelete: SetNull` to preserve data history

### ✅ Indexing Strategy
All foreign keys and frequently-filtered fields are indexed for performance

### ✅ Hierarchical Support
- Organizations support parent-child hierarchy
- LookupValues support hierarchical grouping

---

## Working with Modular Schema

### Running Migrations
```bash
# Generate migration from all .prisma files
npm run db:migrate

# Or manually
npx prisma migrate dev --name migration_name
```

### Generating Prisma Client
```bash
# Auto-generated when schema changes
npx prisma generate
```

### Viewing Data
```bash
# Open Prisma Studio
npx prisma studio
```

### Adding New Models
1. Create a new file: `prisma/schema/feature.prisma`
2. Define your models (no need for datasource/generator)
3. Run migration: `npx prisma migrate dev`

### Tips
- Keep related models in same file (e.g., Organization + Class in organization.prisma)
- Use clear, descriptive file names
- Add header comments explaining the file's purpose
- Maintain consistent naming conventions (PascalCase for models, snake_case for table names)

---

## Environment Configuration

Ensure `.env` has valid database connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/edutrack"
```

---

**Version**: 2.0 (Modular Architecture)
**Last Updated**: 2024
**Prisma Version**: 7.4.1
