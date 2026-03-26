# Schema Quick Reference Card

## 🎯 Quick Navigation

### Looking for a specific model? Find it here:

| Model | File | Purpose |
|-------|------|---------|
| **User, Session, Account** | `auth.prisma` | Authentication (Better-Auth) |
| **Student** | `student.prisma` | Learner profiles |
| **Teacher** | `teacher.prisma` | Educational staff |
| **Admin** | `admin.prisma` | Platform administrators |
| **Organization, Class** | `organization.prisma` | Institutional hierarchy |
| **WordStoryCard, CardContent, Quiz** | `education.prisma` | Learning content |
| **Material, Assessment** | `education.prisma` | Educational resources |
| **StudentProgress** | `education.prisma` | Progress tracking |
| **Task, StudentTask** | `task.prisma` | Task assignments |
| **Message** | `message.prisma` | Communication |
| **Lookup, LookupValue** | `lookup.prisma` | Dropdown configurations |
| **Payment** | `payment.prisma` | Financial transactions |
| **Enums** | `enums.prisma` | All enum types (Role, Gender, etc.) |

---

## 🔧 Common Tasks

### Add a New Model
```bash
# 1. Edit relevant .prisma file (or create new one)
code prisma/schema/[domain].prisma

# 2. Add model definition
model MyModel {
  id String @id @default(uuid(7))
  ...
}

# 3. Create migration
npx prisma migrate dev --name "add_mymodel"
```

### Add a Field to Existing Model
```bash
# 1. Edit the .prisma file
code prisma/schema/[domain].prisma

# 2. Add field
model MyModel {
  ...
  newField String?  // Add here
}

# 3. Migrate
npx prisma migrate dev --name "add_field_to_mymodel"
```

### Create Relationship
```prisma
// One-to-Many Example
model Student {
  ...
  enrolledClasses StudentClass[]  // Define here
}

model Class {
  ...
  students StudentClass[]  // Define here
}

// Many-to-Many Junction
model StudentClass {
  studentId String
  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  classId   String
  class     Class   @relation(fields: [classId], references: [id], onDelete: Cascade)
  @@unique([studentId, classId])
}
```

### View Current Schema
```bash
npx prisma studio  # Opens visual DB browser
```

### Generate Types
```bash
npx prisma generate  # Regenerates src/generated/prisma
```

### Reset Database
```bash
npx prisma migrate reset  # ⚠️ Deletes all data!
```

---

## 📊 Key Relationships

### User-Based (1:1)
```
User ──1:1──> Student
User ──1:1──> Teacher
User ──1:1──> Admin
```

### Class & Enrollment (M:M)
```
Student ──M:M──> Class  [via StudentClass]
Teacher ──1:M──> Class
```

### Task Assignment (M:M)
```
Student ──M:M──> Task  [via StudentTask]
Class ──1:M──> Task
```

### Learning Content
```
Class ──1:M──> Message
WordStoryCard ──1:M──> Quiz
WordStoryCard ──1:M──> CardContent
Quiz ──1:M──> StudentProgress
```

### Organization Hierarchy
```
Organization ──1:M──> Organization [parent-child]
Organization ──1:M──> Class
```

---

## 🎨 Naming Conventions

### Models
- PascalCase: `Student`, `WordStoryCard`, `StudentClass`

### Tables
- snake_case: `students`, `word_story_cards`, `student_classes`

### Enums
- PascalCase: `Role`, `UserStatus`, `CardStatus`

### Fields
- camelCase: `firstName`, `registrationNumber`, `isDeleted`

### Indexes
- Format: `idx_[model]_[field]`
- Example: `idx_student_email`, `idx_class_organizationId`

---

## 🔒 Soft Delete Pattern

All main models include:
```prisma
model MyModel {
  ...
  isDeleted Boolean @default(false)
  deletedAt DateTime?
}
```

Query non-deleted only:
```typescript
const active = await prisma.myModel.findMany({
  where: { isDeleted: false }
});
```

---

## 🔑 Role-Based Access

User model defines role:
```prisma
model User {
  ...
  role Role @default(STUDENT)  // SUPER_ADMIN | ADMIN | TEACHER | STUDENT
}
```

Check role in code:
```typescript
if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
  // Allow admin action
}
```

---

## 📱 API ↔ Schema Mapping

| API Route | Schema File | Model |
|-----------|------------|-------|
| `POST /student` | `student.prisma` | Student |
| `POST /teacher` | `teacher.prisma` | Teacher |
| `GET /classes` | `organization.prisma` | Class |
| `POST /tasks` | `task.prisma` | Task |
| `POST /messages` | `message.prisma` | Message |
| `POST /organizations` | `organization.prisma` | Organization |
| `POST /word-story-cards` | `education.prisma` | WordStoryCard |
| `POST /lookups` | `lookup.prisma` | Lookup |

---

## ⚡ Performance Tips

### Always Index:
- Foreign keys (already done)
- Frequently filtered fields (already done)
- Sort fields

### Use Includes Wisely:
```typescript
// Gets all related Student + enrolledClasses data
const student = await prisma.student.findUnique({
  where: { id: studentId },
  include: { enrolledClasses: true }
});
```

### Pagination:
```typescript
const students = await prisma.student.findMany({
  skip: (page - 1) * limit,
  take: limit,
  where: { isDeleted: false }
});
```

---

## 📝 Column Constraints

### Unique Fields
- `email` - All users/students/teachers have unique emails
- `registrationNumber` - Teachers have unique reg numbers
- `code` - Lookup codes are unique

### Required Fields
- `id` - Always required (primary key)
- `name` - User identifiable fields required
- `email` - Required for all users
- `role` - Has default (STUDENT)
- `status` - Has default (ACTIVE)

### Optional Fields
- `profilePhoto`, `contactNumber`, `address` - Nullable
- `parentId` - For hierarchical relations

---

## 🚨 Common Errors & Solutions

### "Multiple datasources found"
❌ Problem: More than one datasource block in .prisma files
✅ Solution: Keep datasource only in `_schema.prisma`

### "Model not found"
❌ Problem: Model in wrong .prisma file
✅ Solution: Check file location in quick reference above

### "Cannot find identifier"
❌ Problem: Forgot to define enum or model
✅ Solution: Check `enums.prisma` or search other files

### "Unique constraint violation"
❌ Problem: Tried to insert duplicate email/code
✅ Solution: Use `findUnique` before `create`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SCHEMA_ARCHITECTURE.md` | **START HERE** - Complete schema guide |
| `SCHEMA_REORGANIZATION.md` | Summary of changes made |
| `SCHEMA_BEFORE_AFTER.md` | Visual comparison of old vs new |
| `schema.prisma` | Index/reference in schema directory |

---

## ✅ Verification Checklist

```
□ ALL .prisma files are in prisma/schema/ directory
□ _schema.prisma contains datasource + generator
□ Each model appears in ONLY ONE .prisma file
□ All relations have proper @relation directives
□ All indexes have descriptive name: "idx_table_field"
□ DATABASE_URL in .env is valid
□ Ran: npx prisma validate (no errors)
□ Ran: npx prisma generate (types generated)
□ Ran: npx prisma migrate dev (migrations applied)
```

---

**This schema is production-ready!** 🚀

For detailed information, see `SCHEMA_ARCHITECTURE.md`
