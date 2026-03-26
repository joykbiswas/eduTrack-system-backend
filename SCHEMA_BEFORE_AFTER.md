# Schema Structure: Before vs After

## BEFORE: Monolithic Structure ❌

```
prisma/schema/
└── schema.prisma (500+ lines)
    ├── Generator
    ├── Datasource
    ├── ALL Enums (Role, Gender, CardStatus, etc.)
    ├── Auth Models (User, Session, Account)
    ├── Student Model
    ├── Teacher Model
    ├── Admin Model
    ├── Organization Model
    ├── Class Model
    ├── StudentClass Model
    ├── WordStoryCard Model
    ├── CardContent Model
    ├── Quiz Model
    ├── Material Model
    ├── Assessment Model
    ├── Task Model
    ├── StudentTask Model
    ├── Message Model
    ├── Lookup Model
    ├── LookupValue Model
    ├── StudentProgress Model
    ├── and Payment Model
    └── ... all mixed together
```

### Problems:
- ❌ Single 500+ line file hard to navigate
- ❌ All concerns mixed together
- ❌ Merge conflicts when multiple team members edit
- ❌ Difficult to find specific models
- ❌ Hard to understand domain boundaries

---

## AFTER: Modular Structure ✅

```
prisma/schema/
├── _schema.prisma              (15 lines)
│   └── Generator + Datasource only
│
├── enums.prisma                (65 lines)
│   └── All enum types (Role, Gender, CardStatus, etc.)
│
├── auth.prisma                 (85 lines)
│   ├── User (with role-based access)
│   ├── Session (active sessions)
│   ├── Account (OAuth/credentials)

│
├── student.prisma              (30 lines)
│   └── Student (learner profiles)
│
├── teacher.prisma              (45 lines)
│   └── Teacher (educational staff)
│
├── admin.prisma                (30 lines)
│   └── Admin (platform admins)
│
├── organization.prisma         (90 lines)
│   ├── Organization (hierarchy support)
│   ├── Class (student groupings)
│   └── StudentClass (M:M enrollment)
│
├── education.prisma            (150 lines)
│   ├── WordStoryCard (interactive stories)
│   ├── CardContent (positioning)
│   ├── Quiz (assessments)
│   ├── Material (learning resources)
│   ├── Assessment (tests)
│   └── StudentProgress (tracking)
│
├── task.prisma                 (60 lines)
│   ├── Task (assignments)
│   └── StudentTask (M:M assignment tracking)
│
├── message.prisma              (45 lines)
│   └── Message (teacher-student communication)
│
├── lookup.prisma               (60 lines)
│   ├── Lookup (dropdown configs)
│   └── LookupValue (dropdown options)
│
├── payment.prisma              (40 lines)
│   └── Payment (transaction tracking)
│
└── schema.prisma               (documentation index)
    └── README for the schema structure
```

### Benefits:
- ✅ Each file 30-150 lines (easy to scan)
- ✅ Single responsibility per file
- ✅ Domain-driven organization
- ✅ Reduced merge conflicts
- ✅ Clear file names = easy to find models
- ✅ Self-documenting structure

---

## File Organization Logic

### Tier 1: Core Configuration
```
_schema.prisma [REQUIRED]
├── Generator: Prisma Client
└── Datasource: PostgreSQL connection
```

### Tier 2: Shared Definitions
```
enums.prisma
├── Authentication-related: Role, UserStatus
├── Profile-related: Gender
├── Education-related: CardStatus, QuizType, TaskStatus
├── Legacy: BloodGroup, AppointmentStatus (reference)
└── Finance-related: PaymentStatus
```

### Tier 3: User Roles
```
auth.prisma       → Base user with role
student.prisma    → Student (role = STUDENT)
teacher.prisma    → Teacher (role = TEACHER)
admin.prisma      → Admin (role = ADMIN)
```

### Tier 4: Institutional Structure
```
organization.prisma
├── Organization (hierarchical parent-child)
├── Class (groups students + teacher)
└── StudentClass (M:M enrollment tracking)
```

### Tier 5: Educational Content & Tracking
```
education.prisma
├── WordStoryCard (interactive stories)
├── CardContent (visual positioning)
├── Quiz (assessments)
├── Material (learning resources)
├── Assessment (tests)
└── StudentProgress (completion tracking)
```

### Tier 6: Assignment & Communication
```
task.prisma
├── Task (assignments)
└── StudentTask (M:M tracking)

message.prisma
└── Message (teacher-student + class broadcasts)
```

### Tier 7: Configuration & Finance
```
lookup.prisma
├── Lookup (dropdown configs)
└── LookupValue (dropdown options)

payment.prisma
└── Payment (transaction records)
```

---

## Key Architectural Decisions

### ✅ Why Domain-Based Organization?
It mirrors your API structure:
- `/student` API ← `student.prisma`
- `/teacher` API ← `teacher.prisma`
- `/classes` API ← `organization.prisma`
- `/word-story-cards` API ← `education.prisma`
- `/tasks` API ← `task.prisma`
- `/messages` API ← `message.prisma`

### ✅ Why Hierarchical Tiers?
1. Core config must be separate (generators/datasources)
2. Shared enums before models (models reference enums)
3. Base models before dependent models (FK constraints)
4. Related models grouped together (organization + class related)

### ✅ Why Relationship Junctions Grouped?
- `StudentClass` in `organization.prisma` (related to Class)
- `StudentTask` in `task.prisma` (related to Task)
- `StudentProgress` in `education.prisma` (related to Quiz)

---

## Database Generation

### How Prisma Handles It:
```
prisma.config.ts: schema: "prisma/schema"
         ↓
  Prisma discovers directory
         ↓
  Loads all .prisma files
         ↓
  Finds ONE datasource (_schema.prisma)
         ↓
  Merges all models
         ↓
  Generates unified migrations
         ↓
  Creates src/generated/prisma client
```

### No Imports Needed!
```typescript
// All models available in Prisma client
import { prisma } from "@/lib/prisma";

const student = await prisma.student.findUnique({...});
const teacher = await prisma.teacher.create({...});
const task = await prisma.task.update({...});
// etc - all models across all files work
```

---

## Team Collaboration Scenario

### Before (Monolithic):
```
Person A edits schema.prisma (Teacher model)
Person B edits schema.prisma (Student model)
         ↓
      MERGE CONFLICT! ❌
```

### After (Modular):
```
Person A edits teacher.prisma (Teacher model)
Person B edits student.prisma (Student model)
         ↓
   No conflict! ✅ (different files)
```

---

## Migration Workflow

```bash
# Edit any .prisma files
code prisma/schema/education.prisma

# Prisma auto-detects changes
npx prisma migrate dev --name "add_new_field"

# Creates migrations/ directory with timestamp
# Applies to database
# Regenerates src/generated/prisma types
```

---

## File Stats

| Aspect | Before | After |
|--------|--------|-------|
| Total Files | 1 | 12 |
| Largest File | 500+ lines | 150 lines |
| Smallest File | 500+ lines | 15 lines |
| Avg File Size | 500 lines | 65 lines |
| Quick Lookup | Hard ❌ | Easy ✅ |
| Merge Conflicts | Frequent ❌ | Rare ✅ |
| Team Scaling | Difficult ❌ | Scalable ✅ |

---

## Summary

**Before:** One big file with everything
**After:** Organized, focused files by domain

This structure scales beautifully as you add more features - just add new `.prisma` files!

See `SCHEMA_ARCHITECTURE.md` for detailed model documentation.
