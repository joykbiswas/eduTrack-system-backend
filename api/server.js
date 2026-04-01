// src/app.ts
import cookieParser from "cookie-parser";
import express from "express";

// src/app/middleware/globalErrorHandler.ts
import status3 from "http-status";
import z from "zod";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/config/env.ts
import dotenv from "dotenv";
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required but not set in .env file.`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/errorHelpers/handleZodError.ts
import status2 from "http-status";
var handleZodError = (err) => {
  const statusCode = status2.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  let errorSources = [];
  let statusCode = status3.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status3.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status4 from "http-status";
var notFound = (req, res) => {
  res.status(status4.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/routes/index.ts
import { Router as Router15 } from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/module/auth/auth.controller.ts
import status6 from "http-status";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
import status5 from "http-status";

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
};
var QuizType = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  TRUE_FALSE: "TRUE_FALSE",
  FILL_BLANK: "FILL_BLANK",
  MATCHING: "MATCHING"
};

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.1",
  "engineVersion": "55ae170b1ced7fc6ed07a15f110549408c501bb3",
  "activeProvider": "postgresql",
  "inlineSchema": '// ============================================================\n// ADMIN MODEL - Platform Administration\n// ============================================================\n\nmodel Admin {\n  id String @id @default(uuid(7))\n\n  // Basic Info\n  name          String\n  email         String  @unique\n  role          Role    @default(ADMIN)\n  profilePhoto  String?\n  contactNumber String?\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  // Foreign Keys & Relations\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([email], name: "idx_admin_email")\n  @@index([isDeleted], name: "idx_admin_isDeleted")\n  @@map("admins")\n}\n\n// ============================================================\n// BETTER-AUTH CORE MODELS\n// Authentication & User Management with role-based access control\n// ============================================================\n\nmodel User {\n  id                 String     @id\n  name               String\n  email              String     @unique\n  emailVerified      Boolean    @default(false)\n  role               Role       @default(STUDENT)\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n\n  // Better-Auth Relations\n  sessions Session[]\n  accounts Account[]\n\n  // Role-Based Relations (1:1 with each role)\n  student Student?\n  teacher Teacher?\n  admin   Admin?\n\n  // Communication Relations\n  sentMessages     Message[] @relation("Sender")\n  receivedMessages Message[] @relation("Receiver")\n\n  @@index([role], name: "idx_user_role")\n  @@index([status], name: "idx_user_status")\n  @@index([isDeleted], name: "idx_user_isDeleted")\n  @@map("users")\n}\n\n// ============ SESSION MANAGEMENT ============\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token], name: "idx_session_token_unique")\n  @@index([userId], name: "idx_session_userId")\n  @@index([expiresAt], name: "idx_session_expiresAt")\n  @@map("sessions")\n}\n\n// ============ OAUTH & CREDENTIALS ============\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String? // For email/password auth\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@unique([providerId, accountId], name: "idx_account_provider_unique")\n  @@index([userId], name: "idx_account_userId")\n  @@index([providerId], name: "idx_account_providerId")\n  @@map("accounts")\n}\n\n// ============================================================\n// EDUCATION CONTENT MODELS - Learning Materials & Progress\n// ============================================================\n\n// ============ WORD STORY CARD ============\nmodel WordStoryCard {\n  id               String     @id @default(uuid(7))\n  title            String\n  image            String?\n  keywords         String?\n  description      String?\n  descriptionSound String?\n  dialogTitle      String?\n  dialogContent    Json?\n  status           CardStatus @default(PUBLISHED)\n\n  // Related Content\n  quizzes      Quiz[]        @relation("WordStoryCardQuizzes")\n  materials    Material[]    @relation("WordStoryCardMaterials")\n  assessments  Assessment[]  @relation("WordStoryCardAssessments")\n  cardContents CardContent[] @relation("WordStoryCardContent")\n  tasks        Task[]        @relation("TaskToWordStoryCard")\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([status], name: "idx_wordstorycard_status")\n  @@index([isDeleted], name: "idx_wordstorycard_isDeleted")\n  @@map("word_story_cards")\n}\n\n// ============ CARD CONTENT (Positioning) ============\nmodel CardContent {\n  id String @id @default(uuid(7))\n\n  cardId String\n  card   WordStoryCard @relation(fields: [cardId], references: [id], onDelete: Cascade, "WordStoryCardContent")\n\n  imageUrl  String?\n  soundUrl  String?\n  xPosition Int     @default(0)\n  yPosition Int     @default(0)\n  width     Int     @default(100)\n  height    Int     @default(100)\n  seq       Int     @default(0)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([cardId], name: "idx_cardcontent_cardId")\n  @@map("card_contents")\n}\n\n// ============ QUIZ ============\nmodel Quiz {\n  id String @id @default(uuid(7))\n\n  cardId String\n  card   WordStoryCard @relation(fields: [cardId], references: [id], onDelete: Cascade, "WordStoryCardQuizzes")\n\n  type          QuizType\n  question      String\n  options       Json?\n  correctAnswer Json\n  points        Int      @default(1)\n\n  // Student Progress Tracking\n  studentProgress StudentProgress[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([cardId], name: "idx_quiz_cardId")\n  @@map("quizzes")\n}\n\n// ============ MATERIAL / LEARNING CONTENT ============\nmodel Material {\n  id      String  @id @default(uuid(7))\n  title   String\n  content String\n  type    String?\n\n  cardId String?\n  card   WordStoryCard? @relation(fields: [cardId], references: [id], onDelete: SetNull, "WordStoryCardMaterials")\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([cardId], name: "idx_material_cardId")\n  @@index([isDeleted], name: "idx_material_isDeleted")\n  @@map("materials")\n}\n\n// ============ ASSESSMENT / TEST ============\nmodel Assessment {\n  id          String  @id @default(uuid(7))\n  title       String\n  description String?\n\n  cardId       String?\n  card         WordStoryCard? @relation(fields: [cardId], references: [id], onDelete: SetNull, "WordStoryCardAssessments")\n  questions    Json // e.g. [{question: string, answer: boolean}] for true/false\n  passingScore Int            @default(60)\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([cardId], name: "idx_assessment_cardId")\n  @@index([isDeleted], name: "idx_assessment_isDeleted")\n  @@map("assessments")\n}\n\n// ============ STUDENT PROGRESS TRACKING ============\nmodel StudentProgress {\n  id String @id @default(uuid(7))\n\n  studentId String\n  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  cardId String?\n\n  quizId String?\n  quiz   Quiz?   @relation(fields: [quizId], references: [id], onDelete: SetNull)\n\n  // Progress Status\n  score         Int?\n  completed     Boolean @default(false)\n  isRead        Boolean @default(false)\n  isListened    Boolean @default(false)\n  hasQuiz       Boolean @default(false)\n  hasAssignment Boolean @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([studentId], name: "idx_studentprogress_studentId")\n  @@index([cardId], name: "idx_studentprogress_cardId")\n  @@index([quizId], name: "idx_studentprogress_quizId")\n  @@map("student_progress")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  TEACHER\n  STUDENT\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum AppointmentStatus {\n  SCHEDULED\n  INPROGRESS\n  COMPLETED\n  CANCELED\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n}\n\nenum CardStatus {\n  DRAFT\n  PUBLISHED\n}\n\nenum QuizType {\n  MULTIPLE_CHOICE\n  TRUE_FALSE\n  FILL_BLANK\n  MATCHING\n}\n\nenum TaskStatus {\n  PENDING\n  IN_PROGRESS\n  COMPLETED\n}\n\nenum ReceiverType {\n  STUDENT\n  CLASS\n}\n\n// ============================================================\n// LOOKUP MODELS - Configurable Dropdowns & Enumerations\n// ============================================================\n\n// ============ LOOKUP (Configuration) ============\nmodel Lookup {\n  id          String  @id @default(uuid(7))\n  code        String  @unique\n  name        String\n  description String?\n\n  // Organization-specific lookups (null = global)\n  organizationId String?\n  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)\n\n  // Lookup Values\n  values LookupValue[]\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([code], name: "idx_lookup_code")\n  @@index([organizationId], name: "idx_lookup_organizationId")\n  @@index([isDeleted], name: "idx_lookup_isDeleted")\n  @@map("lookups")\n}\n\n// ============ LOOKUP VALUE (Individual Options) ============\nmodel LookupValue {\n  id String @id @default(uuid(7))\n\n  lookupId String\n  lookup   Lookup @relation(fields: [lookupId], references: [id], onDelete: Cascade)\n\n  // Value Definition\n  value     String\n  label     String\n  sortOrder Int    @default(0)\n\n  // Hierarchical Support\n  parentId String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([lookupId, value], name: "idx_lookupvalue_unique")\n  @@index([lookupId], name: "idx_lookupvalue_lookupId")\n  @@index([sortOrder], name: "idx_lookupvalue_sortOrder")\n  @@map("lookup_values")\n}\n\n// ============================================================\n// MESSAGE MODEL - Communication & Notifications\n// ============================================================\n\nmodel Message {\n  id String @id @default(uuid(7))\n\n  // Message Content\n  title    String\n  content  String?\n  audioUrl String?\n\n  // Sender\n  senderId String\n  sender   User   @relation("Sender", fields: [senderId], references: [id], onDelete: Cascade)\n\n  // Recipients (can be individual student or entire class)\n  receiverId String?\n  receiver   User?   @relation("Receiver", fields: [receiverId], references: [id], onDelete: SetNull)\n\n  classId String?\n  class   Class?  @relation(fields: [classId], references: [id], onDelete: SetNull)\n\n  receiverType ReceiverType @default(STUDENT)\n\n  // Status\n  isRead Boolean   @default(false)\n  readAt DateTime?\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([senderId], name: "idx_message_senderId")\n  @@index([receiverId], name: "idx_message_receiverId")\n  @@index([classId], name: "idx_message_classId")\n  @@index([receiverType], name: "idx_message_receiverType")\n  @@index([isRead], name: "idx_message_isRead")\n  @@index([isDeleted], name: "idx_message_isDeleted")\n  @@map("messages")\n}\n\n// ============================================================\n// ORGANIZATION & CLASS MODELS - Institutional Structure\n// ============================================================\n\n// ============ ORGANIZATION HIERARCHY ============\nmodel Organization {\n  id          String  @id @default(uuid(7))\n  name        String\n  description String?\n\n  // Hierarchical Structure (parent-child relationships)\n  parentId String?\n  parent   Organization?  @relation("OrgHierarchy", fields: [parentId], references: [id], onDelete: SetNull)\n  children Organization[] @relation("OrgHierarchy")\n\n  // Relations to other entities\n  classes Class[]\n  lookups Lookup[]\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([parentId], name: "idx_organization_parentId")\n  @@index([isDeleted], name: "idx_organization_isDeleted")\n  @@map("organizations")\n}\n\n// ============ CLASS / SECTION ============\nmodel Class {\n  id           String  @id @default(uuid(7))\n  name         String\n  description  String?\n  classNumber  Int?\n  sectionCode  String?\n  academicYear String?\n\n  // Organization & Teacher\n  organizationId String\n  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n\n  teacherId String?\n  teacher   Teacher? @relation(fields: [teacherId], references: [id], onDelete: SetNull)\n\n  // Relations to students, tasks, and messages\n  students StudentClass[]\n  tasks    Task[]\n  messages Message[]\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@unique([organizationId, name, academicYear], name: "idx_class_unique")\n  @@index([organizationId], name: "idx_class_organizationId")\n  @@index([teacherId], name: "idx_class_teacherId")\n  @@index([isDeleted], name: "idx_class_isDeleted")\n  @@map("classes")\n}\n\n// ============ STUDENT-CLASS JUNCTION (Many-to-Many) ============\nmodel StudentClass {\n  id String @id @default(uuid(7))\n\n  studentId String\n  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  classId String\n  class   Class  @relation(fields: [classId], references: [id], onDelete: Cascade)\n\n  // Enrollment tracking\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, classId], name: "idx_studentclass_unique")\n  @@index([studentId], name: "idx_studentclass_studentId")\n  @@index([classId], name: "idx_studentclass_classId")\n  @@map("student_classes")\n}\n\n// ============================================================\n// PAYMENT MODEL - Transaction Management\n// ============================================================\n\nmodel Payment {\n  id String @id @default(uuid(7))\n\n  // Payment Amount\n  amount Float\n\n  // Transaction Details\n  transactionId      String  @unique\n  paymentGateway     String? // e.g., "stripe", "paypal", "bkash"\n  paymentMethod      String? // e.g., "credit_card", "mobile_wallet"\n  paymentGatewayData Json? // Store additional gateway-specific data\n\n  // Status\n  status PaymentStatus @default(UNPAID)\n\n  // Status & Timestamps\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Optional reference to appointment (if needed for medical features)\n  // appointmentId String @unique\n  // appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)\n\n  @@index([transactionId], name: "idx_payment_transactionId")\n  @@index([status], name: "idx_payment_status")\n  @@map("payments")\n}\n\n// ============================================================\n// PRISMA SCHEMA CONFIGURATION & DATA SOURCE\n// ============================================================\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ============================================================\n// STUDENT MODEL - Learner Profile & Enrollment Management\n// ============================================================\n\nmodel Student {\n  id String @id @default(uuid(7))\n\n  // Basic Info\n  name          String\n  email         String  @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  // Foreign Keys & Relations\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  // Educational Relations\n  enrolledClasses StudentClass[]\n  assignedTasks   StudentTask[]\n  progress        StudentProgress[]\n\n  @@index([email], name: "idx_student_email")\n  @@index([isDeleted], name: "idx_student_isDeleted")\n  @@map("students")\n}\n\n// ============================================================\n// TASK MODELS - Assignment Management & Tracking\n// ============================================================\n\n// ============ TASK ============\nmodel Task {\n  id          String         @id @default(uuid(7))\n  title       String\n  description String?\n  cardId      String?\n  card        WordStoryCard? @relation(fields: [cardId], references: [id], onDelete: SetNull, "TaskToWordStoryCard")\n\n  // Assignment Details\n  dueDate DateTime?\n  status  TaskStatus @default(PENDING)\n\n  // Class & Creator\n  classId String?\n  class   Class?  @relation(fields: [classId], references: [id], onDelete: SetNull)\n\n  createdBy String?\n\n  // Student Assignments\n  assignedTo StudentTask[]\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([classId], name: "idx_task_classId")\n  @@index([status], name: "idx_task_status")\n  @@index([dueDate], name: "idx_task_dueDate")\n  @@index([isDeleted], name: "idx_task_isDeleted")\n  @@map("tasks")\n}\n\n// ============ STUDENT-TASK JUNCTION (Many-to-Many Assignment) ============\nmodel StudentTask {\n  id String @id @default(uuid(7))\n\n  studentId String\n  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  taskId String\n  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)\n\n  // Task Status\n  completed   Boolean   @default(false)\n  completedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, taskId], name: "idx_studenttask_unique")\n  @@index([studentId], name: "idx_studenttask_studentId")\n  @@index([taskId], name: "idx_studenttask_taskId")\n  @@index([completed], name: "idx_studenttask_completed")\n  @@map("student_tasks")\n}\n\n// ============================================================\n// TEACHER MODEL - Educational Staff Management\n// ============================================================\n\nmodel Teacher {\n  id String @id @default(uuid(7))\n\n  // Basic Info\n  name          String\n  email         String  @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n\n  // Professional Info\n  registrationNumber  String  @unique\n  experience          Int     @default(0)\n  gender              Gender\n  qualification       String\n  currentWorkingPlace String?\n  designation         String\n  subject             String\n  averageRating       Float   @default(0.0)\n\n  // Status & Timestamps\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  // Foreign Keys & Relations\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  assignedClasses Class[]\n\n  @@index([email], name: "idx_teacher_email")\n  @@index([registrationNumber], name: "idx_teacher_registrationNumber")\n  @@index([isDeleted], name: "idx_teacher_isDeleted")\n  @@map("teachers")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"student","kind":"object","type":"Student","relationName":"StudentToUser"},{"name":"teacher","kind":"object","type":"Teacher","relationName":"TeacherToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"sentMessages","kind":"object","type":"Message","relationName":"Sender"},{"name":"receivedMessages","kind":"object","type":"Message","relationName":"Receiver"}],"dbName":"users"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"sessions"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"accounts"},"WordStoryCard":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"keywords","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"descriptionSound","kind":"scalar","type":"String"},{"name":"dialogTitle","kind":"scalar","type":"String"},{"name":"dialogContent","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"CardStatus"},{"name":"quizzes","kind":"object","type":"Quiz","relationName":"WordStoryCardQuizzes"},{"name":"materials","kind":"object","type":"Material","relationName":"WordStoryCardMaterials"},{"name":"assessments","kind":"object","type":"Assessment","relationName":"WordStoryCardAssessments"},{"name":"cardContents","kind":"object","type":"CardContent","relationName":"WordStoryCardContent"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToWordStoryCard"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"word_story_cards"},"CardContent":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cardId","kind":"scalar","type":"String"},{"name":"card","kind":"object","type":"WordStoryCard","relationName":"WordStoryCardContent"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"soundUrl","kind":"scalar","type":"String"},{"name":"xPosition","kind":"scalar","type":"Int"},{"name":"yPosition","kind":"scalar","type":"Int"},{"name":"width","kind":"scalar","type":"Int"},{"name":"height","kind":"scalar","type":"Int"},{"name":"seq","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"card_contents"},"Quiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cardId","kind":"scalar","type":"String"},{"name":"card","kind":"object","type":"WordStoryCard","relationName":"WordStoryCardQuizzes"},{"name":"type","kind":"enum","type":"QuizType"},{"name":"question","kind":"scalar","type":"String"},{"name":"options","kind":"scalar","type":"Json"},{"name":"correctAnswer","kind":"scalar","type":"Json"},{"name":"points","kind":"scalar","type":"Int"},{"name":"studentProgress","kind":"object","type":"StudentProgress","relationName":"QuizToStudentProgress"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"quizzes"},"Material":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"cardId","kind":"scalar","type":"String"},{"name":"card","kind":"object","type":"WordStoryCard","relationName":"WordStoryCardMaterials"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"materials"},"Assessment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"cardId","kind":"scalar","type":"String"},{"name":"card","kind":"object","type":"WordStoryCard","relationName":"WordStoryCardAssessments"},{"name":"questions","kind":"scalar","type":"Json"},{"name":"passingScore","kind":"scalar","type":"Int"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"assessments"},"StudentProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"StudentToStudentProgress"},{"name":"cardId","kind":"scalar","type":"String"},{"name":"quizId","kind":"scalar","type":"String"},{"name":"quiz","kind":"object","type":"Quiz","relationName":"QuizToStudentProgress"},{"name":"score","kind":"scalar","type":"Int"},{"name":"completed","kind":"scalar","type":"Boolean"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"isListened","kind":"scalar","type":"Boolean"},{"name":"hasQuiz","kind":"scalar","type":"Boolean"},{"name":"hasAssignment","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_progress"},"Lookup":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"organization","kind":"object","type":"Organization","relationName":"LookupToOrganization"},{"name":"values","kind":"object","type":"LookupValue","relationName":"LookupToLookupValue"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"lookups"},"LookupValue":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"lookupId","kind":"scalar","type":"String"},{"name":"lookup","kind":"object","type":"Lookup","relationName":"LookupToLookupValue"},{"name":"value","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"lookup_values"},"Message":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"audioUrl","kind":"scalar","type":"String"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"sender","kind":"object","type":"User","relationName":"Sender"},{"name":"receiverId","kind":"scalar","type":"String"},{"name":"receiver","kind":"object","type":"User","relationName":"Receiver"},{"name":"classId","kind":"scalar","type":"String"},{"name":"class","kind":"object","type":"Class","relationName":"ClassToMessage"},{"name":"receiverType","kind":"enum","type":"ReceiverType"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"messages"},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Organization","relationName":"OrgHierarchy"},{"name":"children","kind":"object","type":"Organization","relationName":"OrgHierarchy"},{"name":"classes","kind":"object","type":"Class","relationName":"ClassToOrganization"},{"name":"lookups","kind":"object","type":"Lookup","relationName":"LookupToOrganization"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"organizations"},"Class":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"classNumber","kind":"scalar","type":"Int"},{"name":"sectionCode","kind":"scalar","type":"String"},{"name":"academicYear","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String"},{"name":"organization","kind":"object","type":"Organization","relationName":"ClassToOrganization"},{"name":"teacherId","kind":"scalar","type":"String"},{"name":"teacher","kind":"object","type":"Teacher","relationName":"ClassToTeacher"},{"name":"students","kind":"object","type":"StudentClass","relationName":"ClassToStudentClass"},{"name":"tasks","kind":"object","type":"Task","relationName":"ClassToTask"},{"name":"messages","kind":"object","type":"Message","relationName":"ClassToMessage"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"classes"},"StudentClass":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"StudentToStudentClass"},{"name":"classId","kind":"scalar","type":"String"},{"name":"class","kind":"object","type":"Class","relationName":"ClassToStudentClass"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_classes"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentGateway","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Student":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentToUser"},{"name":"enrolledClasses","kind":"object","type":"StudentClass","relationName":"StudentToStudentClass"},{"name":"assignedTasks","kind":"object","type":"StudentTask","relationName":"StudentToStudentTask"},{"name":"progress","kind":"object","type":"StudentProgress","relationName":"StudentToStudentProgress"}],"dbName":"students"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"cardId","kind":"scalar","type":"String"},{"name":"card","kind":"object","type":"WordStoryCard","relationName":"TaskToWordStoryCard"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"classId","kind":"scalar","type":"String"},{"name":"class","kind":"object","type":"Class","relationName":"ClassToTask"},{"name":"createdBy","kind":"scalar","type":"String"},{"name":"assignedTo","kind":"object","type":"StudentTask","relationName":"StudentTaskToTask"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tasks"},"StudentTask":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"StudentToStudentTask"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"StudentTaskToTask"},{"name":"completed","kind":"scalar","type":"Boolean"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"student_tasks"},"Teacher":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"registrationNumber","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"gender","kind":"enum","type":"Gender"},{"name":"qualification","kind":"scalar","type":"String"},{"name":"currentWorkingPlace","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TeacherToUser"},{"name":"assignedClasses","kind":"object","type":"Class","relationName":"ClassToTeacher"}],"dbName":"teachers"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","student","parent","children","classes","organization","lookup","values","_count","lookups","assignedClasses","teacher","students","card","quiz","studentProgress","quizzes","materials","assessments","cardContents","tasks","class","task","assignedTo","sender","receiver","messages","enrolledClasses","assignedTasks","progress","admin","sentMessages","receivedMessages","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","data","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","create","update","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","having","_min","_max","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","WordStoryCard.findUnique","WordStoryCard.findUniqueOrThrow","WordStoryCard.findFirst","WordStoryCard.findFirstOrThrow","WordStoryCard.findMany","WordStoryCard.createOne","WordStoryCard.createMany","WordStoryCard.createManyAndReturn","WordStoryCard.updateOne","WordStoryCard.updateMany","WordStoryCard.updateManyAndReturn","WordStoryCard.upsertOne","WordStoryCard.deleteOne","WordStoryCard.deleteMany","WordStoryCard.groupBy","WordStoryCard.aggregate","CardContent.findUnique","CardContent.findUniqueOrThrow","CardContent.findFirst","CardContent.findFirstOrThrow","CardContent.findMany","CardContent.createOne","CardContent.createMany","CardContent.createManyAndReturn","CardContent.updateOne","CardContent.updateMany","CardContent.updateManyAndReturn","CardContent.upsertOne","CardContent.deleteOne","CardContent.deleteMany","_avg","_sum","CardContent.groupBy","CardContent.aggregate","Quiz.findUnique","Quiz.findUniqueOrThrow","Quiz.findFirst","Quiz.findFirstOrThrow","Quiz.findMany","Quiz.createOne","Quiz.createMany","Quiz.createManyAndReturn","Quiz.updateOne","Quiz.updateMany","Quiz.updateManyAndReturn","Quiz.upsertOne","Quiz.deleteOne","Quiz.deleteMany","Quiz.groupBy","Quiz.aggregate","Material.findUnique","Material.findUniqueOrThrow","Material.findFirst","Material.findFirstOrThrow","Material.findMany","Material.createOne","Material.createMany","Material.createManyAndReturn","Material.updateOne","Material.updateMany","Material.updateManyAndReturn","Material.upsertOne","Material.deleteOne","Material.deleteMany","Material.groupBy","Material.aggregate","Assessment.findUnique","Assessment.findUniqueOrThrow","Assessment.findFirst","Assessment.findFirstOrThrow","Assessment.findMany","Assessment.createOne","Assessment.createMany","Assessment.createManyAndReturn","Assessment.updateOne","Assessment.updateMany","Assessment.updateManyAndReturn","Assessment.upsertOne","Assessment.deleteOne","Assessment.deleteMany","Assessment.groupBy","Assessment.aggregate","StudentProgress.findUnique","StudentProgress.findUniqueOrThrow","StudentProgress.findFirst","StudentProgress.findFirstOrThrow","StudentProgress.findMany","StudentProgress.createOne","StudentProgress.createMany","StudentProgress.createManyAndReturn","StudentProgress.updateOne","StudentProgress.updateMany","StudentProgress.updateManyAndReturn","StudentProgress.upsertOne","StudentProgress.deleteOne","StudentProgress.deleteMany","StudentProgress.groupBy","StudentProgress.aggregate","Lookup.findUnique","Lookup.findUniqueOrThrow","Lookup.findFirst","Lookup.findFirstOrThrow","Lookup.findMany","Lookup.createOne","Lookup.createMany","Lookup.createManyAndReturn","Lookup.updateOne","Lookup.updateMany","Lookup.updateManyAndReturn","Lookup.upsertOne","Lookup.deleteOne","Lookup.deleteMany","Lookup.groupBy","Lookup.aggregate","LookupValue.findUnique","LookupValue.findUniqueOrThrow","LookupValue.findFirst","LookupValue.findFirstOrThrow","LookupValue.findMany","LookupValue.createOne","LookupValue.createMany","LookupValue.createManyAndReturn","LookupValue.updateOne","LookupValue.updateMany","LookupValue.updateManyAndReturn","LookupValue.upsertOne","LookupValue.deleteOne","LookupValue.deleteMany","LookupValue.groupBy","LookupValue.aggregate","Message.findUnique","Message.findUniqueOrThrow","Message.findFirst","Message.findFirstOrThrow","Message.findMany","Message.createOne","Message.createMany","Message.createManyAndReturn","Message.updateOne","Message.updateMany","Message.updateManyAndReturn","Message.upsertOne","Message.deleteOne","Message.deleteMany","Message.groupBy","Message.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Class.findUnique","Class.findUniqueOrThrow","Class.findFirst","Class.findFirstOrThrow","Class.findMany","Class.createOne","Class.createMany","Class.createManyAndReturn","Class.updateOne","Class.updateMany","Class.updateManyAndReturn","Class.upsertOne","Class.deleteOne","Class.deleteMany","Class.groupBy","Class.aggregate","StudentClass.findUnique","StudentClass.findUniqueOrThrow","StudentClass.findFirst","StudentClass.findFirstOrThrow","StudentClass.findMany","StudentClass.createOne","StudentClass.createMany","StudentClass.createManyAndReturn","StudentClass.updateOne","StudentClass.updateMany","StudentClass.updateManyAndReturn","StudentClass.upsertOne","StudentClass.deleteOne","StudentClass.deleteMany","StudentClass.groupBy","StudentClass.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Student.findUnique","Student.findUniqueOrThrow","Student.findFirst","Student.findFirstOrThrow","Student.findMany","Student.createOne","Student.createMany","Student.createManyAndReturn","Student.updateOne","Student.updateMany","Student.updateManyAndReturn","Student.upsertOne","Student.deleteOne","Student.deleteMany","Student.groupBy","Student.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","StudentTask.findUnique","StudentTask.findUniqueOrThrow","StudentTask.findFirst","StudentTask.findFirstOrThrow","StudentTask.findMany","StudentTask.createOne","StudentTask.createMany","StudentTask.createManyAndReturn","StudentTask.updateOne","StudentTask.updateMany","StudentTask.updateManyAndReturn","StudentTask.upsertOne","StudentTask.deleteOne","StudentTask.deleteMany","StudentTask.groupBy","StudentTask.aggregate","Teacher.findUnique","Teacher.findUniqueOrThrow","Teacher.findFirst","Teacher.findFirstOrThrow","Teacher.findMany","Teacher.createOne","Teacher.createMany","Teacher.createManyAndReturn","Teacher.updateOne","Teacher.updateMany","Teacher.updateManyAndReturn","Teacher.upsertOne","Teacher.deleteOne","Teacher.deleteMany","Teacher.groupBy","Teacher.aggregate","AND","OR","NOT","id","name","email","profilePhoto","contactNumber","address","registrationNumber","experience","Gender","gender","qualification","currentWorkingPlace","designation","subject","averageRating","isDeleted","deletedAt","createdAt","updatedAt","userId","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","studentId","taskId","completed","completedAt","title","description","cardId","dueDate","TaskStatus","status","classId","createdBy","amount","transactionId","paymentGateway","paymentMethod","paymentGatewayData","PaymentStatus","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","classNumber","sectionCode","academicYear","organizationId","teacherId","parentId","content","audioUrl","senderId","receiverId","ReceiverType","receiverType","isRead","readAt","lookupId","value","label","sortOrder","code","quizId","score","isListened","hasQuiz","hasAssignment","questions","passingScore","type","QuizType","question","options","correctAnswer","points","imageUrl","soundUrl","xPosition","yPosition","width","height","seq","image","keywords","descriptionSound","dialogTitle","dialogContent","CardStatus","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","expiresAt","token","ipAddress","userAgent","emailVerified","Role","role","UserStatus","needPasswordChange","idx_studenttask_unique","idx_lookupvalue_unique","idx_class_unique","idx_studentclass_unique","idx_account_provider_unique","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "4ArCAdACDwMAAP4EACD-AgAAxwUAMP8CAABmABCAAwAAxwUAMIEDAQAAAAGCAwEA9gQAIYMDAQAAAAGEAwEA9wQAIYUDAQD3BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGUAwEAAAAB9wMAAL4F9wMiAQAAAAEAIAwDAAD-BAAg_gIAAO4FADD_AgAAAwAQgAMAAO4FADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGUAwEA9gQAIfEDQAD9BAAh8gMBAPYEACHzAwEA9wQAIfQDAQD3BAAhAwMAANQGACDzAwAA7wUAIPQDAADvBQAgDAMAAP4EACD-AgAA7gUAMP8CAAADABCAAwAA7gUAMIEDAQAAAAGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACHxA0AA_QQAIfIDAQAAAAHzAwEA9wQAIfQDAQD3BAAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAAD-BAAg_gIAAO0FADD_AgAABwAQgAMAAO0FADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGUAwEA9gQAIegDAQD2BAAh6QMBAPYEACHqAwEA9wQAIesDAQD3BAAh7AMBAPcEACHtA0AA_AQAIe4DQAD8BAAh7wMBAPcEACHwAwEA9wQAIQgDAADUBgAg6gMAAO8FACDrAwAA7wUAIOwDAADvBQAg7QMAAO8FACDuAwAA7wUAIO8DAADvBQAg8AMAAO8FACASAwAA_gQAIP4CAADtBQAw_wIAAAcAEIADAADtBQAwgQMBAAAAAZIDQAD9BAAhkwNAAP0EACGUAwEA9gQAIegDAQD2BAAh6QMBAPYEACHqAwEA9wQAIesDAQD3BAAh7AMBAPcEACHtA0AA_AQAIe4DQAD8BAAh7wMBAPcEACHwAwEA9wQAIf4DAADsBQAgAwAAAAcAIAEAAAgAMAIAAAkAIBIDAAD-BAAgIAAAhwUAICEAAIgFACAiAACJBQAg_gIAAIYFADD_AgAACwAQgAMAAIYFADCBAwEA9gQAIYIDAQD2BAAhgwMBAPYEACGEAwEA9wQAIYUDAQD3BAAhhgMBAPcEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIZQDAQD2BAAhAQAAAAsAIAoGAADOBQAgGgAA6wUAIP4CAADqBQAw_wIAAA0AEIADAADqBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhowMBAPYEACGtAwEA9gQAIQIGAAC8CQAgGgAAxQkAIAsGAADOBQAgGgAA6wUAIP4CAADqBQAw_wIAAA0AEIADAADqBQAwgQMBAAAAAZIDQAD9BAAhkwNAAP0EACGjAwEA9gQAIa0DAQD2BAAh_QMAAOkFACADAAAADQAgAQAADgAwAgAADwAgDwcAAOEFACAIAADnBQAgCQAA_wQAIA4AAOgFACD-AgAA5gUAMP8CAAARABCAAwAA5gUAMIEDAQD2BAAhggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhwAMBAPcEACEBAAAAEQAgBwcAAMoJACAIAADMCQAgCQAA1QYAIA4AAM0JACCRAwAA7wUAIKgDAADvBQAgwAMAAO8FACAPBwAA4QUAIAgAAOcFACAJAAD_BAAgDgAA6AUAIP4CAADmBQAw_wIAABEAEIADAADmBQAwgQMBAAAAAYIDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGoAwEA9wQAIcADAQD3BAAhAwAAABEAIAEAABMAMAIAABQAIBQKAADlBQAgEAAAwwUAIBEAAIcFACAZAACzBQAgHwAAxQUAIP4CAADkBQAw_wIAABYAEIADAADkBQAwgQMBAPYEACGCAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhqAMBAPcEACG7AwIA1wUAIbwDAQD3BAAhvQMBAPcEACG-AwEA9gQAIb8DAQD3BAAhCwoAAMoJACAQAAC9CQAgEQAAjQcAIBkAAOMIACAfAAC_CQAgkQMAAO8FACCoAwAA7wUAILsDAADvBQAgvAMAAO8FACC9AwAA7wUAIL8DAADvBQAgFQoAAOUFACAQAADDBQAgEQAAhwUAIBkAALMFACAfAADFBQAg_gIAAOQFADD_AgAAFgAQgAMAAOQFADCBAwEAAAABggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhuwMCANcFACG8AwEA9wQAIb0DAQD3BAAhvgMBAPYEACG_AwEA9wQAIfwDAADjBQAgAwAAABYAIAEAABcAMAIAABgAIA4KAADhBQAgDAAA4gUAIP4CAADgBQAw_wIAABoAEIADAADgBQAwgQMBAPYEACGCAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhqAMBAPcEACG-AwEA9wQAIc0DAQD2BAAhBQoAAMoJACAMAADLCQAgkQMAAO8FACCoAwAA7wUAIL4DAADvBQAgDgoAAOEFACAMAADiBQAg_gIAAOAFADD_AgAAGgAQgAMAAOAFADCBAwEAAAABggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhvgMBAPcEACHNAwEAAAABAwAAABoAIAEAABsAMAIAABwAIAEAAAARACAMCwAA3wUAIP4CAADeBQAw_wIAAB8AEIADAADeBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhwAMBAPcEACHJAwEA9gQAIcoDAQD2BAAhywMBAPYEACHMAwIA-AQAIQILAADJCQAgwAMAAO8FACANCwAA3wUAIP4CAADeBQAw_wIAAB8AEIADAADeBQAwgQMBAAAAAZIDQAD9BAAhkwNAAP0EACHAAwEA9wQAIckDAQD2BAAhygMBAPYEACHLAwEA9gQAIcwDAgD4BAAh-wMAAN0FACADAAAAHwAgAQAAIAAwAgAAIQAgAQAAAB8AIAEAAAARACABAAAAFgAgAQAAABoAIBgDAAD-BAAgDwAA_wQAIP4CAAD1BAAw_wIAACcAEIADAAD1BAAwgQMBAPYEACGCAwEA9gQAIYMDAQD2BAAhhAMBAPcEACGFAwEA9wQAIYYDAQD3BAAhhwMBAPYEACGIAwIA-AQAIYoDAAD5BIoDIosDAQD2BAAhjAMBAPcEACGNAwEA9gQAIY4DAQD2BAAhjwMIAPoEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIZQDAQD2BAAhAQAAACcAIAMAAAAWACABAAAXADACAAAYACABAAAAFgAgAwAAAA0AIAEAAA4AMAIAAA8AIBISAADUBQAgGgAAywUAIBwAAIgFACD-AgAA2wUAMP8CAAAsABCAAwAA2wUAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhqQMBAPcEACGqA0AA_AQAIawDAADcBawDIq0DAQD3BAAhrgMBAPcEACEJEgAAxwkAIBoAAMUJACAcAACOBwAgkQMAAO8FACCoAwAA7wUAIKkDAADvBQAgqgMAAO8FACCtAwAA7wUAIK4DAADvBQAgEhIAANQFACAaAADLBQAgHAAAiAUAIP4CAADbBQAw_wIAACwAEIADAADbBQAwgQMBAAAAAZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhpwMBAPYEACGoAwEA9wQAIakDAQD3BAAhqgNAAPwEACGsAwAA3AWsAyKtAwEA9wQAIa4DAQD3BAAhAwAAACwAIAEAAC0AMAIAAC4AIBUVAACvBQAgFgAAsAUAIBcAALEFACAYAACyBQAgGQAAswUAIP4CAACtBQAw_wIAADAAEIADAACtBQAwgQMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhqAMBAPcEACGsAwAArgXoAyLiAwEA9wQAIeMDAQD3BAAh5AMBAPcEACHlAwEA9wQAIeYDAACRBQAgAQAAADAAIA4SAADRBQAgFAAAiQUAIP4CAADZBQAw_wIAADIAEIADAADZBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhqQMBAPYEACHVAwAA2gXXAyLXAwEA9gQAIdgDAACRBQAg2QMAANMFACDaAwIA-AQAIQMSAADHCQAgFAAAjwcAINgDAADvBQAgDhIAANEFACAUAACJBQAg_gIAANkFADD_AgAAMgAQgAMAANkFADCBAwEAAAABkgNAAP0EACGTA0AA_QQAIakDAQD2BAAh1QMAANoF1wMi1wMBAPYEACHYAwAAkQUAINkDAADTBQAg2gMCAPgEACEDAAAAMgAgAQAAMwAwAgAANAAgEQYAAM4FACATAADYBQAg_gIAANYFADD_AgAANgAQgAMAANYFADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGjAwEA9gQAIaUDIAD7BAAhqQMBAPcEACHHAyAA-wQAIc4DAQD3BAAhzwMCANcFACHQAyAA-wQAIdEDIAD7BAAh0gMgAPsEACEFBgAAvAkAIBMAAMgJACCpAwAA7wUAIM4DAADvBQAgzwMAAO8FACARBgAAzgUAIBMAANgFACD-AgAA1gUAMP8CAAA2ABCAAwAA1gUAMIEDAQAAAAGSA0AA_QQAIZMDQAD9BAAhowMBAPYEACGlAyAA-wQAIakDAQD3BAAhxwMgAPsEACHOAwEA9wQAIc8DAgDXBQAh0AMgAPsEACHRAyAA-wQAIdIDIAD7BAAhAwAAADYAIAEAADcAMAIAADgAIAEAAAAyACABAAAANgAgDRIAANQFACD-AgAA1QUAMP8CAAA8ABCAAwAA1QUAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIakDAQD3BAAhwQMBAPYEACHVAwEA9wQAIQQSAADHCQAgkQMAAO8FACCpAwAA7wUAINUDAADvBQAgDRIAANQFACD-AgAA1QUAMP8CAAA8ABCAAwAA1QUAMIEDAQAAAAGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhqQMBAPcEACHBAwEA9gQAIdUDAQD3BAAhAwAAADwAIAEAAD0AMAIAAD4AIAEAAAAwACAOEgAA1AUAIP4CAADSBQAw_wIAAEEAEIADAADSBQAwgQMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhqAMBAPcEACGpAwEA9wQAIdMDAADTBQAg1AMCAPgEACEEEgAAxwkAIJEDAADvBQAgqAMAAO8FACCpAwAA7wUAIA4SAADUBQAg_gIAANIFADD_AgAAQQAQgAMAANIFADCBAwEAAAABkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhqQMBAPcEACHTAwAA0wUAINQDAgD4BAAhAwAAAEEAIAEAAEIAMAIAAEMAIAEAAAAwACAPEgAA0QUAIP4CAADQBQAw_wIAAEYAEIADAADQBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhqQMBAPYEACHbAwEA9wQAIdwDAQD3BAAh3QMCAPgEACHeAwIA-AQAId8DAgD4BAAh4AMCAPgEACHhAwIA-AQAIQMSAADHCQAg2wMAAO8FACDcAwAA7wUAIA8SAADRBQAg_gIAANAFADD_AgAARgAQgAMAANAFADCBAwEAAAABkgNAAP0EACGTA0AA_QQAIakDAQD2BAAh2wMBAPcEACHcAwEA9wQAId0DAgD4BAAh3gMCAPgEACHfAwIA-AQAIeADAgD4BAAh4QMCAPgEACEDAAAARgAgAQAARwAwAgAASAAgAwAAACwAIAEAAC0AMAIAAC4AIAEAAAAyACABAAAAPAAgAQAAAEEAIAEAAABGACABAAAALAAgAQAAABYAIAwGAADOBQAgGwAAzwUAIP4CAADNBQAw_wIAAFEAEIADAADNBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhowMBAPYEACGkAwEA9gQAIaUDIAD7BAAhpgNAAPwEACEDBgAAvAkAIBsAAMYJACCmAwAA7wUAIA0GAADOBQAgGwAAzwUAIP4CAADNBQAw_wIAAFEAEIADAADNBQAwgQMBAAAAAZIDQAD9BAAhkwNAAP0EACGjAwEA9gQAIaQDAQD2BAAhpQMgAPsEACGmA0AA_AQAIfoDAADMBQAgAwAAAFEAIAEAAFIAMAIAAFMAIAEAAABRACAUGgAAywUAIB0AAP4EACAeAADKBQAg_gIAAMgFADD_AgAAVgAQgAMAAMgFADCBAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhpwMBAPYEACGtAwEA9wQAIcEDAQD3BAAhwgMBAPcEACHDAwEA9gQAIcQDAQD3BAAhxgMAAMkFxgMixwMgAPsEACHIA0AA_AQAIQkaAADFCQAgHQAA1AYAIB4AANQGACCRAwAA7wUAIK0DAADvBQAgwQMAAO8FACDCAwAA7wUAIMQDAADvBQAgyAMAAO8FACAUGgAAywUAIB0AAP4EACAeAADKBQAg_gIAAMgFADD_AgAAVgAQgAMAAMgFADCBAwEAAAABkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIa0DAQD3BAAhwQMBAPcEACHCAwEA9wQAIcMDAQD2BAAhxAMBAPcEACHGAwAAyQXGAyLHAyAA-wQAIcgDQAD8BAAhAwAAAFYAIAEAAFcAMAIAAFgAIBYEAADABQAgBQAAwQUAIAYAAMIFACAQAADDBQAgIwAAxAUAICQAAMUFACAlAADFBQAg_gIAAL0FADD_AgAAWgAQgAMAAL0FADCBAwEA9gQAIYIDAQD2BAAhgwMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIawDAAC_BfkDIuIDAQD3BAAh9QMgAPsEACH3AwAAvgX3AyL5AyAA-wQAIQEAAABaACABAAAAFgAgAQAAAA0AIAEAAAAsACABAAAAVgAgAwAAAFEAIAEAAFIAMAIAAFMAIAMAAAA2ACABAAA3ADACAAA4ACABAAAADQAgAQAAAFEAIAEAAAA2ACABAAAAJwAgDwMAAP4EACD-AgAAxwUAMP8CAABmABCAAwAAxwUAMIEDAQD2BAAhggMBAPYEACGDAwEA9gQAIYQDAQD3BAAhhQMBAPcEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIZQDAQD2BAAh9wMAAL4F9wMiAQAAAGYAIAMAAABWACABAABXADACAABYACADAAAAVgAgAQAAVwAwAgAAWAAgAQAAAAMAIAEAAAAHACABAAAAVgAgAQAAAFYAIAEAAAABACAEAwAA1AYAIIQDAADvBQAghQMAAO8FACCRAwAA7wUAIAMAAABmACABAABvADACAAABACADAAAAZgAgAQAAbwAwAgAAAQAgAwAAAGYAIAEAAG8AMAIAAAEAIAwDAADECQAggQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABlAMBAAAAAfcDAAAA9wMCASsAAHMAIAuBAwEAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGUAwEAAAAB9wMAAAD3AwIBKwAAdQAwASsAAHUAMAwDAADDCQAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhhAMBAPYFACGFAwEA9gUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACH3AwAA8Qj3AyICAAAAAQAgKwAAeAAgC4EDAQD1BQAhggMBAPUFACGDAwEA9QUAIYQDAQD2BQAhhQMBAPYFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIZQDAQD1BQAh9wMAAPEI9wMiAgAAAGYAICsAAHoAIAIAAABmACArAAB6ACADAAAAAQAgMgAAcwAgMwAAeAAgAQAAAAEAIAEAAABmACAGDQAAwAkAIDgAAMIJACA5AADBCQAghAMAAO8FACCFAwAA7wUAIJEDAADvBQAgDv4CAADGBQAw_wIAAIEBABCAAwAAxgUAMIEDAQDcBAAhggMBANwEACGDAwEA3AQAIYQDAQDdBAAhhQMBAN0EACGQAyAA4QQAIZEDQADiBAAhkgNAAOMEACGTA0AA4wQAIZQDAQDcBAAh9wMAALcF9wMiAwAAAGYAIAEAAIABADA3AACBAQAgAwAAAGYAIAEAAG8AMAIAAAEAIBYEAADABQAgBQAAwQUAIAYAAMIFACAQAADDBQAgIwAAxAUAICQAAMUFACAlAADFBQAg_gIAAL0FADD_AgAAWgAQgAMAAL0FADCBAwEAAAABggMBAPYEACGDAwEAAAABkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGsAwAAvwX5AyLiAwEA9wQAIfUDIAD7BAAh9wMAAL4F9wMi-QMgAPsEACEBAAAAhAEAIAEAAACEAQAgCQQAALoJACAFAAC7CQAgBgAAvAkAIBAAAL0JACAjAAC-CQAgJAAAvwkAICUAAL8JACCRAwAA7wUAIOIDAADvBQAgAwAAAFoAIAEAAIcBADACAACEAQAgAwAAAFoAIAEAAIcBADACAACEAQAgAwAAAFoAIAEAAIcBADACAACEAQAgEwQAALMJACAFAAC0CQAgBgAAtQkAIBAAALYJACAjAAC3CQAgJAAAuAkAICUAALkJACCBAwEAAAABggMBAAAAAYMDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABrAMAAAD5AwLiAwEAAAAB9QMgAAAAAfcDAAAA9wMC-QMgAAAAAQErAACLAQAgDIEDAQAAAAGCAwEAAAABgwMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGsAwAAAPkDAuIDAQAAAAH1AyAAAAAB9wMAAAD3AwL5AyAAAAABASsAAI0BADABKwAAjQEAMBMEAADzCAAgBQAA9AgAIAYAAPUIACAQAAD2CAAgIwAA9wgAICQAAPgIACAlAAD5CAAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACECAAAAhAEAICsAAJABACAMgQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACECAAAAWgAgKwAAkgEAIAIAAABaACArAACSAQAgAwAAAIQBACAyAACLAQAgMwAAkAEAIAEAAACEAQAgAQAAAFoAIAUNAADuCAAgOAAA8AgAIDkAAO8IACCRAwAA7wUAIOIDAADvBQAgD_4CAAC2BQAw_wIAAJkBABCAAwAAtgUAMIEDAQDcBAAhggMBANwEACGDAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhrAMAALgF-QMi4gMBAN0EACH1AyAA4QQAIfcDAAC3BfcDIvkDIADhBAAhAwAAAFoAIAEAAJgBADA3AACZAQAgAwAAAFoAIAEAAIcBADACAACEAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAA7QgAIIEDAQAAAAGSA0AAAAABkwNAAAAAAZQDAQAAAAHxA0AAAAAB8gMBAAAAAfMDAQAAAAH0AwEAAAABASsAAKEBACAIgQMBAAAAAZIDQAAAAAGTA0AAAAABlAMBAAAAAfEDQAAAAAHyAwEAAAAB8wMBAAAAAfQDAQAAAAEBKwAAowEAMAErAACjAQAwCQMAAOwIACCBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGUAwEA9QUAIfEDQAD8BQAh8gMBAPUFACHzAwEA9gUAIfQDAQD2BQAhAgAAAAUAICsAAKYBACAIgQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACHxA0AA_AUAIfIDAQD1BQAh8wMBAPYFACH0AwEA9gUAIQIAAAADACArAACoAQAgAgAAAAMAICsAAKgBACADAAAABQAgMgAAoQEAIDMAAKYBACABAAAABQAgAQAAAAMAIAUNAADpCAAgOAAA6wgAIDkAAOoIACDzAwAA7wUAIPQDAADvBQAgC_4CAAC1BQAw_wIAAK8BABCAAwAAtQUAMIEDAQDcBAAhkgNAAOMEACGTA0AA4wQAIZQDAQDcBAAh8QNAAOMEACHyAwEA3AQAIfMDAQDdBAAh9AMBAN0EACEDAAAAAwAgAQAArgEAMDcAAK8BACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAOAwAA6AgAIIEDAQAAAAGSA0AAAAABkwNAAAAAAZQDAQAAAAHoAwEAAAAB6QMBAAAAAeoDAQAAAAHrAwEAAAAB7AMBAAAAAe0DQAAAAAHuA0AAAAAB7wMBAAAAAfADAQAAAAEBKwAAtwEAIA2BAwEAAAABkgNAAAAAAZMDQAAAAAGUAwEAAAAB6AMBAAAAAekDAQAAAAHqAwEAAAAB6wMBAAAAAewDAQAAAAHtA0AAAAAB7gNAAAAAAe8DAQAAAAHwAwEAAAABASsAALkBADABKwAAuQEAMA4DAADnCAAggQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACHoAwEA9QUAIekDAQD1BQAh6gMBAPYFACHrAwEA9gUAIewDAQD2BQAh7QNAAPsFACHuA0AA-wUAIe8DAQD2BQAh8AMBAPYFACECAAAACQAgKwAAvAEAIA2BAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGUAwEA9QUAIegDAQD1BQAh6QMBAPUFACHqAwEA9gUAIesDAQD2BQAh7AMBAPYFACHtA0AA-wUAIe4DQAD7BQAh7wMBAPYFACHwAwEA9gUAIQIAAAAHACArAAC-AQAgAgAAAAcAICsAAL4BACADAAAACQAgMgAAtwEAIDMAALwBACABAAAACQAgAQAAAAcAIAoNAADkCAAgOAAA5ggAIDkAAOUIACDqAwAA7wUAIOsDAADvBQAg7AMAAO8FACDtAwAA7wUAIO4DAADvBQAg7wMAAO8FACDwAwAA7wUAIBD-AgAAtAUAMP8CAADFAQAQgAMAALQFADCBAwEA3AQAIZIDQADjBAAhkwNAAOMEACGUAwEA3AQAIegDAQDcBAAh6QMBANwEACHqAwEA3QQAIesDAQDdBAAh7AMBAN0EACHtA0AA4gQAIe4DQADiBAAh7wMBAN0EACHwAwEA3QQAIQMAAAAHACABAADEAQAwNwAAxQEAIAMAAAAHACABAAAIADACAAAJACAVFQAArwUAIBYAALAFACAXAACxBQAgGAAAsgUAIBkAALMFACD-AgAArQUAMP8CAAAwABCAAwAArQUAMIEDAQAAAAGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhqAMBAPcEACGsAwAArgXoAyLiAwEA9wQAIeMDAQD3BAAh5AMBAPcEACHlAwEA9wQAIeYDAACRBQAgAQAAAMgBACABAAAAyAEAIAwVAADfCAAgFgAA4AgAIBcAAOEIACAYAADiCAAgGQAA4wgAIJEDAADvBQAgqAMAAO8FACDiAwAA7wUAIOMDAADvBQAg5AMAAO8FACDlAwAA7wUAIOYDAADvBQAgAwAAADAAIAEAAMsBADACAADIAQAgAwAAADAAIAEAAMsBADACAADIAQAgAwAAADAAIAEAAMsBADACAADIAQAgEhUAANoIACAWAADbCAAgFwAA3AgAIBgAAN0IACAZAADeCAAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAawDAAAA6AMC4gMBAAAAAeMDAQAAAAHkAwEAAAAB5QMBAAAAAeYDgAAAAAEBKwAAzwEAIA2BAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGoAwEAAAABrAMAAADoAwLiAwEAAAAB4wMBAAAAAeQDAQAAAAHlAwEAAAAB5gOAAAAAAQErAADRAQAwASsAANEBADASFQAAnAgAIBYAAJ0IACAXAACeCAAgGAAAnwgAIBkAAKAIACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIawDAACbCOgDIuIDAQD2BQAh4wMBAPYFACHkAwEA9gUAIeUDAQD2BQAh5gOAAAAAAQIAAADIAQAgKwAA1AEAIA2BAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIawDAACbCOgDIuIDAQD2BQAh4wMBAPYFACHkAwEA9gUAIeUDAQD2BQAh5gOAAAAAAQIAAAAwACArAADWAQAgAgAAADAAICsAANYBACADAAAAyAEAIDIAAM8BACAzAADUAQAgAQAAAMgBACABAAAAMAAgCg0AAJgIACA4AACaCAAgOQAAmQgAIJEDAADvBQAgqAMAAO8FACDiAwAA7wUAIOMDAADvBQAg5AMAAO8FACDlAwAA7wUAIOYDAADvBQAgEP4CAACpBQAw_wIAAN0BABCAAwAAqQUAMIEDAQDcBAAhkAMgAOEEACGRA0AA4gQAIZIDQADjBAAhkwNAAOMEACGnAwEA3AQAIagDAQDdBAAhrAMAAKoF6AMi4gMBAN0EACHjAwEA3QQAIeQDAQDdBAAh5QMBAN0EACHmAwAAiwUAIAMAAAAwACABAADcAQAwNwAA3QEAIAMAAAAwACABAADLAQAwAgAAyAEAIAEAAABIACABAAAASAAgAwAAAEYAIAEAAEcAMAIAAEgAIAMAAABGACABAABHADACAABIACADAAAARgAgAQAARwAwAgAASAAgDBIAAJcIACCBAwEAAAABkgNAAAAAAZMDQAAAAAGpAwEAAAAB2wMBAAAAAdwDAQAAAAHdAwIAAAAB3gMCAAAAAd8DAgAAAAHgAwIAAAAB4QMCAAAAAQErAADlAQAgC4EDAQAAAAGSA0AAAAABkwNAAAAAAakDAQAAAAHbAwEAAAAB3AMBAAAAAd0DAgAAAAHeAwIAAAAB3wMCAAAAAeADAgAAAAHhAwIAAAABASsAAOcBADABKwAA5wEAMAwSAACWCAAggQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhqQMBAPUFACHbAwEA9gUAIdwDAQD2BQAh3QMCAPcFACHeAwIA9wUAId8DAgD3BQAh4AMCAPcFACHhAwIA9wUAIQIAAABIACArAADqAQAgC4EDAQD1BQAhkgNAAPwFACGTA0AA_AUAIakDAQD1BQAh2wMBAPYFACHcAwEA9gUAId0DAgD3BQAh3gMCAPcFACHfAwIA9wUAIeADAgD3BQAh4QMCAPcFACECAAAARgAgKwAA7AEAIAIAAABGACArAADsAQAgAwAAAEgAIDIAAOUBACAzAADqAQAgAQAAAEgAIAEAAABGACAHDQAAkQgAIDgAAJQIACA5AACTCAAgigEAAJIIACCLAQAAlQgAINsDAADvBQAg3AMAAO8FACAO_gIAAKgFADD_AgAA8wEAEIADAACoBQAwgQMBANwEACGSA0AA4wQAIZMDQADjBAAhqQMBANwEACHbAwEA3QQAIdwDAQDdBAAh3QMCAN4EACHeAwIA3gQAId8DAgDeBAAh4AMCAN4EACHhAwIA3gQAIQMAAABGACABAADyAQAwNwAA8wEAIAMAAABGACABAABHADACAABIACABAAAANAAgAQAAADQAIAMAAAAyACABAAAzADACAAA0ACADAAAAMgAgAQAAMwAwAgAANAAgAwAAADIAIAEAADMAMAIAADQAIAsSAACPCAAgFAAAkAgAIIEDAQAAAAGSA0AAAAABkwNAAAAAAakDAQAAAAHVAwAAANcDAtcDAQAAAAHYA4AAAAAB2QOAAAAAAdoDAgAAAAEBKwAA-wEAIAmBAwEAAAABkgNAAAAAAZMDQAAAAAGpAwEAAAAB1QMAAADXAwLXAwEAAAAB2AOAAAAAAdkDgAAAAAHaAwIAAAABASsAAP0BADABKwAA_QEAMAsSAACECAAgFAAAhQgAIIEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIakDAQD1BQAh1QMAAIMI1wMi1wMBAPUFACHYA4AAAAAB2QOAAAAAAdoDAgD3BQAhAgAAADQAICsAAIACACAJgQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhqQMBAPUFACHVAwAAgwjXAyLXAwEA9QUAIdgDgAAAAAHZA4AAAAAB2gMCAPcFACECAAAAMgAgKwAAggIAIAIAAAAyACArAACCAgAgAwAAADQAIDIAAPsBACAzAACAAgAgAQAAADQAIAEAAAAyACAGDQAA_gcAIDgAAIEIACA5AACACAAgigEAAP8HACCLAQAAgggAINgDAADvBQAgDP4CAACkBQAw_wIAAIkCABCAAwAApAUAMIEDAQDcBAAhkgNAAOMEACGTA0AA4wQAIakDAQDcBAAh1QMAAKUF1wMi1wMBANwEACHYAwAAiwUAINkDAAChBQAg2gMCAN4EACEDAAAAMgAgAQAAiAIAMDcAAIkCACADAAAAMgAgAQAAMwAwAgAANAAgAQAAAD4AIAEAAAA-ACADAAAAPAAgAQAAPQAwAgAAPgAgAwAAADwAIAEAAD0AMAIAAD4AIAMAAAA8ACABAAA9ADACAAA-ACAKEgAA_QcAIIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAakDAQAAAAHBAwEAAAAB1QMBAAAAAQErAACRAgAgCYEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAakDAQAAAAHBAwEAAAAB1QMBAAAAAQErAACTAgAwASsAAJMCADABAAAAMAAgChIAAPwHACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGpAwEA9gUAIcEDAQD1BQAh1QMBAPYFACECAAAAPgAgKwAAlwIAIAmBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGpAwEA9gUAIcEDAQD1BQAh1QMBAPYFACECAAAAPAAgKwAAmQIAIAIAAAA8ACArAACZAgAgAQAAADAAIAMAAAA-ACAyAACRAgAgMwAAlwIAIAEAAAA-ACABAAAAPAAgBg0AAPkHACA4AAD7BwAgOQAA-gcAIJEDAADvBQAgqQMAAO8FACDVAwAA7wUAIAz-AgAAowUAMP8CAAChAgAQgAMAAKMFADCBAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhpwMBANwEACGpAwEA3QQAIcEDAQDcBAAh1QMBAN0EACEDAAAAPAAgAQAAoAIAMDcAAKECACADAAAAPAAgAQAAPQAwAgAAPgAgAQAAAEMAIAEAAABDACADAAAAQQAgAQAAQgAwAgAAQwAgAwAAAEEAIAEAAEIAMAIAAEMAIAMAAABBACABAABCADACAABDACALEgAA-AcAIIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAagDAQAAAAGpAwEAAAAB0wOAAAAAAdQDAgAAAAEBKwAAqQIAIAqBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAdMDgAAAAAHUAwIAAAABASsAAKsCADABKwAAqwIAMAEAAAAwACALEgAA9wcAIIEDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGnAwEA9QUAIagDAQD2BQAhqQMBAPYFACHTA4AAAAAB1AMCAPcFACECAAAAQwAgKwAArwIAIAqBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIakDAQD2BQAh0wOAAAAAAdQDAgD3BQAhAgAAAEEAICsAALECACACAAAAQQAgKwAAsQIAIAEAAAAwACADAAAAQwAgMgAAqQIAIDMAAK8CACABAAAAQwAgAQAAAEEAIAgNAADyBwAgOAAA9QcAIDkAAPQHACCKAQAA8wcAIIsBAAD2BwAgkQMAAO8FACCoAwAA7wUAIKkDAADvBQAgDf4CAACgBQAw_wIAALkCABCAAwAAoAUAMIEDAQDcBAAhkAMgAOEEACGRA0AA4gQAIZIDQADjBAAhkwNAAOMEACGnAwEA3AQAIagDAQDdBAAhqQMBAN0EACHTAwAAoQUAINQDAgDeBAAhAwAAAEEAIAEAALgCADA3AAC5AgAgAwAAAEEAIAEAAEIAMAIAAEMAIAEAAAA4ACABAAAAOAAgAwAAADYAIAEAADcAMAIAADgAIAMAAAA2ACABAAA3ADACAAA4ACADAAAANgAgAQAANwAwAgAAOAAgDgYAAPEHACATAAD0BgAggQMBAAAAAZIDQAAAAAGTA0AAAAABowMBAAAAAaUDIAAAAAGpAwEAAAABxwMgAAAAAc4DAQAAAAHPAwIAAAAB0AMgAAAAAdEDIAAAAAHSAyAAAAABASsAAMECACAMgQMBAAAAAZIDQAAAAAGTA0AAAAABowMBAAAAAaUDIAAAAAGpAwEAAAABxwMgAAAAAc4DAQAAAAHPAwIAAAAB0AMgAAAAAdEDIAAAAAHSAyAAAAABASsAAMMCADABKwAAwwIAMAEAAAAyACAOBgAA8AcAIBMAAPIGACCBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGjAwEA9QUAIaUDIAD6BQAhqQMBAPYFACHHAyAA-gUAIc4DAQD2BQAhzwMCAIkGACHQAyAA-gUAIdEDIAD6BQAh0gMgAPoFACECAAAAOAAgKwAAxwIAIAyBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGjAwEA9QUAIaUDIAD6BQAhqQMBAPYFACHHAyAA-gUAIc4DAQD2BQAhzwMCAIkGACHQAyAA-gUAIdEDIAD6BQAh0gMgAPoFACECAAAANgAgKwAAyQIAIAIAAAA2ACArAADJAgAgAQAAADIAIAMAAAA4ACAyAADBAgAgMwAAxwIAIAEAAAA4ACABAAAANgAgCA0AAOsHACA4AADuBwAgOQAA7QcAIIoBAADsBwAgiwEAAO8HACCpAwAA7wUAIM4DAADvBQAgzwMAAO8FACAP_gIAAJ8FADD_AgAA0QIAEIADAACfBQAwgQMBANwEACGSA0AA4wQAIZMDQADjBAAhowMBANwEACGlAyAA4QQAIakDAQDdBAAhxwMgAOEEACHOAwEA3QQAIc8DAgCVBQAh0AMgAOEEACHRAyAA4QQAIdIDIADhBAAhAwAAADYAIAEAANACADA3AADRAgAgAwAAADYAIAEAADcAMAIAADgAIAEAAAAcACABAAAAHAAgAwAAABoAIAEAABsAMAIAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgCwoAAOoHACAMAADABwAggQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAb4DAQAAAAHNAwEAAAABASsAANkCACAJgQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAb4DAQAAAAHNAwEAAAABASsAANsCADABKwAA2wIAMAEAAAARACALCgAA6QcAIAwAALIHACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIb4DAQD2BQAhzQMBAPUFACECAAAAHAAgKwAA3wIAIAmBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIb4DAQD2BQAhzQMBAPUFACECAAAAGgAgKwAA4QIAIAIAAAAaACArAADhAgAgAQAAABEAIAMAAAAcACAyAADZAgAgMwAA3wIAIAEAAAAcACABAAAAGgAgBg0AAOYHACA4AADoBwAgOQAA5wcAIJEDAADvBQAgqAMAAO8FACC-AwAA7wUAIAz-AgAAngUAMP8CAADpAgAQgAMAAJ4FADCBAwEA3AQAIYIDAQDcBAAhkAMgAOEEACGRA0AA4gQAIZIDQADjBAAhkwNAAOMEACGoAwEA3QQAIb4DAQDdBAAhzQMBANwEACEDAAAAGgAgAQAA6AIAMDcAAOkCACADAAAAGgAgAQAAGwAwAgAAHAAgAQAAACEAIAEAAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACAJCwAA5QcAIIEDAQAAAAGSA0AAAAABkwNAAAAAAcADAQAAAAHJAwEAAAABygMBAAAAAcsDAQAAAAHMAwIAAAABASsAAPECACAIgQMBAAAAAZIDQAAAAAGTA0AAAAABwAMBAAAAAckDAQAAAAHKAwEAAAABywMBAAAAAcwDAgAAAAEBKwAA8wIAMAErAADzAgAwCQsAAOQHACCBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACHAAwEA9gUAIckDAQD1BQAhygMBAPUFACHLAwEA9QUAIcwDAgD3BQAhAgAAACEAICsAAPYCACAIgQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhwAMBAPYFACHJAwEA9QUAIcoDAQD1BQAhywMBAPUFACHMAwIA9wUAIQIAAAAfACArAAD4AgAgAgAAAB8AICsAAPgCACADAAAAIQAgMgAA8QIAIDMAAPYCACABAAAAIQAgAQAAAB8AIAYNAADfBwAgOAAA4gcAIDkAAOEHACCKAQAA4AcAIIsBAADjBwAgwAMAAO8FACAL_gIAAJ0FADD_AgAA_wIAEIADAACdBQAwgQMBANwEACGSA0AA4wQAIZMDQADjBAAhwAMBAN0EACHJAwEA3AQAIcoDAQDcBAAhywMBANwEACHMAwIA3gQAIQMAAAAfACABAAD-AgAwNwAA_wIAIAMAAAAfACABAAAgADACAAAhACABAAAAWAAgAQAAAFgAIAMAAABWACABAABXADACAABYACADAAAAVgAgAQAAVwAwAgAAWAAgAwAAAFYAIAEAAFcAMAIAAFgAIBEaAADeBwAgHQAAngYAIB4AAJ8GACCBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGtAwEAAAABwQMBAAAAAcIDAQAAAAHDAwEAAAABxAMBAAAAAcYDAAAAxgMCxwMgAAAAAcgDQAAAAAEBKwAAhwMAIA6BAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGtAwEAAAABwQMBAAAAAcIDAQAAAAHDAwEAAAABxAMBAAAAAcYDAAAAxgMCxwMgAAAAAcgDQAAAAAEBKwAAiQMAMAErAACJAwAwAQAAAFoAIAEAAAAWACARGgAA3QcAIB0AAJsGACAeAACcBgAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhrQMBAPYFACHBAwEA9gUAIcIDAQD2BQAhwwMBAPUFACHEAwEA9gUAIcYDAACZBsYDIscDIAD6BQAhyANAAPsFACECAAAAWAAgKwAAjgMAIA6BAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGtAwEA9gUAIcEDAQD2BQAhwgMBAPYFACHDAwEA9QUAIcQDAQD2BQAhxgMAAJkGxgMixwMgAPoFACHIA0AA-wUAIQIAAABWACArAACQAwAgAgAAAFYAICsAAJADACABAAAAWgAgAQAAABYAIAMAAABYACAyAACHAwAgMwAAjgMAIAEAAABYACABAAAAVgAgCQ0AANoHACA4AADcBwAgOQAA2wcAIJEDAADvBQAgrQMAAO8FACDBAwAA7wUAIMIDAADvBQAgxAMAAO8FACDIAwAA7wUAIBH-AgAAmQUAMP8CAACZAwAQgAMAAJkFADCBAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhpwMBANwEACGtAwEA3QQAIcEDAQDdBAAhwgMBAN0EACHDAwEA3AQAIcQDAQDdBAAhxgMAAJoFxgMixwMgAOEEACHIA0AA4gQAIQMAAABWACABAACYAwAwNwAAmQMAIAMAAABWACABAABXADACAABYACABAAAAFAAgAQAAABQAIAMAAAARACABAAATADACAAAUACADAAAAEQAgAQAAEwAwAgAAFAAgAwAAABEAIAEAABMAMAIAABQAIAwHAADZBwAgCAAA1gcAIAkAANcHACAOAADYBwAggQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAcADAQAAAAEBKwAAoQMAIAiBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABwAMBAAAAAQErAACjAwAwASsAAKMDADABAAAAEQAgDAcAAKMHACAIAACkBwAgCQAApQcAIA4AAKYHACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIcADAQD2BQAhAgAAABQAICsAAKcDACAIgQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACHAAwEA9gUAIQIAAAARACArAACpAwAgAgAAABEAICsAAKkDACABAAAAEQAgAwAAABQAIDIAAKEDACAzAACnAwAgAQAAABQAIAEAAAARACAGDQAAoAcAIDgAAKIHACA5AAChBwAgkQMAAO8FACCoAwAA7wUAIMADAADvBQAgC_4CAACYBQAw_wIAALEDABCAAwAAmAUAMIEDAQDcBAAhggMBANwEACGQAyAA4QQAIZEDQADiBAAhkgNAAOMEACGTA0AA4wQAIagDAQDdBAAhwAMBAN0EACEDAAAAEQAgAQAAsAMAMDcAALEDACADAAAAEQAgAQAAEwAwAgAAFAAgAQAAABgAIAEAAAAYACADAAAAFgAgAQAAFwAwAgAAGAAgAwAAABYAIAEAABcAMAIAABgAIAMAAAAWACABAAAXADACAAAYACARCgAAzgYAIBAAAJ8HACARAADPBgAgGQAA0AYAIB8AANEGACCBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABuwMCAAAAAbwDAQAAAAG9AwEAAAABvgMBAAAAAb8DAQAAAAEBKwAAuQMAIAyBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABuwMCAAAAAbwDAQAAAAG9AwEAAAABvgMBAAAAAb8DAQAAAAEBKwAAuwMAMAErAAC7AwAwAQAAACcAIBEKAACLBgAgEAAAngcAIBEAAIwGACAZAACNBgAgHwAAjgYAIIEDAQD1BQAhggMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIagDAQD2BQAhuwMCAIkGACG8AwEA9gUAIb0DAQD2BQAhvgMBAPUFACG_AwEA9gUAIQIAAAAYACArAAC_AwAgDIEDAQD1BQAhggMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIagDAQD2BQAhuwMCAIkGACG8AwEA9gUAIb0DAQD2BQAhvgMBAPUFACG_AwEA9gUAIQIAAAAWACArAADBAwAgAgAAABYAICsAAMEDACABAAAAJwAgAwAAABgAIDIAALkDACAzAAC_AwAgAQAAABgAIAEAAAAWACALDQAAmQcAIDgAAJwHACA5AACbBwAgigEAAJoHACCLAQAAnQcAIJEDAADvBQAgqAMAAO8FACC7AwAA7wUAILwDAADvBQAgvQMAAO8FACC_AwAA7wUAIA_-AgAAlAUAMP8CAADJAwAQgAMAAJQFADCBAwEA3AQAIYIDAQDcBAAhkAMgAOEEACGRA0AA4gQAIZIDQADjBAAhkwNAAOMEACGoAwEA3QQAIbsDAgCVBQAhvAMBAN0EACG9AwEA3QQAIb4DAQDcBAAhvwMBAN0EACEDAAAAFgAgAQAAyAMAMDcAAMkDACADAAAAFgAgAQAAFwAwAgAAGAAgAQAAAA8AIAEAAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACAHBgAAzAYAIBoAAIgHACCBAwEAAAABkgNAAAAAAZMDQAAAAAGjAwEAAAABrQMBAAAAAQErAADRAwAgBYEDAQAAAAGSA0AAAAABkwNAAAAAAaMDAQAAAAGtAwEAAAABASsAANMDADABKwAA0wMAMAcGAADKBgAgGgAAhgcAIIEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIaMDAQD1BQAhrQMBAPUFACECAAAADwAgKwAA1gMAIAWBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGjAwEA9QUAIa0DAQD1BQAhAgAAAA0AICsAANgDACACAAAADQAgKwAA2AMAIAMAAAAPACAyAADRAwAgMwAA1gMAIAEAAAAPACABAAAADQAgAw0AAJYHACA4AACYBwAgOQAAlwcAIAj-AgAAkwUAMP8CAADfAwAQgAMAAJMFADCBAwEA3AQAIZIDQADjBAAhkwNAAOMEACGjAwEA3AQAIa0DAQDcBAAhAwAAAA0AIAEAAN4DADA3AADfAwAgAwAAAA0AIAEAAA4AMAIAAA8AIAz-AgAAkAUAMP8CAADlAwAQgAMAAJAFADCBAwEAAAABkgNAAP0EACGTA0AA_QQAIawDAACSBbUDIq8DCAD6BAAhsAMBAAAAAbEDAQD3BAAhsgMBAPcEACGzAwAAkQUAIAEAAADiAwAgAQAAAOIDACAM_gIAAJAFADD_AgAA5QMAEIADAACQBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhrAMAAJIFtQMirwMIAPoEACGwAwEA9gQAIbEDAQD3BAAhsgMBAPcEACGzAwAAkQUAIAOxAwAA7wUAILIDAADvBQAgswMAAO8FACADAAAA5QMAIAEAAOYDADACAADiAwAgAwAAAOUDACABAADmAwAwAgAA4gMAIAMAAADlAwAgAQAA5gMAMAIAAOIDACAJgQMBAAAAAZIDQAAAAAGTA0AAAAABrAMAAAC1AwKvAwgAAAABsAMBAAAAAbEDAQAAAAGyAwEAAAABswOAAAAAAQErAADqAwAgCYEDAQAAAAGSA0AAAAABkwNAAAAAAawDAAAAtQMCrwMIAAAAAbADAQAAAAGxAwEAAAABsgMBAAAAAbMDgAAAAAEBKwAA7AMAMAErAADsAwAwCYEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIawDAACVB7UDIq8DCAD5BQAhsAMBAPUFACGxAwEA9gUAIbIDAQD2BQAhswOAAAAAAQIAAADiAwAgKwAA7wMAIAmBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGsAwAAlQe1AyKvAwgA-QUAIbADAQD1BQAhsQMBAPYFACGyAwEA9gUAIbMDgAAAAAECAAAA5QMAICsAAPEDACACAAAA5QMAICsAAPEDACADAAAA4gMAIDIAAOoDACAzAADvAwAgAQAAAOIDACABAAAA5QMAIAgNAACQBwAgOAAAkwcAIDkAAJIHACCKAQAAkQcAIIsBAACUBwAgsQMAAO8FACCyAwAA7wUAILMDAADvBQAgDP4CAACKBQAw_wIAAPgDABCAAwAAigUAMIEDAQDcBAAhkgNAAOMEACGTA0AA4wQAIawDAACMBbUDIq8DCADgBAAhsAMBANwEACGxAwEA3QQAIbIDAQDdBAAhswMAAIsFACADAAAA5QMAIAEAAPcDADA3AAD4AwAgAwAAAOUDACABAADmAwAwAgAA4gMAIBIDAAD-BAAgIAAAhwUAICEAAIgFACAiAACJBQAg_gIAAIYFADD_AgAACwAQgAMAAIYFADCBAwEAAAABggMBAPYEACGDAwEAAAABhAMBAPcEACGFAwEA9wQAIYYDAQD3BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGUAwEAAAABAQAAAPsDACABAAAA-wMAIAgDAADUBgAgIAAAjQcAICEAAI4HACAiAACPBwAghAMAAO8FACCFAwAA7wUAIIYDAADvBQAgkQMAAO8FACADAAAACwAgAQAA_gMAMAIAAPsDACADAAAACwAgAQAA_gMAMAIAAPsDACADAAAACwAgAQAA_gMAMAIAAPsDACAPAwAAiQcAICAAAIoHACAhAACLBwAgIgAAjAcAIIEDAQAAAAGCAwEAAAABgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGUAwEAAAABASsAAIIEACALgQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDAQAAAAEBKwAAhAQAMAErAACEBAAwDwMAAOMGACAgAADkBgAgIQAA5QYAICIAAOYGACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGEAwEA9gUAIYUDAQD2BQAhhgMBAPYFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIZQDAQD1BQAhAgAAAPsDACArAACHBAAgC4EDAQD1BQAhggMBAPUFACGDAwEA9QUAIYQDAQD2BQAhhQMBAPYFACGGAwEA9gUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACECAAAACwAgKwAAiQQAIAIAAAALACArAACJBAAgAwAAAPsDACAyAACCBAAgMwAAhwQAIAEAAAD7AwAgAQAAAAsAIAcNAADgBgAgOAAA4gYAIDkAAOEGACCEAwAA7wUAIIUDAADvBQAghgMAAO8FACCRAwAA7wUAIA7-AgAAhQUAMP8CAACQBAAQgAMAAIUFADCBAwEA3AQAIYIDAQDcBAAhgwMBANwEACGEAwEA3QQAIYUDAQDdBAAhhgMBAN0EACGQAyAA4QQAIZEDQADiBAAhkgNAAOMEACGTA0AA4wQAIZQDAQDcBAAhAwAAAAsAIAEAAI8EADA3AACQBAAgAwAAAAsAIAEAAP4DADACAAD7AwAgAQAAAC4AIAEAAAAuACADAAAALAAgAQAALQAwAgAALgAgAwAAACwAIAEAAC0AMAIAAC4AIAMAAAAsACABAAAtADACAAAuACAPEgAAvQYAIBoAAN8GACAcAAC-BgAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAakDAQAAAAGqA0AAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAQErAACYBAAgDIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgNAAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAEBKwAAmgQAMAErAACaBAAwAQAAADAAIAEAAAAWACAPEgAArAYAIBoAAN4GACAcAACtBgAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGpAwEA9gUAIaoDQAD7BQAhrAMAAKoGrAMirQMBAPYFACGuAwEA9gUAIQIAAAAuACArAACfBAAgDIEDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGnAwEA9QUAIagDAQD2BQAhqQMBAPYFACGqA0AA-wUAIawDAACqBqwDIq0DAQD2BQAhrgMBAPYFACECAAAALAAgKwAAoQQAIAIAAAAsACArAAChBAAgAQAAADAAIAEAAAAWACADAAAALgAgMgAAmAQAIDMAAJ8EACABAAAALgAgAQAAACwAIAkNAADbBgAgOAAA3QYAIDkAANwGACCRAwAA7wUAIKgDAADvBQAgqQMAAO8FACCqAwAA7wUAIK0DAADvBQAgrgMAAO8FACAP_gIAAIEFADD_AgAAqgQAEIADAACBBQAwgQMBANwEACGQAyAA4QQAIZEDQADiBAAhkgNAAOMEACGTA0AA4wQAIacDAQDcBAAhqAMBAN0EACGpAwEA3QQAIaoDQADiBAAhrAMAAIIFrAMirQMBAN0EACGuAwEA3QQAIQMAAAAsACABAACpBAAwNwAAqgQAIAMAAAAsACABAAAtADACAAAuACABAAAAUwAgAQAAAFMAIAMAAABRACABAABSADACAABTACADAAAAUQAgAQAAUgAwAgAAUwAgAwAAAFEAIAEAAFIAMAIAAFMAIAkGAAC7BgAgGwAA2gYAIIEDAQAAAAGSA0AAAAABkwNAAAAAAaMDAQAAAAGkAwEAAAABpQMgAAAAAaYDQAAAAAEBKwAAsgQAIAeBAwEAAAABkgNAAAAAAZMDQAAAAAGjAwEAAAABpAMBAAAAAaUDIAAAAAGmA0AAAAABASsAALQEADABKwAAtAQAMAkGAAC5BgAgGwAA2QYAIIEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIaMDAQD1BQAhpAMBAPUFACGlAyAA-gUAIaYDQAD7BQAhAgAAAFMAICsAALcEACAHgQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhowMBAPUFACGkAwEA9QUAIaUDIAD6BQAhpgNAAPsFACECAAAAUQAgKwAAuQQAIAIAAABRACArAAC5BAAgAwAAAFMAIDIAALIEACAzAAC3BAAgAQAAAFMAIAEAAABRACAEDQAA1gYAIDgAANgGACA5AADXBgAgpgMAAO8FACAK_gIAAIAFADD_AgAAwAQAEIADAACABQAwgQMBANwEACGSA0AA4wQAIZMDQADjBAAhowMBANwEACGkAwEA3AQAIaUDIADhBAAhpgNAAOIEACEDAAAAUQAgAQAAvwQAMDcAAMAEACADAAAAUQAgAQAAUgAwAgAAUwAgGAMAAP4EACAPAAD_BAAg_gIAAPUEADD_AgAAJwAQgAMAAPUEADCBAwEAAAABggMBAPYEACGDAwEAAAABhAMBAPcEACGFAwEA9wQAIYYDAQD3BAAhhwMBAAAAAYgDAgD4BAAhigMAAPkEigMiiwMBAPYEACGMAwEA9wQAIY0DAQD2BAAhjgMBAPYEACGPAwgA-gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhlAMBAAAAAQEAAADDBAAgAQAAAMMEACAHAwAA1AYAIA8AANUGACCEAwAA7wUAIIUDAADvBQAghgMAAO8FACCMAwAA7wUAIJEDAADvBQAgAwAAACcAIAEAAMYEADACAADDBAAgAwAAACcAIAEAAMYEADACAADDBAAgAwAAACcAIAEAAMYEADACAADDBAAgFQMAANIGACAPAADTBgAggQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAgAAAAGKAwAAAIoDAosDAQAAAAGMAwEAAAABjQMBAAAAAY4DAQAAAAGPAwgAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDAQAAAAEBKwAAygQAIBOBAwEAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMCAAAAAYoDAAAAigMCiwMBAAAAAYwDAQAAAAGNAwEAAAABjgMBAAAAAY8DCAAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABlAMBAAAAAQErAADMBAAwASsAAMwEADAVAwAA_QUAIA8AAP4FACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGEAwEA9gUAIYUDAQD2BQAhhgMBAPYFACGHAwEA9QUAIYgDAgD3BQAhigMAAPgFigMiiwMBAPUFACGMAwEA9gUAIY0DAQD1BQAhjgMBAPUFACGPAwgA-QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACECAAAAwwQAICsAAM8EACATgQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhhAMBAPYFACGFAwEA9gUAIYYDAQD2BQAhhwMBAPUFACGIAwIA9wUAIYoDAAD4BYoDIosDAQD1BQAhjAMBAPYFACGNAwEA9QUAIY4DAQD1BQAhjwMIAPkFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIZQDAQD1BQAhAgAAACcAICsAANEEACACAAAAJwAgKwAA0QQAIAMAAADDBAAgMgAAygQAIDMAAM8EACABAAAAwwQAIAEAAAAnACAKDQAA8AUAIDgAAPMFACA5AADyBQAgigEAAPEFACCLAQAA9AUAIIQDAADvBQAghQMAAO8FACCGAwAA7wUAIIwDAADvBQAgkQMAAO8FACAW_gIAANsEADD_AgAA2AQAEIADAADbBAAwgQMBANwEACGCAwEA3AQAIYMDAQDcBAAhhAMBAN0EACGFAwEA3QQAIYYDAQDdBAAhhwMBANwEACGIAwIA3gQAIYoDAADfBIoDIosDAQDcBAAhjAMBAN0EACGNAwEA3AQAIY4DAQDcBAAhjwMIAOAEACGQAyAA4QQAIZEDQADiBAAhkgNAAOMEACGTA0AA4wQAIZQDAQDcBAAhAwAAACcAIAEAANcEADA3AADYBAAgAwAAACcAIAEAAMYEADACAADDBAAgFv4CAADbBAAw_wIAANgEABCAAwAA2wQAMIEDAQDcBAAhggMBANwEACGDAwEA3AQAIYQDAQDdBAAhhQMBAN0EACGGAwEA3QQAIYcDAQDcBAAhiAMCAN4EACGKAwAA3wSKAyKLAwEA3AQAIYwDAQDdBAAhjQMBANwEACGOAwEA3AQAIY8DCADgBAAhkAMgAOEEACGRA0AA4gQAIZIDQADjBAAhkwNAAOMEACGUAwEA3AQAIQ4NAADlBAAgOAAA9AQAIDkAAPQEACCVAwEAAAABlgMBAAAABJcDAQAAAASYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnAMBAPMEACGdAwEAAAABngMBAAAAAZ8DAQAAAAEODQAA6AQAIDgAAPIEACA5AADyBAAglQMBAAAAAZYDAQAAAAWXAwEAAAAFmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZwDAQDxBAAhnQMBAAAAAZ4DAQAAAAGfAwEAAAABDQ0AAOUEACA4AADlBAAgOQAA5QQAIIoBAADtBAAgiwEAAOUEACCVAwIAAAABlgMCAAAABJcDAgAAAASYAwIAAAABmQMCAAAAAZoDAgAAAAGbAwIAAAABnAMCAPAEACEHDQAA5QQAIDgAAO8EACA5AADvBAAglQMAAACKAwKWAwAAAIoDCJcDAAAAigMInAMAAO4EigMiDQ0AAOUEACA4AADtBAAgOQAA7QQAIIoBAADtBAAgiwEAAO0EACCVAwgAAAABlgMIAAAABJcDCAAAAASYAwgAAAABmQMIAAAAAZoDCAAAAAGbAwgAAAABnAMIAOwEACEFDQAA5QQAIDgAAOsEACA5AADrBAAglQMgAAAAAZwDIADqBAAhCw0AAOgEACA4AADpBAAgOQAA6QQAIJUDQAAAAAGWA0AAAAAFlwNAAAAABZgDQAAAAAGZA0AAAAABmgNAAAAAAZsDQAAAAAGcA0AA5wQAIQsNAADlBAAgOAAA5gQAIDkAAOYEACCVA0AAAAABlgNAAAAABJcDQAAAAASYA0AAAAABmQNAAAAAAZoDQAAAAAGbA0AAAAABnANAAOQEACELDQAA5QQAIDgAAOYEACA5AADmBAAglQNAAAAAAZYDQAAAAASXA0AAAAAEmANAAAAAAZkDQAAAAAGaA0AAAAABmwNAAAAAAZwDQADkBAAhCJUDAgAAAAGWAwIAAAAElwMCAAAABJgDAgAAAAGZAwIAAAABmgMCAAAAAZsDAgAAAAGcAwIA5QQAIQiVA0AAAAABlgNAAAAABJcDQAAAAASYA0AAAAABmQNAAAAAAZoDQAAAAAGbA0AAAAABnANAAOYEACELDQAA6AQAIDgAAOkEACA5AADpBAAglQNAAAAAAZYDQAAAAAWXA0AAAAAFmANAAAAAAZkDQAAAAAGaA0AAAAABmwNAAAAAAZwDQADnBAAhCJUDAgAAAAGWAwIAAAAFlwMCAAAABZgDAgAAAAGZAwIAAAABmgMCAAAAAZsDAgAAAAGcAwIA6AQAIQiVA0AAAAABlgNAAAAABZcDQAAAAAWYA0AAAAABmQNAAAAAAZoDQAAAAAGbA0AAAAABnANAAOkEACEFDQAA5QQAIDgAAOsEACA5AADrBAAglQMgAAAAAZwDIADqBAAhApUDIAAAAAGcAyAA6wQAIQ0NAADlBAAgOAAA7QQAIDkAAO0EACCKAQAA7QQAIIsBAADtBAAglQMIAAAAAZYDCAAAAASXAwgAAAAEmAMIAAAAAZkDCAAAAAGaAwgAAAABmwMIAAAAAZwDCADsBAAhCJUDCAAAAAGWAwgAAAAElwMIAAAABJgDCAAAAAGZAwgAAAABmgMIAAAAAZsDCAAAAAGcAwgA7QQAIQcNAADlBAAgOAAA7wQAIDkAAO8EACCVAwAAAIoDApYDAAAAigMIlwMAAACKAwicAwAA7gSKAyIElQMAAACKAwKWAwAAAIoDCJcDAAAAigMInAMAAO8EigMiDQ0AAOUEACA4AADlBAAgOQAA5QQAIIoBAADtBAAgiwEAAOUEACCVAwIAAAABlgMCAAAABJcDAgAAAASYAwIAAAABmQMCAAAAAZoDAgAAAAGbAwIAAAABnAMCAPAEACEODQAA6AQAIDgAAPIEACA5AADyBAAglQMBAAAAAZYDAQAAAAWXAwEAAAAFmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZwDAQDxBAAhnQMBAAAAAZ4DAQAAAAGfAwEAAAABC5UDAQAAAAGWAwEAAAAFlwMBAAAABZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGcAwEA8gQAIZ0DAQAAAAGeAwEAAAABnwMBAAAAAQ4NAADlBAAgOAAA9AQAIDkAAPQEACCVAwEAAAABlgMBAAAABJcDAQAAAASYAwEAAAABmQMBAAAAAZoDAQAAAAGbAwEAAAABnAMBAPMEACGdAwEAAAABngMBAAAAAZ8DAQAAAAELlQMBAAAAAZYDAQAAAASXAwEAAAAEmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZwDAQD0BAAhnQMBAAAAAZ4DAQAAAAGfAwEAAAABGAMAAP4EACAPAAD_BAAg_gIAAPUEADD_AgAAJwAQgAMAAPUEADCBAwEA9gQAIYIDAQD2BAAhgwMBAPYEACGEAwEA9wQAIYUDAQD3BAAhhgMBAPcEACGHAwEA9gQAIYgDAgD4BAAhigMAAPkEigMiiwMBAPYEACGMAwEA9wQAIY0DAQD2BAAhjgMBAPYEACGPAwgA-gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACELlQMBAAAAAZYDAQAAAASXAwEAAAAEmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMBAAAAAZwDAQD0BAAhnQMBAAAAAZ4DAQAAAAGfAwEAAAABC5UDAQAAAAGWAwEAAAAFlwMBAAAABZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDAQAAAAGcAwEA8gQAIZ0DAQAAAAGeAwEAAAABnwMBAAAAAQiVAwIAAAABlgMCAAAABJcDAgAAAASYAwIAAAABmQMCAAAAAZoDAgAAAAGbAwIAAAABnAMCAOUEACEElQMAAACKAwKWAwAAAIoDCJcDAAAAigMInAMAAO8EigMiCJUDCAAAAAGWAwgAAAAElwMIAAAABJgDCAAAAAGZAwgAAAABmgMIAAAAAZsDCAAAAAGcAwgA7QQAIQKVAyAAAAABnAMgAOsEACEIlQNAAAAAAZYDQAAAAAWXA0AAAAAFmANAAAAAAZkDQAAAAAGaA0AAAAABmwNAAAAAAZwDQADpBAAhCJUDQAAAAAGWA0AAAAAElwNAAAAABJgDQAAAAAGZA0AAAAABmgNAAAAAAZsDQAAAAAGcA0AA5gQAIRgEAADABQAgBQAAwQUAIAYAAMIFACAQAADDBQAgIwAAxAUAICQAAMUFACAlAADFBQAg_gIAAL0FADD_AgAAWgAQgAMAAL0FADCBAwEA9gQAIYIDAQD2BAAhgwMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIawDAAC_BfkDIuIDAQD3BAAh9QMgAPsEACH3AwAAvgX3AyL5AyAA-wQAIf8DAABaACCABAAAWgAgA6ADAAAWACChAwAAFgAgogMAABYAIAr-AgAAgAUAMP8CAADABAAQgAMAAIAFADCBAwEA3AQAIZIDQADjBAAhkwNAAOMEACGjAwEA3AQAIaQDAQDcBAAhpQMgAOEEACGmA0AA4gQAIQ_-AgAAgQUAMP8CAACqBAAQgAMAAIEFADCBAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhpwMBANwEACGoAwEA3QQAIakDAQDdBAAhqgNAAOIEACGsAwAAggWsAyKtAwEA3QQAIa4DAQDdBAAhBw0AAOUEACA4AACEBQAgOQAAhAUAIJUDAAAArAMClgMAAACsAwiXAwAAAKwDCJwDAACDBawDIgcNAADlBAAgOAAAhAUAIDkAAIQFACCVAwAAAKwDApYDAAAArAMIlwMAAACsAwicAwAAgwWsAyIElQMAAACsAwKWAwAAAKwDCJcDAAAArAMInAMAAIQFrAMiDv4CAACFBQAw_wIAAJAEABCAAwAAhQUAMIEDAQDcBAAhggMBANwEACGDAwEA3AQAIYQDAQDdBAAhhQMBAN0EACGGAwEA3QQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhlAMBANwEACESAwAA_gQAICAAAIcFACAhAACIBQAgIgAAiQUAIP4CAACGBQAw_wIAAAsAEIADAACGBQAwgQMBAPYEACGCAwEA9gQAIYMDAQD2BAAhhAMBAPcEACGFAwEA9wQAIYYDAQD3BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGUAwEA9gQAIQOgAwAADQAgoQMAAA0AIKIDAAANACADoAMAAFEAIKEDAABRACCiAwAAUQAgA6ADAAA2ACChAwAANgAgogMAADYAIAz-AgAAigUAMP8CAAD4AwAQgAMAAIoFADCBAwEA3AQAIZIDQADjBAAhkwNAAOMEACGsAwAAjAW1AyKvAwgA4AQAIbADAQDcBAAhsQMBAN0EACGyAwEA3QQAIbMDAACLBQAgDw0AAOgEACA4AACPBQAgOQAAjwUAIJUDgAAAAAGYA4AAAAABmQOAAAAAAZoDgAAAAAGbA4AAAAABnAOAAAAAAbUDAQAAAAG2AwEAAAABtwMBAAAAAbgDgAAAAAG5A4AAAAABugOAAAAAAQcNAADlBAAgOAAAjgUAIDkAAI4FACCVAwAAALUDApYDAAAAtQMIlwMAAAC1AwicAwAAjQW1AyIHDQAA5QQAIDgAAI4FACA5AACOBQAglQMAAAC1AwKWAwAAALUDCJcDAAAAtQMInAMAAI0FtQMiBJUDAAAAtQMClgMAAAC1AwiXAwAAALUDCJwDAACOBbUDIgyVA4AAAAABmAOAAAAAAZkDgAAAAAGaA4AAAAABmwOAAAAAAZwDgAAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4A4AAAAABuQOAAAAAAboDgAAAAAEM_gIAAJAFADD_AgAA5QMAEIADAACQBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhrAMAAJIFtQMirwMIAPoEACGwAwEA9gQAIbEDAQD3BAAhsgMBAPcEACGzAwAAkQUAIAyVA4AAAAABmAOAAAAAAZkDgAAAAAGaA4AAAAABmwOAAAAAAZwDgAAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4A4AAAAABuQOAAAAAAboDgAAAAAEElQMAAAC1AwKWAwAAALUDCJcDAAAAtQMInAMAAI4FtQMiCP4CAACTBQAw_wIAAN8DABCAAwAAkwUAMIEDAQDcBAAhkgNAAOMEACGTA0AA4wQAIaMDAQDcBAAhrQMBANwEACEP_gIAAJQFADD_AgAAyQMAEIADAACUBQAwgQMBANwEACGCAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhqAMBAN0EACG7AwIAlQUAIbwDAQDdBAAhvQMBAN0EACG-AwEA3AQAIb8DAQDdBAAhDQ0AAOgEACA4AADoBAAgOQAA6AQAIIoBAACXBQAgiwEAAOgEACCVAwIAAAABlgMCAAAABZcDAgAAAAWYAwIAAAABmQMCAAAAAZoDAgAAAAGbAwIAAAABnAMCAJYFACENDQAA6AQAIDgAAOgEACA5AADoBAAgigEAAJcFACCLAQAA6AQAIJUDAgAAAAGWAwIAAAAFlwMCAAAABZgDAgAAAAGZAwIAAAABmgMCAAAAAZsDAgAAAAGcAwIAlgUAIQiVAwgAAAABlgMIAAAABZcDCAAAAAWYAwgAAAABmQMIAAAAAZoDCAAAAAGbAwgAAAABnAMIAJcFACEL_gIAAJgFADD_AgAAsQMAEIADAACYBQAwgQMBANwEACGCAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhqAMBAN0EACHAAwEA3QQAIRH-AgAAmQUAMP8CAACZAwAQgAMAAJkFADCBAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhpwMBANwEACGtAwEA3QQAIcEDAQDdBAAhwgMBAN0EACHDAwEA3AQAIcQDAQDdBAAhxgMAAJoFxgMixwMgAOEEACHIA0AA4gQAIQcNAADlBAAgOAAAnAUAIDkAAJwFACCVAwAAAMYDApYDAAAAxgMIlwMAAADGAwicAwAAmwXGAyIHDQAA5QQAIDgAAJwFACA5AACcBQAglQMAAADGAwKWAwAAAMYDCJcDAAAAxgMInAMAAJsFxgMiBJUDAAAAxgMClgMAAADGAwiXAwAAAMYDCJwDAACcBcYDIgv-AgAAnQUAMP8CAAD_AgAQgAMAAJ0FADCBAwEA3AQAIZIDQADjBAAhkwNAAOMEACHAAwEA3QQAIckDAQDcBAAhygMBANwEACHLAwEA3AQAIcwDAgDeBAAhDP4CAACeBQAw_wIAAOkCABCAAwAAngUAMIEDAQDcBAAhggMBANwEACGQAyAA4QQAIZEDQADiBAAhkgNAAOMEACGTA0AA4wQAIagDAQDdBAAhvgMBAN0EACHNAwEA3AQAIQ_-AgAAnwUAMP8CAADRAgAQgAMAAJ8FADCBAwEA3AQAIZIDQADjBAAhkwNAAOMEACGjAwEA3AQAIaUDIADhBAAhqQMBAN0EACHHAyAA4QQAIc4DAQDdBAAhzwMCAJUFACHQAyAA4QQAIdEDIADhBAAh0gMgAOEEACEN_gIAAKAFADD_AgAAuQIAEIADAACgBQAwgQMBANwEACGQAyAA4QQAIZEDQADiBAAhkgNAAOMEACGTA0AA4wQAIacDAQDcBAAhqAMBAN0EACGpAwEA3QQAIdMDAAChBQAg1AMCAN4EACEPDQAA5QQAIDgAAKIFACA5AACiBQAglQOAAAAAAZgDgAAAAAGZA4AAAAABmgOAAAAAAZsDgAAAAAGcA4AAAAABtQMBAAAAAbYDAQAAAAG3AwEAAAABuAOAAAAAAbkDgAAAAAG6A4AAAAABDJUDgAAAAAGYA4AAAAABmQOAAAAAAZoDgAAAAAGbA4AAAAABnAOAAAAAAbUDAQAAAAG2AwEAAAABtwMBAAAAAbgDgAAAAAG5A4AAAAABugOAAAAAAQz-AgAAowUAMP8CAAChAgAQgAMAAKMFADCBAwEA3AQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhpwMBANwEACGpAwEA3QQAIcEDAQDcBAAh1QMBAN0EACEM_gIAAKQFADD_AgAAiQIAEIADAACkBQAwgQMBANwEACGSA0AA4wQAIZMDQADjBAAhqQMBANwEACHVAwAApQXXAyLXAwEA3AQAIdgDAACLBQAg2QMAAKEFACDaAwIA3gQAIQcNAADlBAAgOAAApwUAIDkAAKcFACCVAwAAANcDApYDAAAA1wMIlwMAAADXAwicAwAApgXXAyIHDQAA5QQAIDgAAKcFACA5AACnBQAglQMAAADXAwKWAwAAANcDCJcDAAAA1wMInAMAAKYF1wMiBJUDAAAA1wMClgMAAADXAwiXAwAAANcDCJwDAACnBdcDIg7-AgAAqAUAMP8CAADzAQAQgAMAAKgFADCBAwEA3AQAIZIDQADjBAAhkwNAAOMEACGpAwEA3AQAIdsDAQDdBAAh3AMBAN0EACHdAwIA3gQAId4DAgDeBAAh3wMCAN4EACHgAwIA3gQAIeEDAgDeBAAhEP4CAACpBQAw_wIAAN0BABCAAwAAqQUAMIEDAQDcBAAhkAMgAOEEACGRA0AA4gQAIZIDQADjBAAhkwNAAOMEACGnAwEA3AQAIagDAQDdBAAhrAMAAKoF6AMi4gMBAN0EACHjAwEA3QQAIeQDAQDdBAAh5QMBAN0EACHmAwAAiwUAIAcNAADlBAAgOAAArAUAIDkAAKwFACCVAwAAAOgDApYDAAAA6AMIlwMAAADoAwicAwAAqwXoAyIHDQAA5QQAIDgAAKwFACA5AACsBQAglQMAAADoAwKWAwAAAOgDCJcDAAAA6AMInAMAAKsF6AMiBJUDAAAA6AMClgMAAADoAwiXAwAAAOgDCJwDAACsBegDIhUVAACvBQAgFgAAsAUAIBcAALEFACAYAACyBQAgGQAAswUAIP4CAACtBQAw_wIAADAAEIADAACtBQAwgQMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhqAMBAPcEACGsAwAArgXoAyLiAwEA9wQAIeMDAQD3BAAh5AMBAPcEACHlAwEA9wQAIeYDAACRBQAgBJUDAAAA6AMClgMAAADoAwiXAwAAAOgDCJwDAACsBegDIgOgAwAAMgAgoQMAADIAIKIDAAAyACADoAMAADwAIKEDAAA8ACCiAwAAPAAgA6ADAABBACChAwAAQQAgogMAAEEAIAOgAwAARgAgoQMAAEYAIKIDAABGACADoAMAACwAIKEDAAAsACCiAwAALAAgEP4CAAC0BQAw_wIAAMUBABCAAwAAtAUAMIEDAQDcBAAhkgNAAOMEACGTA0AA4wQAIZQDAQDcBAAh6AMBANwEACHpAwEA3AQAIeoDAQDdBAAh6wMBAN0EACHsAwEA3QQAIe0DQADiBAAh7gNAAOIEACHvAwEA3QQAIfADAQDdBAAhC_4CAAC1BQAw_wIAAK8BABCAAwAAtQUAMIEDAQDcBAAhkgNAAOMEACGTA0AA4wQAIZQDAQDcBAAh8QNAAOMEACHyAwEA3AQAIfMDAQDdBAAh9AMBAN0EACEP_gIAALYFADD_AgAAmQEAEIADAAC2BQAwgQMBANwEACGCAwEA3AQAIYMDAQDcBAAhkAMgAOEEACGRA0AA4gQAIZIDQADjBAAhkwNAAOMEACGsAwAAuAX5AyLiAwEA3QQAIfUDIADhBAAh9wMAALcF9wMi-QMgAOEEACEHDQAA5QQAIDgAALwFACA5AAC8BQAglQMAAAD3AwKWAwAAAPcDCJcDAAAA9wMInAMAALsF9wMiBw0AAOUEACA4AAC6BQAgOQAAugUAIJUDAAAA-QMClgMAAAD5AwiXAwAAAPkDCJwDAAC5BfkDIgcNAADlBAAgOAAAugUAIDkAALoFACCVAwAAAPkDApYDAAAA-QMIlwMAAAD5AwicAwAAuQX5AyIElQMAAAD5AwKWAwAAAPkDCJcDAAAA-QMInAMAALoF-QMiBw0AAOUEACA4AAC8BQAgOQAAvAUAIJUDAAAA9wMClgMAAAD3AwiXAwAAAPcDCJwDAAC7BfcDIgSVAwAAAPcDApYDAAAA9wMIlwMAAAD3AwicAwAAvAX3AyIWBAAAwAUAIAUAAMEFACAGAADCBQAgEAAAwwUAICMAAMQFACAkAADFBQAgJQAAxQUAIP4CAAC9BQAw_wIAAFoAEIADAAC9BQAwgQMBAPYEACGCAwEA9gQAIYMDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGsAwAAvwX5AyLiAwEA9wQAIfUDIAD7BAAh9wMAAL4F9wMi-QMgAPsEACEElQMAAAD3AwKWAwAAAPcDCJcDAAAA9wMInAMAALwF9wMiBJUDAAAA-QMClgMAAAD5AwiXAwAAAPkDCJwDAAC6BfkDIgOgAwAAAwAgoQMAAAMAIKIDAAADACADoAMAAAcAIKEDAAAHACCiAwAABwAgFAMAAP4EACAgAACHBQAgIQAAiAUAICIAAIkFACD-AgAAhgUAMP8CAAALABCAAwAAhgUAMIEDAQD2BAAhggMBAPYEACGDAwEA9gQAIYQDAQD3BAAhhQMBAPcEACGGAwEA9wQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACH_AwAACwAggAQAAAsAIBoDAAD-BAAgDwAA_wQAIP4CAAD1BAAw_wIAACcAEIADAAD1BAAwgQMBAPYEACGCAwEA9gQAIYMDAQD2BAAhhAMBAPcEACGFAwEA9wQAIYYDAQD3BAAhhwMBAPYEACGIAwIA-AQAIYoDAAD5BIoDIosDAQD2BAAhjAMBAPcEACGNAwEA9gQAIY4DAQD2BAAhjwMIAPoEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIZQDAQD2BAAh_wMAACcAIIAEAAAnACARAwAA_gQAIP4CAADHBQAw_wIAAGYAEIADAADHBQAwgQMBAPYEACGCAwEA9gQAIYMDAQD2BAAhhAMBAPcEACGFAwEA9wQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACH3AwAAvgX3AyL_AwAAZgAggAQAAGYAIAOgAwAAVgAgoQMAAFYAIKIDAABWACAO_gIAAMYFADD_AgAAgQEAEIADAADGBQAwgQMBANwEACGCAwEA3AQAIYMDAQDcBAAhhAMBAN0EACGFAwEA3QQAIZADIADhBAAhkQNAAOIEACGSA0AA4wQAIZMDQADjBAAhlAMBANwEACH3AwAAtwX3AyIPAwAA_gQAIP4CAADHBQAw_wIAAGYAEIADAADHBQAwgQMBAPYEACGCAwEA9gQAIYMDAQD2BAAhhAMBAPcEACGFAwEA9wQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACH3AwAAvgX3AyIUGgAAywUAIB0AAP4EACAeAADKBQAg_gIAAMgFADD_AgAAVgAQgAMAAMgFADCBAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhpwMBAPYEACGtAwEA9wQAIcEDAQD3BAAhwgMBAPcEACHDAwEA9gQAIcQDAQD3BAAhxgMAAMkFxgMixwMgAPsEACHIA0AA_AQAIQSVAwAAAMYDApYDAAAAxgMIlwMAAADGAwicAwAAnAXGAyIYBAAAwAUAIAUAAMEFACAGAADCBQAgEAAAwwUAICMAAMQFACAkAADFBQAgJQAAxQUAIP4CAAC9BQAw_wIAAFoAEIADAAC9BQAwgQMBAPYEACGCAwEA9gQAIYMDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGsAwAAvwX5AyLiAwEA9wQAIfUDIAD7BAAh9wMAAL4F9wMi-QMgAPsEACH_AwAAWgAggAQAAFoAIBYKAADlBQAgEAAAwwUAIBEAAIcFACAZAACzBQAgHwAAxQUAIP4CAADkBQAw_wIAABYAEIADAADkBQAwgQMBAPYEACGCAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhqAMBAPcEACG7AwIA1wUAIbwDAQD3BAAhvQMBAPcEACG-AwEA9gQAIb8DAQD3BAAh_wMAABYAIIAEAAAWACACowMBAAAAAaQDAQAAAAEMBgAAzgUAIBsAAM8FACD-AgAAzQUAMP8CAABRABCAAwAAzQUAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIaMDAQD2BAAhpAMBAPYEACGlAyAA-wQAIaYDQAD8BAAhFAMAAP4EACAgAACHBQAgIQAAiAUAICIAAIkFACD-AgAAhgUAMP8CAAALABCAAwAAhgUAMIEDAQD2BAAhggMBAPYEACGDAwEA9gQAIYQDAQD3BAAhhQMBAPcEACGGAwEA9wQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACH_AwAACwAggAQAAAsAIBQSAADUBQAgGgAAywUAIBwAAIgFACD-AgAA2wUAMP8CAAAsABCAAwAA2wUAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhqQMBAPcEACGqA0AA_AQAIawDAADcBawDIq0DAQD3BAAhrgMBAPcEACH_AwAALAAggAQAACwAIA8SAADRBQAg_gIAANAFADD_AgAARgAQgAMAANAFADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGpAwEA9gQAIdsDAQD3BAAh3AMBAPcEACHdAwIA-AQAId4DAgD4BAAh3wMCAPgEACHgAwIA-AQAIeEDAgD4BAAhFxUAAK8FACAWAACwBQAgFwAAsQUAIBgAALIFACAZAACzBQAg_gIAAK0FADD_AgAAMAAQgAMAAK0FADCBAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhpwMBAPYEACGoAwEA9wQAIawDAACuBegDIuIDAQD3BAAh4wMBAPcEACHkAwEA9wQAIeUDAQD3BAAh5gMAAJEFACD_AwAAMAAggAQAADAAIA4SAADUBQAg_gIAANIFADD_AgAAQQAQgAMAANIFADCBAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhpwMBAPYEACGoAwEA9wQAIakDAQD3BAAh0wMAANMFACDUAwIA-AQAIQyVA4AAAAABmAOAAAAAAZkDgAAAAAGaA4AAAAABmwOAAAAAAZwDgAAAAAG1AwEAAAABtgMBAAAAAbcDAQAAAAG4A4AAAAABuQOAAAAAAboDgAAAAAEXFQAArwUAIBYAALAFACAXAACxBQAgGAAAsgUAIBkAALMFACD-AgAArQUAMP8CAAAwABCAAwAArQUAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhrAMAAK4F6AMi4gMBAPcEACHjAwEA9wQAIeQDAQD3BAAh5QMBAPcEACHmAwAAkQUAIP8DAAAwACCABAAAMAAgDRIAANQFACD-AgAA1QUAMP8CAAA8ABCAAwAA1QUAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIakDAQD3BAAhwQMBAPYEACHVAwEA9wQAIREGAADOBQAgEwAA2AUAIP4CAADWBQAw_wIAADYAEIADAADWBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhowMBAPYEACGlAyAA-wQAIakDAQD3BAAhxwMgAPsEACHOAwEA9wQAIc8DAgDXBQAh0AMgAPsEACHRAyAA-wQAIdIDIAD7BAAhCJUDAgAAAAGWAwIAAAAFlwMCAAAABZgDAgAAAAGZAwIAAAABmgMCAAAAAZsDAgAAAAGcAwIA6AQAIRASAADRBQAgFAAAiQUAIP4CAADZBQAw_wIAADIAEIADAADZBQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhqQMBAPYEACHVAwAA2gXXAyLXAwEA9gQAIdgDAACRBQAg2QMAANMFACDaAwIA-AQAIf8DAAAyACCABAAAMgAgDhIAANEFACAUAACJBQAg_gIAANkFADD_AgAAMgAQgAMAANkFADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGpAwEA9gQAIdUDAADaBdcDItcDAQD2BAAh2AMAAJEFACDZAwAA0wUAINoDAgD4BAAhBJUDAAAA1wMClgMAAADXAwiXAwAAANcDCJwDAACnBdcDIhISAADUBQAgGgAAywUAIBwAAIgFACD-AgAA2wUAMP8CAAAsABCAAwAA2wUAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhqQMBAPcEACGqA0AA_AQAIawDAADcBawDIq0DAQD3BAAhrgMBAPcEACEElQMAAACsAwKWAwAAAKwDCJcDAAAArAMInAMAAIQFrAMiAskDAQAAAAHKAwEAAAABDAsAAN8FACD-AgAA3gUAMP8CAAAfABCAAwAA3gUAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIcADAQD3BAAhyQMBAPYEACHKAwEA9gQAIcsDAQD2BAAhzAMCAPgEACEQCgAA4QUAIAwAAOIFACD-AgAA4AUAMP8CAAAaABCAAwAA4AUAMIEDAQD2BAAhggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhvgMBAPcEACHNAwEA9gQAIf8DAAAaACCABAAAGgAgDgoAAOEFACAMAADiBQAg_gIAAOAFADD_AgAAGgAQgAMAAOAFADCBAwEA9gQAIYIDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGoAwEA9wQAIb4DAQD3BAAhzQMBAPYEACERBwAA4QUAIAgAAOcFACAJAAD_BAAgDgAA6AUAIP4CAADmBQAw_wIAABEAEIADAADmBQAwgQMBAPYEACGCAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhqAMBAPcEACHAAwEA9wQAIf8DAAARACCABAAAEQAgA6ADAAAfACChAwAAHwAgogMAAB8AIAOCAwEAAAABvQMBAAAAAb4DAQAAAAEUCgAA5QUAIBAAAMMFACARAACHBQAgGQAAswUAIB8AAMUFACD-AgAA5AUAMP8CAAAWABCAAwAA5AUAMIEDAQD2BAAhggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhuwMCANcFACG8AwEA9wQAIb0DAQD3BAAhvgMBAPYEACG_AwEA9wQAIREHAADhBQAgCAAA5wUAIAkAAP8EACAOAADoBQAg_gIAAOYFADD_AgAAEQAQgAMAAOYFADCBAwEA9gQAIYIDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGoAwEA9wQAIcADAQD3BAAh_wMAABEAIIAEAAARACAPBwAA4QUAIAgAAOcFACAJAAD_BAAgDgAA6AUAIP4CAADmBQAw_wIAABEAEIADAADmBQAwgQMBAPYEACGCAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhqAMBAPcEACHAAwEA9wQAIQOgAwAAEQAgoQMAABEAIKIDAAARACADoAMAABoAIKEDAAAaACCiAwAAGgAgAqMDAQAAAAGtAwEAAAABCgYAAM4FACAaAADrBQAg_gIAAOoFADD_AgAADQAQgAMAAOoFADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGjAwEA9gQAIa0DAQD2BAAhFgoAAOUFACAQAADDBQAgEQAAhwUAIBkAALMFACAfAADFBQAg_gIAAOQFADD_AgAAFgAQgAMAAOQFADCBAwEA9gQAIYIDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGoAwEA9wQAIbsDAgDXBQAhvAMBAPcEACG9AwEA9wQAIb4DAQD2BAAhvwMBAPcEACH_AwAAFgAggAQAABYAIALoAwEAAAAB6QMBAAAAAREDAAD-BAAg_gIAAO0FADD_AgAABwAQgAMAAO0FADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGUAwEA9gQAIegDAQD2BAAh6QMBAPYEACHqAwEA9wQAIesDAQD3BAAh7AMBAPcEACHtA0AA_AQAIe4DQAD8BAAh7wMBAPcEACHwAwEA9wQAIQwDAAD-BAAg_gIAAO4FADD_AgAAAwAQgAMAAO4FADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGUAwEA9gQAIfEDQAD9BAAh8gMBAPYEACHzAwEA9wQAIfQDAQD3BAAhAAAAAAAAAYQEAQAAAAEBhAQBAAAAAQWEBAIAAAABigQCAAAAAYsEAgAAAAGMBAIAAAABjQQCAAAAAQGEBAAAAIoDAgWEBAgAAAABigQIAAAAAYsECAAAAAGMBAgAAAABjQQIAAAAAQGEBCAAAAABAYQEQAAAAAEBhARAAAAAAQUyAAC5CgAgMwAA3woAIIEEAAC6CgAgggQAAN4KACCHBAAAhAEAIAsyAAD_BQAwMwAAhAYAMIEEAACABgAwggQAAIEGADCDBAAAggYAIIQEAACDBgAwhQQAAIMGADCGBAAAgwYAMIcEAACDBgAwiAQAAIUGADCJBAAAhgYAMA8KAADOBgAgEQAAzwYAIBkAANAGACAfAADRBgAggQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAbsDAgAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAECAAAAGAAgMgAAzQYAIAMAAAAYACAyAADNBgAgMwAAigYAIAErAADdCgAwFQoAAOUFACAQAADDBQAgEQAAhwUAIBkAALMFACAfAADFBQAg_gIAAOQFADD_AgAAFgAQgAMAAOQFADCBAwEAAAABggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhuwMCANcFACG8AwEA9wQAIb0DAQD3BAAhvgMBAPYEACG_AwEA9wQAIfwDAADjBQAgAgAAABgAICsAAIoGACACAAAAhwYAICsAAIgGACAP_gIAAIYGADD_AgAAhwYAEIADAACGBgAwgQMBAPYEACGCAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhqAMBAPcEACG7AwIA1wUAIbwDAQD3BAAhvQMBAPcEACG-AwEA9gQAIb8DAQD3BAAhD_4CAACGBgAw_wIAAIcGABCAAwAAhgYAMIEDAQD2BAAhggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhuwMCANcFACG8AwEA9wQAIb0DAQD3BAAhvgMBAPYEACG_AwEA9wQAIQuBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIbsDAgCJBgAhvAMBAPYFACG9AwEA9gUAIb4DAQD1BQAhBYQEAgAAAAGKBAIAAAABiwQCAAAAAYwEAgAAAAGNBAIAAAABDwoAAIsGACARAACMBgAgGQAAjQYAIB8AAI4GACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIbsDAgCJBgAhvAMBAPYFACG9AwEA9gUAIb4DAQD1BQAhBTIAALsKACAzAADbCgAggQQAALwKACCCBAAA2goAIIcEAAAUACALMgAAvwYAMDMAAMQGADCBBAAAwAYAMIIEAADBBgAwgwQAAMIGACCEBAAAwwYAMIUEAADDBgAwhgQAAMMGADCHBAAAwwYAMIgEAADFBgAwiQQAAMYGADALMgAAoAYAMDMAAKUGADCBBAAAoQYAMIIEAACiBgAwgwQAAKMGACCEBAAApAYAMIUEAACkBgAwhgQAAKQGADCHBAAApAYAMIgEAACmBgAwiQQAAKcGADALMgAAjwYAMDMAAJQGADCBBAAAkAYAMIIEAACRBgAwgwQAAJIGACCEBAAAkwYAMIUEAACTBgAwhgQAAJMGADCHBAAAkwYAMIgEAACVBgAwiQQAAJYGADAPHQAAngYAIB4AAJ8GACCBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAHBAwEAAAABwgMBAAAAAcMDAQAAAAHEAwEAAAABxgMAAADGAwLHAyAAAAAByANAAAAAAQIAAABYACAyAACdBgAgAwAAAFgAIDIAAJ0GACAzAACaBgAgASsAANkKADAUGgAAywUAIB0AAP4EACAeAADKBQAg_gIAAMgFADD_AgAAVgAQgAMAAMgFADCBAwEAAAABkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIa0DAQD3BAAhwQMBAPcEACHCAwEA9wQAIcMDAQD2BAAhxAMBAPcEACHGAwAAyQXGAyLHAyAA-wQAIcgDQAD8BAAhAgAAAFgAICsAAJoGACACAAAAlwYAICsAAJgGACAR_gIAAJYGADD_AgAAlwYAEIADAACWBgAwgQMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhrQMBAPcEACHBAwEA9wQAIcIDAQD3BAAhwwMBAPYEACHEAwEA9wQAIcYDAADJBcYDIscDIAD7BAAhyANAAPwEACER_gIAAJYGADD_AgAAlwYAEIADAACWBgAwgQMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhrQMBAPcEACHBAwEA9wQAIcIDAQD3BAAhwwMBAPYEACHEAwEA9wQAIcYDAADJBcYDIscDIAD7BAAhyANAAPwEACENgQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhwQMBAPYFACHCAwEA9gUAIcMDAQD1BQAhxAMBAPYFACHGAwAAmQbGAyLHAyAA-gUAIcgDQAD7BQAhAYQEAAAAxgMCDx0AAJsGACAeAACcBgAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhwQMBAPYFACHCAwEA9gUAIcMDAQD1BQAhxAMBAPYFACHGAwAAmQbGAyLHAyAA-gUAIcgDQAD7BQAhBTIAANEKACAzAADXCgAggQQAANIKACCCBAAA1goAIIcEAACEAQAgBzIAAM8KACAzAADUCgAggQQAANAKACCCBAAA0woAIIUEAABaACCGBAAAWgAghwQAAIQBACAPHQAAngYAIB4AAJ8GACCBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAHBAwEAAAABwgMBAAAAAcMDAQAAAAHEAwEAAAABxgMAAADGAwLHAyAAAAAByANAAAAAAQMyAADRCgAggQQAANIKACCHBAAAhAEAIAMyAADPCgAggQQAANAKACCHBAAAhAEAIA0SAAC9BgAgHAAAvgYAIIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgNAAAAAAawDAAAArAMCrgMBAAAAAQIAAAAuACAyAAC8BgAgAwAAAC4AIDIAALwGACAzAACrBgAgASsAAM4KADASEgAA1AUAIBoAAMsFACAcAACIBQAg_gIAANsFADD_AgAALAAQgAMAANsFADCBAwEAAAABkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhqQMBAPcEACGqA0AA_AQAIawDAADcBawDIq0DAQD3BAAhrgMBAPcEACECAAAALgAgKwAAqwYAIAIAAACoBgAgKwAAqQYAIA_-AgAApwYAMP8CAACoBgAQgAMAAKcGADCBAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhpwMBAPYEACGoAwEA9wQAIakDAQD3BAAhqgNAAPwEACGsAwAA3AWsAyKtAwEA9wQAIa4DAQD3BAAhD_4CAACnBgAw_wIAAKgGABCAAwAApwYAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhqQMBAPcEACGqA0AA_AQAIawDAADcBawDIq0DAQD3BAAhrgMBAPcEACELgQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGpAwEA9gUAIaoDQAD7BQAhrAMAAKoGrAMirgMBAPYFACEBhAQAAACsAwINEgAArAYAIBwAAK0GACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIakDAQD2BQAhqgNAAPsFACGsAwAAqgasAyKuAwEA9gUAIQcyAADDCgAgMwAAzAoAIIEEAADECgAgggQAAMsKACCFBAAAMAAghgQAADAAIIcEAADIAQAgCzIAAK4GADAzAACzBgAwgQQAAK8GADCCBAAAsAYAMIMEAACxBgAghAQAALIGADCFBAAAsgYAMIYEAACyBgAwhwQAALIGADCIBAAAtAYAMIkEAAC1BgAwBwYAALsGACCBAwEAAAABkgNAAAAAAZMDQAAAAAGjAwEAAAABpQMgAAAAAaYDQAAAAAECAAAAUwAgMgAAugYAIAMAAABTACAyAAC6BgAgMwAAuAYAIAErAADKCgAwDQYAAM4FACAbAADPBQAg_gIAAM0FADD_AgAAUQAQgAMAAM0FADCBAwEAAAABkgNAAP0EACGTA0AA_QQAIaMDAQD2BAAhpAMBAPYEACGlAyAA-wQAIaYDQAD8BAAh-gMAAMwFACACAAAAUwAgKwAAuAYAIAIAAAC2BgAgKwAAtwYAIAr-AgAAtQYAMP8CAAC2BgAQgAMAALUGADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGjAwEA9gQAIaQDAQD2BAAhpQMgAPsEACGmA0AA_AQAIQr-AgAAtQYAMP8CAAC2BgAQgAMAALUGADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGjAwEA9gQAIaQDAQD2BAAhpQMgAPsEACGmA0AA_AQAIQaBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGjAwEA9QUAIaUDIAD6BQAhpgNAAPsFACEHBgAAuQYAIIEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIaMDAQD1BQAhpQMgAPoFACGmA0AA-wUAIQUyAADFCgAgMwAAyAoAIIEEAADGCgAgggQAAMcKACCHBAAA-wMAIAcGAAC7BgAggQMBAAAAAZIDQAAAAAGTA0AAAAABowMBAAAAAaUDIAAAAAGmA0AAAAABAzIAAMUKACCBBAAAxgoAIIcEAAD7AwAgDRIAAL0GACAcAAC-BgAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAakDAQAAAAGqA0AAAAABrAMAAACsAwKuAwEAAAABAzIAAMMKACCBBAAAxAoAIIcEAADIAQAgBDIAAK4GADCBBAAArwYAMIMEAACxBgAghwQAALIGADAFBgAAzAYAIIEDAQAAAAGSA0AAAAABkwNAAAAAAaMDAQAAAAECAAAADwAgMgAAywYAIAMAAAAPACAyAADLBgAgMwAAyQYAIAErAADCCgAwCwYAAM4FACAaAADrBQAg_gIAAOoFADD_AgAADQAQgAMAAOoFADCBAwEAAAABkgNAAP0EACGTA0AA_QQAIaMDAQD2BAAhrQMBAPYEACH9AwAA6QUAIAIAAAAPACArAADJBgAgAgAAAMcGACArAADIBgAgCP4CAADGBgAw_wIAAMcGABCAAwAAxgYAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIaMDAQD2BAAhrQMBAPYEACEI_gIAAMYGADD_AgAAxwYAEIADAADGBgAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhowMBAPYEACGtAwEA9gQAIQSBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGjAwEA9QUAIQUGAADKBgAggQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhowMBAPUFACEFMgAAvQoAIDMAAMAKACCBBAAAvgoAIIIEAAC_CgAghwQAAPsDACAFBgAAzAYAIIEDAQAAAAGSA0AAAAABkwNAAAAAAaMDAQAAAAEDMgAAvQoAIIEEAAC-CgAghwQAAPsDACAPCgAAzgYAIBEAAM8GACAZAADQBgAgHwAA0QYAIIEDAQAAAAGCAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAagDAQAAAAG7AwIAAAABvAMBAAAAAb0DAQAAAAG-AwEAAAABAzIAALsKACCBBAAAvAoAIIcEAAAUACAEMgAAvwYAMIEEAADABgAwgwQAAMIGACCHBAAAwwYAMAQyAACgBgAwgQQAAKEGADCDBAAAowYAIIcEAACkBgAwBDIAAI8GADCBBAAAkAYAMIMEAACSBgAghwQAAJMGADADMgAAuQoAIIEEAAC6CgAghwQAAIQBACAEMgAA_wUAMIEEAACABgAwgwQAAIIGACCHBAAAgwYAMAkEAAC6CQAgBQAAuwkAIAYAALwJACAQAAC9CQAgIwAAvgkAICQAAL8JACAlAAC_CQAgkQMAAO8FACDiAwAA7wUAIAAAAAAFMgAAtAoAIDMAALcKACCBBAAAtQoAIIIEAAC2CgAghwQAAC4AIAMyAAC0CgAggQQAALUKACCHBAAALgAgAAAABzIAAK8KACAzAACyCgAggQQAALAKACCCBAAAsQoAIIUEAAAWACCGBAAAFgAghwQAABgAIAMyAACvCgAggQQAALAKACCHBAAAGAAgAAAABTIAAJ0KACAzAACtCgAggQQAAJ4KACCCBAAArAoAIIcEAACEAQAgCzIAAP4GADAzAACCBwAwgQQAAP8GADCCBAAAgAcAMIMEAACBBwAghAQAAMMGADCFBAAAwwYAMIYEAADDBgAwhwQAAMMGADCIBAAAgwcAMIkEAADGBgAwCzIAAPUGADAzAAD5BgAwgQQAAPYGADCCBAAA9wYAMIMEAAD4BgAghAQAALIGADCFBAAAsgYAMIYEAACyBgAwhwQAALIGADCIBAAA-gYAMIkEAAC1BgAwCzIAAOcGADAzAADsBgAwgQQAAOgGADCCBAAA6QYAMIMEAADqBgAghAQAAOsGADCFBAAA6wYAMIYEAADrBgAwhwQAAOsGADCIBAAA7QYAMIkEAADuBgAwDBMAAPQGACCBAwEAAAABkgNAAAAAAZMDQAAAAAGlAyAAAAABqQMBAAAAAccDIAAAAAHOAwEAAAABzwMCAAAAAdADIAAAAAHRAyAAAAAB0gMgAAAAAQIAAAA4ACAyAADzBgAgAwAAADgAIDIAAPMGACAzAADxBgAgASsAAKsKADARBgAAzgUAIBMAANgFACD-AgAA1gUAMP8CAAA2ABCAAwAA1gUAMIEDAQAAAAGSA0AA_QQAIZMDQAD9BAAhowMBAPYEACGlAyAA-wQAIakDAQD3BAAhxwMgAPsEACHOAwEA9wQAIc8DAgDXBQAh0AMgAPsEACHRAyAA-wQAIdIDIAD7BAAhAgAAADgAICsAAPEGACACAAAA7wYAICsAAPAGACAP_gIAAO4GADD_AgAA7wYAEIADAADuBgAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhowMBAPYEACGlAyAA-wQAIakDAQD3BAAhxwMgAPsEACHOAwEA9wQAIc8DAgDXBQAh0AMgAPsEACHRAyAA-wQAIdIDIAD7BAAhD_4CAADuBgAw_wIAAO8GABCAAwAA7gYAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIaMDAQD2BAAhpQMgAPsEACGpAwEA9wQAIccDIAD7BAAhzgMBAPcEACHPAwIA1wUAIdADIAD7BAAh0QMgAPsEACHSAyAA-wQAIQuBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGlAyAA-gUAIakDAQD2BQAhxwMgAPoFACHOAwEA9gUAIc8DAgCJBgAh0AMgAPoFACHRAyAA-gUAIdIDIAD6BQAhDBMAAPIGACCBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACGlAyAA-gUAIakDAQD2BQAhxwMgAPoFACHOAwEA9gUAIc8DAgCJBgAh0AMgAPoFACHRAyAA-gUAIdIDIAD6BQAhBzIAAKYKACAzAACpCgAggQQAAKcKACCCBAAAqAoAIIUEAAAyACCGBAAAMgAghwQAADQAIAwTAAD0BgAggQMBAAAAAZIDQAAAAAGTA0AAAAABpQMgAAAAAakDAQAAAAHHAyAAAAABzgMBAAAAAc8DAgAAAAHQAyAAAAAB0QMgAAAAAdIDIAAAAAEDMgAApgoAIIEEAACnCgAghwQAADQAIAcbAADaBgAggQMBAAAAAZIDQAAAAAGTA0AAAAABpAMBAAAAAaUDIAAAAAGmA0AAAAABAgAAAFMAIDIAAP0GACADAAAAUwAgMgAA_QYAIDMAAPwGACABKwAApQoAMAIAAABTACArAAD8BgAgAgAAALYGACArAAD7BgAgBoEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIaQDAQD1BQAhpQMgAPoFACGmA0AA-wUAIQcbAADZBgAggQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhpAMBAPUFACGlAyAA-gUAIaYDQAD7BQAhBxsAANoGACCBAwEAAAABkgNAAAAAAZMDQAAAAAGkAwEAAAABpQMgAAAAAaYDQAAAAAEFGgAAiAcAIIEDAQAAAAGSA0AAAAABkwNAAAAAAa0DAQAAAAECAAAADwAgMgAAhwcAIAMAAAAPACAyAACHBwAgMwAAhQcAIAErAACkCgAwAgAAAA8AICsAAIUHACACAAAAxwYAICsAAIQHACAEgQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhrQMBAPUFACEFGgAAhgcAIIEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIa0DAQD1BQAhBTIAAJ8KACAzAACiCgAggQQAAKAKACCCBAAAoQoAIIcEAAAYACAFGgAAiAcAIIEDAQAAAAGSA0AAAAABkwNAAAAAAa0DAQAAAAEDMgAAnwoAIIEEAACgCgAghwQAABgAIAMyAACdCgAggQQAAJ4KACCHBAAAhAEAIAQyAAD-BgAwgQQAAP8GADCDBAAAgQcAIIcEAADDBgAwBDIAAPUGADCBBAAA9gYAMIMEAAD4BgAghwQAALIGADAEMgAA5wYAMIEEAADoBgAwgwQAAOoGACCHBAAA6wYAMAAAAAAAAAAAAYQEAAAAtQMCAAAAAAAAAAAHMgAAmAoAIDMAAJsKACCBBAAAmQoAIIIEAACaCgAghQQAACcAIIYEAAAnACCHBAAAwwQAIAMyAACYCgAggQQAAJkKACCHBAAAwwQAIAAAAAcyAACPCgAgMwAAlgoAIIEEAACQCgAgggQAAJUKACCFBAAAEQAghgQAABEAIIcEAAAUACALMgAAygcAMDMAAM8HADCBBAAAywcAMIIEAADMBwAwgwQAAM0HACCEBAAAzgcAMIUEAADOBwAwhgQAAM4HADCHBAAAzgcAMIgEAADQBwAwiQQAANEHADALMgAAwQcAMDMAAMUHADCBBAAAwgcAMIIEAADDBwAwgwQAAMQHACCEBAAAgwYAMIUEAACDBgAwhgQAAIMGADCHBAAAgwYAMIgEAADGBwAwiQQAAIYGADALMgAApwcAMDMAAKwHADCBBAAAqAcAMIIEAACpBwAwgwQAAKoHACCEBAAAqwcAMIUEAACrBwAwhgQAAKsHADCHBAAAqwcAMIgEAACtBwAwiQQAAK4HADAJDAAAwAcAIIEDAQAAAAGCAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAagDAQAAAAHNAwEAAAABAgAAABwAIDIAAL8HACADAAAAHAAgMgAAvwcAIDMAALEHACABKwAAlAoAMA4KAADhBQAgDAAA4gUAIP4CAADgBQAw_wIAABoAEIADAADgBQAwgQMBAAAAAYIDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGoAwEA9wQAIb4DAQD3BAAhzQMBAAAAAQIAAAAcACArAACxBwAgAgAAAK8HACArAACwBwAgDP4CAACuBwAw_wIAAK8HABCAAwAArgcAMIEDAQD2BAAhggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhvgMBAPcEACHNAwEA9gQAIQz-AgAArgcAMP8CAACvBwAQgAMAAK4HADCBAwEA9gQAIYIDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGoAwEA9wQAIb4DAQD3BAAhzQMBAPYEACEIgQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACHNAwEA9QUAIQkMAACyBwAggQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACHNAwEA9QUAIQsyAACzBwAwMwAAuAcAMIEEAAC0BwAwggQAALUHADCDBAAAtgcAIIQEAAC3BwAwhQQAALcHADCGBAAAtwcAMIcEAAC3BwAwiAQAALkHADCJBAAAugcAMAeBAwEAAAABkgNAAAAAAZMDQAAAAAHAAwEAAAABygMBAAAAAcsDAQAAAAHMAwIAAAABAgAAACEAIDIAAL4HACADAAAAIQAgMgAAvgcAIDMAAL0HACABKwAAkwoAMA0LAADfBQAg_gIAAN4FADD_AgAAHwAQgAMAAN4FADCBAwEAAAABkgNAAP0EACGTA0AA_QQAIcADAQD3BAAhyQMBAPYEACHKAwEA9gQAIcsDAQD2BAAhzAMCAPgEACH7AwAA3QUAIAIAAAAhACArAAC9BwAgAgAAALsHACArAAC8BwAgC_4CAAC6BwAw_wIAALsHABCAAwAAugcAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIcADAQD3BAAhyQMBAPYEACHKAwEA9gQAIcsDAQD2BAAhzAMCAPgEACEL_gIAALoHADD_AgAAuwcAEIADAAC6BwAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhwAMBAPcEACHJAwEA9gQAIcoDAQD2BAAhywMBAPYEACHMAwIA-AQAIQeBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACHAAwEA9gUAIcoDAQD1BQAhywMBAPUFACHMAwIA9wUAIQeBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACHAAwEA9gUAIcoDAQD1BQAhywMBAPUFACHMAwIA9wUAIQeBAwEAAAABkgNAAAAAAZMDQAAAAAHAAwEAAAABygMBAAAAAcsDAQAAAAHMAwIAAAABCQwAAMAHACCBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABzQMBAAAAAQQyAACzBwAwgQQAALQHADCDBAAAtgcAIIcEAAC3BwAwDxAAAJ8HACARAADPBgAgGQAA0AYAIB8AANEGACCBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABuwMCAAAAAbwDAQAAAAG9AwEAAAABvwMBAAAAAQIAAAAYACAyAADJBwAgAwAAABgAIDIAAMkHACAzAADIBwAgASsAAJIKADACAAAAGAAgKwAAyAcAIAIAAACHBgAgKwAAxwcAIAuBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIbsDAgCJBgAhvAMBAPYFACG9AwEA9gUAIb8DAQD2BQAhDxAAAJ4HACARAACMBgAgGQAAjQYAIB8AAI4GACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIbsDAgCJBgAhvAMBAPYFACG9AwEA9gUAIb8DAQD2BQAhDxAAAJ8HACARAADPBgAgGQAA0AYAIB8AANEGACCBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABuwMCAAAAAbwDAQAAAAG9AwEAAAABvwMBAAAAAQoIAADWBwAgCQAA1wcAIA4AANgHACCBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABAgAAABQAIDIAANUHACADAAAAFAAgMgAA1QcAIDMAANQHACABKwAAkQoAMA8HAADhBQAgCAAA5wUAIAkAAP8EACAOAADoBQAg_gIAAOYFADD_AgAAEQAQgAMAAOYFADCBAwEAAAABggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhwAMBAPcEACECAAAAFAAgKwAA1AcAIAIAAADSBwAgKwAA0wcAIAv-AgAA0QcAMP8CAADSBwAQgAMAANEHADCBAwEA9gQAIYIDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGoAwEA9wQAIcADAQD3BAAhC_4CAADRBwAw_wIAANIHABCAAwAA0QcAMIEDAQD2BAAhggMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIagDAQD3BAAhwAMBAPcEACEHgQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACEKCAAApAcAIAkAAKUHACAOAACmBwAggQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACEKCAAA1gcAIAkAANcHACAOAADYBwAggQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAQQyAADKBwAwgQQAAMsHADCDBAAAzQcAIIcEAADOBwAwBDIAAMEHADCBBAAAwgcAMIMEAADEBwAghwQAAIMGADAEMgAApwcAMIEEAACoBwAwgwQAAKoHACCHBAAAqwcAMAMyAACPCgAggQQAAJAKACCHBAAAFAAgAAAABzIAAIoKACAzAACNCgAggQQAAIsKACCCBAAAjAoAIIUEAAAWACCGBAAAFgAghwQAABgAIAMyAACKCgAggQQAAIsKACCHBAAAGAAgAAAAAAAFMgAAhQoAIDMAAIgKACCBBAAAhgoAIIIEAACHCgAghwQAABwAIAMyAACFCgAggQQAAIYKACCHBAAAHAAgAAAABzIAAIAKACAzAACDCgAggQQAAIEKACCCBAAAggoAIIUEAAARACCGBAAAEQAghwQAABQAIAMyAACACgAggQQAAIEKACCHBAAAFAAgAAAAAAAFMgAA-wkAIDMAAP4JACCBBAAA_AkAIIIEAAD9CQAghwQAAPsDACADMgAA-wkAIIEEAAD8CQAghwQAAPsDACAAAAAAAAcyAAD2CQAgMwAA-QkAIIEEAAD3CQAgggQAAPgJACCFBAAAMAAghgQAADAAIIcEAADIAQAgAzIAAPYJACCBBAAA9wkAIIcEAADIAQAgAAAABzIAAPEJACAzAAD0CQAggQQAAPIJACCCBAAA8wkAIIUEAAAwACCGBAAAMAAghwQAAMgBACADMgAA8QkAIIEEAADyCQAghwQAAMgBACAAAAAAAAGEBAAAANcDAgUyAADrCQAgMwAA7wkAIIEEAADsCQAgggQAAO4JACCHBAAAyAEAIAsyAACGCAAwMwAAiggAMIEEAACHCAAwggQAAIgIADCDBAAAiQgAIIQEAADrBgAwhQQAAOsGADCGBAAA6wYAMIcEAADrBgAwiAQAAIsIADCJBAAA7gYAMAwGAADxBwAggQMBAAAAAZIDQAAAAAGTA0AAAAABowMBAAAAAaUDIAAAAAGpAwEAAAABxwMgAAAAAc8DAgAAAAHQAyAAAAAB0QMgAAAAAdIDIAAAAAECAAAAOAAgMgAAjggAIAMAAAA4ACAyAACOCAAgMwAAjQgAIAErAADtCQAwAgAAADgAICsAAI0IACACAAAA7wYAICsAAIwIACALgQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhowMBAPUFACGlAyAA-gUAIakDAQD2BQAhxwMgAPoFACHPAwIAiQYAIdADIAD6BQAh0QMgAPoFACHSAyAA-gUAIQwGAADwBwAggQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhowMBAPUFACGlAyAA-gUAIakDAQD2BQAhxwMgAPoFACHPAwIAiQYAIdADIAD6BQAh0QMgAPoFACHSAyAA-gUAIQwGAADxBwAggQMBAAAAAZIDQAAAAAGTA0AAAAABowMBAAAAAaUDIAAAAAGpAwEAAAABxwMgAAAAAc8DAgAAAAHQAyAAAAAB0QMgAAAAAdIDIAAAAAEDMgAA6wkAIIEEAADsCQAghwQAAMgBACAEMgAAhggAMIEEAACHCAAwgwQAAIkIACCHBAAA6wYAMAAAAAAABTIAAOYJACAzAADpCQAggQQAAOcJACCCBAAA6AkAIIcEAADIAQAgAzIAAOYJACCBBAAA5wkAIIcEAADIAQAgAAAAAYQEAAAA6AMCCzIAAM4IADAzAADTCAAwgQQAAM8IADCCBAAA0AgAMIMEAADRCAAghAQAANIIADCFBAAA0ggAMIYEAADSCAAwhwQAANIIADCIBAAA1AgAMIkEAADVCAAwCzIAAMIIADAzAADHCAAwgQQAAMMIADCCBAAAxAgAMIMEAADFCAAghAQAAMYIADCFBAAAxggAMIYEAADGCAAwhwQAAMYIADCIBAAAyAgAMIkEAADJCAAwCzIAALYIADAzAAC7CAAwgQQAALcIADCCBAAAuAgAMIMEAAC5CAAghAQAALoIADCFBAAAuggAMIYEAAC6CAAwhwQAALoIADCIBAAAvAgAMIkEAAC9CAAwCzIAAKoIADAzAACvCAAwgQQAAKsIADCCBAAArAgAMIMEAACtCAAghAQAAK4IADCFBAAArggAMIYEAACuCAAwhwQAAK4IADCIBAAAsAgAMIkEAACxCAAwCzIAAKEIADAzAAClCAAwgQQAAKIIADCCBAAAowgAMIMEAACkCAAghAQAAKQGADCFBAAApAYAMIYEAACkBgAwhwQAAKQGADCIBAAApggAMIkEAACnBgAwDRoAAN8GACAcAAC-BgAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAaoDQAAAAAGsAwAAAKwDAq0DAQAAAAGuAwEAAAABAgAAAC4AIDIAAKkIACADAAAALgAgMgAAqQgAIDMAAKgIACABKwAA5QkAMAIAAAAuACArAACoCAAgAgAAAKgGACArAACnCAAgC4EDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGnAwEA9QUAIagDAQD2BQAhqgNAAPsFACGsAwAAqgasAyKtAwEA9gUAIa4DAQD2BQAhDRoAAN4GACAcAACtBgAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGqA0AA-wUAIawDAACqBqwDIq0DAQD2BQAhrgMBAPYFACENGgAA3wYAIBwAAL4GACCBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGoAwEAAAABqgNAAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAEKgQMBAAAAAZIDQAAAAAGTA0AAAAAB2wMBAAAAAdwDAQAAAAHdAwIAAAAB3gMCAAAAAd8DAgAAAAHgAwIAAAAB4QMCAAAAAQIAAABIACAyAAC1CAAgAwAAAEgAIDIAALUIACAzAAC0CAAgASsAAOQJADAPEgAA0QUAIP4CAADQBQAw_wIAAEYAEIADAADQBQAwgQMBAAAAAZIDQAD9BAAhkwNAAP0EACGpAwEA9gQAIdsDAQD3BAAh3AMBAPcEACHdAwIA-AQAId4DAgD4BAAh3wMCAPgEACHgAwIA-AQAIeEDAgD4BAAhAgAAAEgAICsAALQIACACAAAAsggAICsAALMIACAO_gIAALEIADD_AgAAsggAEIADAACxCAAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhqQMBAPYEACHbAwEA9wQAIdwDAQD3BAAh3QMCAPgEACHeAwIA-AQAId8DAgD4BAAh4AMCAPgEACHhAwIA-AQAIQ7-AgAAsQgAMP8CAACyCAAQgAMAALEIADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGpAwEA9gQAIdsDAQD3BAAh3AMBAPcEACHdAwIA-AQAId4DAgD4BAAh3wMCAPgEACHgAwIA-AQAIeEDAgD4BAAhCoEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIdsDAQD2BQAh3AMBAPYFACHdAwIA9wUAId4DAgD3BQAh3wMCAPcFACHgAwIA9wUAIeEDAgD3BQAhCoEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIdsDAQD2BQAh3AMBAPYFACHdAwIA9wUAId4DAgD3BQAh3wMCAPcFACHgAwIA9wUAIeEDAgD3BQAhCoEDAQAAAAGSA0AAAAABkwNAAAAAAdsDAQAAAAHcAwEAAAAB3QMCAAAAAd4DAgAAAAHfAwIAAAAB4AMCAAAAAeEDAgAAAAEJgQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAdMDgAAAAAHUAwIAAAABAgAAAEMAIDIAAMEIACADAAAAQwAgMgAAwQgAIDMAAMAIACABKwAA4wkAMA4SAADUBQAg_gIAANIFADD_AgAAQQAQgAMAANIFADCBAwEAAAABkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIagDAQD3BAAhqQMBAPcEACHTAwAA0wUAINQDAgD4BAAhAgAAAEMAICsAAMAIACACAAAAvggAICsAAL8IACAN_gIAAL0IADD_AgAAvggAEIADAAC9CAAwgQMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhqAMBAPcEACGpAwEA9wQAIdMDAADTBQAg1AMCAPgEACEN_gIAAL0IADD_AgAAvggAEIADAAC9CAAwgQMBAPYEACGQAyAA-wQAIZEDQAD8BAAhkgNAAP0EACGTA0AA_QQAIacDAQD2BAAhqAMBAPcEACGpAwEA9wQAIdMDAADTBQAg1AMCAPgEACEJgQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACHTA4AAAAAB1AMCAPcFACEJgQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACHTA4AAAAAB1AMCAPcFACEJgQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAdMDgAAAAAHUAwIAAAABCIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAcEDAQAAAAHVAwEAAAABAgAAAD4AIDIAAM0IACADAAAAPgAgMgAAzQgAIDMAAMwIACABKwAA4gkAMA0SAADUBQAg_gIAANUFADD_AgAAPAAQgAMAANUFADCBAwEAAAABkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIakDAQD3BAAhwQMBAPYEACHVAwEA9wQAIQIAAAA-ACArAADMCAAgAgAAAMoIACArAADLCAAgDP4CAADJCAAw_wIAAMoIABCAAwAAyQgAMIEDAQD2BAAhkAMgAPsEACGRA0AA_AQAIZIDQAD9BAAhkwNAAP0EACGnAwEA9gQAIakDAQD3BAAhwQMBAPYEACHVAwEA9wQAIQz-AgAAyQgAMP8CAADKCAAQgAMAAMkIADCBAwEA9gQAIZADIAD7BAAhkQNAAPwEACGSA0AA_QQAIZMDQAD9BAAhpwMBAPYEACGpAwEA9wQAIcEDAQD2BAAh1QMBAPcEACEIgQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhwQMBAPUFACHVAwEA9gUAIQiBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACHBAwEA9QUAIdUDAQD2BQAhCIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAcEDAQAAAAHVAwEAAAABCRQAAJAIACCBAwEAAAABkgNAAAAAAZMDQAAAAAHVAwAAANcDAtcDAQAAAAHYA4AAAAAB2QOAAAAAAdoDAgAAAAECAAAANAAgMgAA2QgAIAMAAAA0ACAyAADZCAAgMwAA2AgAIAErAADhCQAwDhIAANEFACAUAACJBQAg_gIAANkFADD_AgAAMgAQgAMAANkFADCBAwEAAAABkgNAAP0EACGTA0AA_QQAIakDAQD2BAAh1QMAANoF1wMi1wMBAPYEACHYAwAAkQUAINkDAADTBQAg2gMCAPgEACECAAAANAAgKwAA2AgAIAIAAADWCAAgKwAA1wgAIAz-AgAA1QgAMP8CAADWCAAQgAMAANUIADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGpAwEA9gQAIdUDAADaBdcDItcDAQD2BAAh2AMAAJEFACDZAwAA0wUAINoDAgD4BAAhDP4CAADVCAAw_wIAANYIABCAAwAA1QgAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIakDAQD2BAAh1QMAANoF1wMi1wMBAPYEACHYAwAAkQUAINkDAADTBQAg2gMCAPgEACEIgQMBAPUFACGSA0AA_AUAIZMDQAD8BQAh1QMAAIMI1wMi1wMBAPUFACHYA4AAAAAB2QOAAAAAAdoDAgD3BQAhCRQAAIUIACCBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACHVAwAAgwjXAyLXAwEA9QUAIdgDgAAAAAHZA4AAAAAB2gMCAPcFACEJFAAAkAgAIIEDAQAAAAGSA0AAAAABkwNAAAAAAdUDAAAA1wMC1wMBAAAAAdgDgAAAAAHZA4AAAAAB2gMCAAAAAQQyAADOCAAwgQQAAM8IADCDBAAA0QgAIIcEAADSCAAwBDIAAMIIADCBBAAAwwgAMIMEAADFCAAghwQAAMYIADAEMgAAtggAMIEEAAC3CAAwgwQAALkIACCHBAAAuggAMAQyAACqCAAwgQQAAKsIADCDBAAArQgAIIcEAACuCAAwBDIAAKEIADCBBAAAoggAMIMEAACkCAAghwQAAKQGADAAAAAAAAAAAAUyAADcCQAgMwAA3wkAIIEEAADdCQAgggQAAN4JACCHBAAAhAEAIAMyAADcCQAggQQAAN0JACCHBAAAhAEAIAAAAAUyAADXCQAgMwAA2gkAIIEEAADYCQAgggQAANkJACCHBAAAhAEAIAMyAADXCQAggQQAANgJACCHBAAAhAEAIAAAAAGEBAAAAPcDAgGEBAAAAPkDAgsyAACnCQAwMwAArAkAMIEEAACoCQAwggQAAKkJADCDBAAAqgkAIIQEAACrCQAwhQQAAKsJADCGBAAAqwkAMIcEAACrCQAwiAQAAK0JADCJBAAArgkAMAsyAACbCQAwMwAAoAkAMIEEAACcCQAwggQAAJ0JADCDBAAAngkAIIQEAACfCQAwhQQAAJ8JADCGBAAAnwkAMIcEAACfCQAwiAQAAKEJADCJBAAAogkAMAcyAACWCQAgMwAAmQkAIIEEAACXCQAgggQAAJgJACCFBAAACwAghgQAAAsAIIcEAAD7AwAgBzIAAJEJACAzAACUCQAggQQAAJIJACCCBAAAkwkAIIUEAAAnACCGBAAAJwAghwQAAMMEACAHMgAAjAkAIDMAAI8JACCBBAAAjQkAIIIEAACOCQAghQQAAGYAIIYEAABmACCHBAAAAQAgCzIAAIMJADAzAACHCQAwgQQAAIQJADCCBAAAhQkAMIMEAACGCQAghAQAAJMGADCFBAAAkwYAMIYEAACTBgAwhwQAAJMGADCIBAAAiAkAMIkEAACWBgAwCzIAAPoIADAzAAD-CAAwgQQAAPsIADCCBAAA_AgAMIMEAAD9CAAghAQAAJMGADCFBAAAkwYAMIYEAACTBgAwhwQAAJMGADCIBAAA_wgAMIkEAACWBgAwDxoAAN4HACAdAACeBgAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABrQMBAAAAAcEDAQAAAAHCAwEAAAABwwMBAAAAAcYDAAAAxgMCxwMgAAAAAcgDQAAAAAECAAAAWAAgMgAAggkAIAMAAABYACAyAACCCQAgMwAAgQkAIAErAADWCQAwAgAAAFgAICsAAIEJACACAAAAlwYAICsAAIAJACANgQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhrQMBAPYFACHBAwEA9gUAIcIDAQD2BQAhwwMBAPUFACHGAwAAmQbGAyLHAyAA-gUAIcgDQAD7BQAhDxoAAN0HACAdAACbBgAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhrQMBAPYFACHBAwEA9gUAIcIDAQD2BQAhwwMBAPUFACHGAwAAmQbGAyLHAyAA-gUAIcgDQAD7BQAhDxoAAN4HACAdAACeBgAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABrQMBAAAAAcEDAQAAAAHCAwEAAAABwwMBAAAAAcYDAAAAxgMCxwMgAAAAAcgDQAAAAAEPGgAA3gcAIB4AAJ8GACCBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGtAwEAAAABwQMBAAAAAcIDAQAAAAHEAwEAAAABxgMAAADGAwLHAyAAAAAByANAAAAAAQIAAABYACAyAACLCQAgAwAAAFgAIDIAAIsJACAzAACKCQAgASsAANUJADACAAAAWAAgKwAAigkAIAIAAACXBgAgKwAAiQkAIA2BAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGtAwEA9gUAIcEDAQD2BQAhwgMBAPYFACHEAwEA9gUAIcYDAACZBsYDIscDIAD6BQAhyANAAPsFACEPGgAA3QcAIB4AAJwGACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGtAwEA9gUAIcEDAQD2BQAhwgMBAPYFACHEAwEA9gUAIcYDAACZBsYDIscDIAD6BQAhyANAAPsFACEPGgAA3gcAIB4AAJ8GACCBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGtAwEAAAABwQMBAAAAAcIDAQAAAAHEAwEAAAABxgMAAADGAwLHAyAAAAAByANAAAAAAQqBAwEAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAH3AwAAAPcDAgIAAAABACAyAACMCQAgAwAAAGYAIDIAAIwJACAzAACQCQAgDAAAAGYAICsAAJAJACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGEAwEA9gUAIYUDAQD2BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACH3AwAA8Qj3AyIKgQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhhAMBAPYFACGFAwEA9gUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAh9wMAAPEI9wMiEw8AANMGACCBAwEAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMCAAAAAYoDAAAAigMCiwMBAAAAAYwDAQAAAAGNAwEAAAABjgMBAAAAAY8DCAAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABAgAAAMMEACAyAACRCQAgAwAAACcAIDIAAJEJACAzAACVCQAgFQAAACcAIA8AAP4FACArAACVCQAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhhAMBAPYFACGFAwEA9gUAIYYDAQD2BQAhhwMBAPUFACGIAwIA9wUAIYoDAAD4BYoDIosDAQD1BQAhjAMBAPYFACGNAwEA9QUAIY4DAQD1BQAhjwMIAPkFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIRMPAAD-BQAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhhAMBAPYFACGFAwEA9gUAIYYDAQD2BQAhhwMBAPUFACGIAwIA9wUAIYoDAAD4BYoDIosDAQD1BQAhjAMBAPYFACGNAwEA9QUAIY4DAQD1BQAhjwMIAPkFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIQ0gAACKBwAgIQAAiwcAICIAAIwHACCBAwEAAAABggMBAAAAAYMDAQAAAAGEAwEAAAABhQMBAAAAAYYDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABAgAAAPsDACAyAACWCQAgAwAAAAsAIDIAAJYJACAzAACaCQAgDwAAAAsAICAAAOQGACAhAADlBgAgIgAA5gYAICsAAJoJACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGEAwEA9gUAIYUDAQD2BQAhhgMBAPYFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIQ0gAADkBgAgIQAA5QYAICIAAOYGACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGEAwEA9gUAIYUDAQD2BQAhhgMBAPYFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIQyBAwEAAAABkgNAAAAAAZMDQAAAAAHoAwEAAAAB6QMBAAAAAeoDAQAAAAHrAwEAAAAB7AMBAAAAAe0DQAAAAAHuA0AAAAAB7wMBAAAAAfADAQAAAAECAAAACQAgMgAApgkAIAMAAAAJACAyAACmCQAgMwAApQkAIAErAADUCQAwEgMAAP4EACD-AgAA7QUAMP8CAAAHABCAAwAA7QUAMIEDAQAAAAGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACHoAwEA9gQAIekDAQD2BAAh6gMBAPcEACHrAwEA9wQAIewDAQD3BAAh7QNAAPwEACHuA0AA_AQAIe8DAQD3BAAh8AMBAPcEACH-AwAA7AUAIAIAAAAJACArAAClCQAgAgAAAKMJACArAACkCQAgEP4CAACiCQAw_wIAAKMJABCAAwAAogkAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIZQDAQD2BAAh6AMBAPYEACHpAwEA9gQAIeoDAQD3BAAh6wMBAPcEACHsAwEA9wQAIe0DQAD8BAAh7gNAAPwEACHvAwEA9wQAIfADAQD3BAAhEP4CAACiCQAw_wIAAKMJABCAAwAAogkAMIEDAQD2BAAhkgNAAP0EACGTA0AA_QQAIZQDAQD2BAAh6AMBAPYEACHpAwEA9gQAIeoDAQD3BAAh6wMBAPcEACHsAwEA9wQAIe0DQAD8BAAh7gNAAPwEACHvAwEA9wQAIfADAQD3BAAhDIEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIegDAQD1BQAh6QMBAPUFACHqAwEA9gUAIesDAQD2BQAh7AMBAPYFACHtA0AA-wUAIe4DQAD7BQAh7wMBAPYFACHwAwEA9gUAIQyBAwEA9QUAIZIDQAD8BQAhkwNAAPwFACHoAwEA9QUAIekDAQD1BQAh6gMBAPYFACHrAwEA9gUAIewDAQD2BQAh7QNAAPsFACHuA0AA-wUAIe8DAQD2BQAh8AMBAPYFACEMgQMBAAAAAZIDQAAAAAGTA0AAAAAB6AMBAAAAAekDAQAAAAHqAwEAAAAB6wMBAAAAAewDAQAAAAHtA0AAAAAB7gNAAAAAAe8DAQAAAAHwAwEAAAABB4EDAQAAAAGSA0AAAAABkwNAAAAAAfEDQAAAAAHyAwEAAAAB8wMBAAAAAfQDAQAAAAECAAAABQAgMgAAsgkAIAMAAAAFACAyAACyCQAgMwAAsQkAIAErAADTCQAwDAMAAP4EACD-AgAA7gUAMP8CAAADABCAAwAA7gUAMIEDAQAAAAGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACHxA0AA_QQAIfIDAQAAAAHzAwEA9wQAIfQDAQD3BAAhAgAAAAUAICsAALEJACACAAAArwkAICsAALAJACAL_gIAAK4JADD_AgAArwkAEIADAACuCQAwgQMBAPYEACGSA0AA_QQAIZMDQAD9BAAhlAMBAPYEACHxA0AA_QQAIfIDAQD2BAAh8wMBAPcEACH0AwEA9wQAIQv-AgAArgkAMP8CAACvCQAQgAMAAK4JADCBAwEA9gQAIZIDQAD9BAAhkwNAAP0EACGUAwEA9gQAIfEDQAD9BAAh8gMBAPYEACHzAwEA9wQAIfQDAQD3BAAhB4EDAQD1BQAhkgNAAPwFACGTA0AA_AUAIfEDQAD8BQAh8gMBAPUFACHzAwEA9gUAIfQDAQD2BQAhB4EDAQD1BQAhkgNAAPwFACGTA0AA_AUAIfEDQAD8BQAh8gMBAPUFACHzAwEA9gUAIfQDAQD2BQAhB4EDAQAAAAGSA0AAAAABkwNAAAAAAfEDQAAAAAHyAwEAAAAB8wMBAAAAAfQDAQAAAAEEMgAApwkAMIEEAACoCQAwgwQAAKoJACCHBAAAqwkAMAQyAACbCQAwgQQAAJwJADCDBAAAngkAIIcEAACfCQAwAzIAAJYJACCBBAAAlwkAIIcEAAD7AwAgAzIAAJEJACCBBAAAkgkAIIcEAADDBAAgAzIAAIwJACCBBAAAjQkAIIcEAAABACAEMgAAgwkAMIEEAACECQAwgwQAAIYJACCHBAAAkwYAMAQyAAD6CAAwgQQAAPsIADCDBAAA_QgAIIcEAACTBgAwAAAIAwAA1AYAICAAAI0HACAhAACOBwAgIgAAjwcAIIQDAADvBQAghQMAAO8FACCGAwAA7wUAIJEDAADvBQAgBwMAANQGACAPAADVBgAghAMAAO8FACCFAwAA7wUAIIYDAADvBQAgjAMAAO8FACCRAwAA7wUAIAQDAADUBgAghAMAAO8FACCFAwAA7wUAIJEDAADvBQAgAAAAAAUyAADOCQAgMwAA0QkAIIEEAADPCQAgggQAANAJACCHBAAAhAEAIAMyAADOCQAggQQAAM8JACCHBAAAhAEAIAsKAADKCQAgEAAAvQkAIBEAAI0HACAZAADjCAAgHwAAvwkAIJEDAADvBQAgqAMAAO8FACC7AwAA7wUAILwDAADvBQAgvQMAAO8FACC_AwAA7wUAIAkSAADHCQAgGgAAxQkAIBwAAI4HACCRAwAA7wUAIKgDAADvBQAgqQMAAO8FACCqAwAA7wUAIK0DAADvBQAgrgMAAO8FACAMFQAA3wgAIBYAAOAIACAXAADhCAAgGAAA4ggAIBkAAOMIACCRAwAA7wUAIKgDAADvBQAg4gMAAO8FACDjAwAA7wUAIOQDAADvBQAg5QMAAO8FACDmAwAA7wUAIAMSAADHCQAgFAAAjwcAINgDAADvBQAgBQoAAMoJACAMAADLCQAgkQMAAO8FACCoAwAA7wUAIL4DAADvBQAgBwcAAMoJACAIAADMCQAgCQAA1QYAIA4AAM0JACCRAwAA7wUAIKgDAADvBQAgwAMAAO8FACAAAAASBAAAswkAIAUAALQJACAGAAC1CQAgEAAAtgkAICQAALgJACAlAAC5CQAggQMBAAAAAYIDAQAAAAGDAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAawDAAAA-QMC4gMBAAAAAfUDIAAAAAH3AwAAAPcDAvkDIAAAAAECAAAAhAEAIDIAAM4JACADAAAAWgAgMgAAzgkAIDMAANIJACAUAAAAWgAgBAAA8wgAIAUAAPQIACAGAAD1CAAgEAAA9ggAICQAAPgIACAlAAD5CAAgKwAA0gkAIIEDAQD1BQAhggMBAPUFACGDAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhrAMAAPII-QMi4gMBAPYFACH1AyAA-gUAIfcDAADxCPcDIvkDIAD6BQAhEgQAAPMIACAFAAD0CAAgBgAA9QgAIBAAAPYIACAkAAD4CAAgJQAA-QgAIIEDAQD1BQAhggMBAPUFACGDAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhrAMAAPII-QMi4gMBAPYFACH1AyAA-gUAIfcDAADxCPcDIvkDIAD6BQAhB4EDAQAAAAGSA0AAAAABkwNAAAAAAfEDQAAAAAHyAwEAAAAB8wMBAAAAAfQDAQAAAAEMgQMBAAAAAZIDQAAAAAGTA0AAAAAB6AMBAAAAAekDAQAAAAHqAwEAAAAB6wMBAAAAAewDAQAAAAHtA0AAAAAB7gNAAAAAAe8DAQAAAAHwAwEAAAABDYEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAa0DAQAAAAHBAwEAAAABwgMBAAAAAcQDAQAAAAHGAwAAAMYDAscDIAAAAAHIA0AAAAABDYEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAa0DAQAAAAHBAwEAAAABwgMBAAAAAcMDAQAAAAHGAwAAAMYDAscDIAAAAAHIA0AAAAABEgUAALQJACAGAAC1CQAgEAAAtgkAICMAALcJACAkAAC4CQAgJQAAuQkAIIEDAQAAAAGCAwEAAAABgwMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGsAwAAAPkDAuIDAQAAAAH1AyAAAAAB9wMAAAD3AwL5AyAAAAABAgAAAIQBACAyAADXCQAgAwAAAFoAIDIAANcJACAzAADbCQAgFAAAAFoAIAUAAPQIACAGAAD1CAAgEAAA9ggAICMAAPcIACAkAAD4CAAgJQAA-QgAICsAANsJACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIawDAADyCPkDIuIDAQD2BQAh9QMgAPoFACH3AwAA8Qj3AyL5AyAA-gUAIRIFAAD0CAAgBgAA9QgAIBAAAPYIACAjAAD3CAAgJAAA-AgAICUAAPkIACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIawDAADyCPkDIuIDAQD2BQAh9QMgAPoFACH3AwAA8Qj3AyL5AyAA-gUAIRIEAACzCQAgBgAAtQkAIBAAALYJACAjAAC3CQAgJAAAuAkAICUAALkJACCBAwEAAAABggMBAAAAAYMDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABrAMAAAD5AwLiAwEAAAAB9QMgAAAAAfcDAAAA9wMC-QMgAAAAAQIAAACEAQAgMgAA3AkAIAMAAABaACAyAADcCQAgMwAA4AkAIBQAAABaACAEAADzCAAgBgAA9QgAIBAAAPYIACAjAAD3CAAgJAAA-AgAICUAAPkIACArAADgCQAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACESBAAA8wgAIAYAAPUIACAQAAD2CAAgIwAA9wgAICQAAPgIACAlAAD5CAAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACEIgQMBAAAAAZIDQAAAAAGTA0AAAAAB1QMAAADXAwLXAwEAAAAB2AOAAAAAAdkDgAAAAAHaAwIAAAABCIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAcEDAQAAAAHVAwEAAAABCYEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAagDAQAAAAHTA4AAAAAB1AMCAAAAAQqBAwEAAAABkgNAAAAAAZMDQAAAAAHbAwEAAAAB3AMBAAAAAd0DAgAAAAHeAwIAAAAB3wMCAAAAAeADAgAAAAHhAwIAAAABC4EDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAagDAQAAAAGqA0AAAAABrAMAAACsAwKtAwEAAAABrgMBAAAAAREVAADaCAAgFgAA2wgAIBcAANwIACAZAADeCAAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAawDAAAA6AMC4gMBAAAAAeMDAQAAAAHkAwEAAAAB5QMBAAAAAeYDgAAAAAECAAAAyAEAIDIAAOYJACADAAAAMAAgMgAA5gkAIDMAAOoJACATAAAAMAAgFQAAnAgAIBYAAJ0IACAXAACeCAAgGQAAoAgAICsAAOoJACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIawDAACbCOgDIuIDAQD2BQAh4wMBAPYFACHkAwEA9gUAIeUDAQD2BQAh5gOAAAAAAREVAACcCAAgFgAAnQgAIBcAAJ4IACAZAACgCAAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGsAwAAmwjoAyLiAwEA9gUAIeMDAQD2BQAh5AMBAPYFACHlAwEA9gUAIeYDgAAAAAERFgAA2wgAIBcAANwIACAYAADdCAAgGQAA3ggAIIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAagDAQAAAAGsAwAAAOgDAuIDAQAAAAHjAwEAAAAB5AMBAAAAAeUDAQAAAAHmA4AAAAABAgAAAMgBACAyAADrCQAgC4EDAQAAAAGSA0AAAAABkwNAAAAAAaMDAQAAAAGlAyAAAAABqQMBAAAAAccDIAAAAAHPAwIAAAAB0AMgAAAAAdEDIAAAAAHSAyAAAAABAwAAADAAIDIAAOsJACAzAADwCQAgEwAAADAAIBYAAJ0IACAXAACeCAAgGAAAnwgAIBkAAKAIACArAADwCQAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGsAwAAmwjoAyLiAwEA9gUAIeMDAQD2BQAh5AMBAPYFACHlAwEA9gUAIeYDgAAAAAERFgAAnQgAIBcAAJ4IACAYAACfCAAgGQAAoAgAIIEDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGnAwEA9QUAIagDAQD2BQAhrAMAAJsI6AMi4gMBAPYFACHjAwEA9gUAIeQDAQD2BQAh5QMBAPYFACHmA4AAAAABERUAANoIACAXAADcCAAgGAAA3QgAIBkAAN4IACCBAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAacDAQAAAAGoAwEAAAABrAMAAADoAwLiAwEAAAAB4wMBAAAAAeQDAQAAAAHlAwEAAAAB5gOAAAAAAQIAAADIAQAgMgAA8QkAIAMAAAAwACAyAADxCQAgMwAA9QkAIBMAAAAwACAVAACcCAAgFwAAnggAIBgAAJ8IACAZAACgCAAgKwAA9QkAIIEDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGnAwEA9QUAIagDAQD2BQAhrAMAAJsI6AMi4gMBAPYFACHjAwEA9gUAIeQDAQD2BQAh5QMBAPYFACHmA4AAAAABERUAAJwIACAXAACeCAAgGAAAnwgAIBkAAKAIACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIawDAACbCOgDIuIDAQD2BQAh4wMBAPYFACHkAwEA9gUAIeUDAQD2BQAh5gOAAAAAAREVAADaCAAgFgAA2wgAIBgAAN0IACAZAADeCAAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAawDAAAA6AMC4gMBAAAAAeMDAQAAAAHkAwEAAAAB5QMBAAAAAeYDgAAAAAECAAAAyAEAIDIAAPYJACADAAAAMAAgMgAA9gkAIDMAAPoJACATAAAAMAAgFQAAnAgAIBYAAJ0IACAYAACfCAAgGQAAoAgAICsAAPoJACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIawDAACbCOgDIuIDAQD2BQAh4wMBAPYFACHkAwEA9gUAIeUDAQD2BQAh5gOAAAAAAREVAACcCAAgFgAAnQgAIBgAAJ8IACAZAACgCAAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGsAwAAmwjoAyLiAwEA9gUAIeMDAQD2BQAh5AMBAPYFACHlAwEA9gUAIeYDgAAAAAEOAwAAiQcAICAAAIoHACAhAACLBwAggQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDAQAAAAECAAAA-wMAIDIAAPsJACADAAAACwAgMgAA-wkAIDMAAP8JACAQAAAACwAgAwAA4wYAICAAAOQGACAhAADlBgAgKwAA_wkAIIEDAQD1BQAhggMBAPUFACGDAwEA9QUAIYQDAQD2BQAhhQMBAPYFACGGAwEA9gUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACEOAwAA4wYAICAAAOQGACAhAADlBgAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhhAMBAPYFACGFAwEA9gUAIYYDAQD2BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGUAwEA9QUAIQsHAADZBwAgCAAA1gcAIAkAANcHACCBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABwAMBAAAAAQIAAAAUACAyAACACgAgAwAAABEAIDIAAIAKACAzAACECgAgDQAAABEAIAcAAKMHACAIAACkBwAgCQAApQcAICsAAIQKACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIcADAQD2BQAhCwcAAKMHACAIAACkBwAgCQAApQcAIIEDAQD1BQAhggMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIagDAQD2BQAhwAMBAPYFACEKCgAA6gcAIIEDAQAAAAGCAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAagDAQAAAAG-AwEAAAABzQMBAAAAAQIAAAAcACAyAACFCgAgAwAAABoAIDIAAIUKACAzAACJCgAgDAAAABoAIAoAAOkHACArAACJCgAggQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACG-AwEA9gUAIc0DAQD1BQAhCgoAAOkHACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIb4DAQD2BQAhzQMBAPUFACEQCgAAzgYAIBAAAJ8HACARAADPBgAgGQAA0AYAIIEDAQAAAAGCAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAagDAQAAAAG7AwIAAAABvAMBAAAAAb0DAQAAAAG-AwEAAAABvwMBAAAAAQIAAAAYACAyAACKCgAgAwAAABYAIDIAAIoKACAzAACOCgAgEgAAABYAIAoAAIsGACAQAACeBwAgEQAAjAYAIBkAAI0GACArAACOCgAggQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACG7AwIAiQYAIbwDAQD2BQAhvQMBAPYFACG-AwEA9QUAIb8DAQD2BQAhEAoAAIsGACAQAACeBwAgEQAAjAYAIBkAAI0GACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIbsDAgCJBgAhvAMBAPYFACG9AwEA9gUAIb4DAQD1BQAhvwMBAPYFACELBwAA2QcAIAkAANcHACAOAADYBwAggQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAcADAQAAAAECAAAAFAAgMgAAjwoAIAeBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABC4EDAQAAAAGCAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAagDAQAAAAG7AwIAAAABvAMBAAAAAb0DAQAAAAG_AwEAAAABB4EDAQAAAAGSA0AAAAABkwNAAAAAAcADAQAAAAHKAwEAAAABywMBAAAAAcwDAgAAAAEIgQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAc0DAQAAAAEDAAAAEQAgMgAAjwoAIDMAAJcKACANAAAAEQAgBwAAowcAIAkAAKUHACAOAACmBwAgKwAAlwoAIIEDAQD1BQAhggMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIagDAQD2BQAhwAMBAPYFACELBwAAowcAIAkAAKUHACAOAACmBwAggQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACHAAwEA9gUAIRQDAADSBgAggQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAgAAAAGKAwAAAIoDAosDAQAAAAGMAwEAAAABjQMBAAAAAY4DAQAAAAGPAwgAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDAQAAAAECAAAAwwQAIDIAAJgKACADAAAAJwAgMgAAmAoAIDMAAJwKACAWAAAAJwAgAwAA_QUAICsAAJwKACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGEAwEA9gUAIYUDAQD2BQAhhgMBAPYFACGHAwEA9QUAIYgDAgD3BQAhigMAAPgFigMiiwMBAPUFACGMAwEA9gUAIY0DAQD1BQAhjgMBAPUFACGPAwgA-QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACEUAwAA_QUAIIEDAQD1BQAhggMBAPUFACGDAwEA9QUAIYQDAQD2BQAhhQMBAPYFACGGAwEA9gUAIYcDAQD1BQAhiAMCAPcFACGKAwAA-AWKAyKLAwEA9QUAIYwDAQD2BQAhjQMBAPUFACGOAwEA9QUAIY8DCAD5BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGUAwEA9QUAIRIEAACzCQAgBQAAtAkAIBAAALYJACAjAAC3CQAgJAAAuAkAICUAALkJACCBAwEAAAABggMBAAAAAYMDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABrAMAAAD5AwLiAwEAAAAB9QMgAAAAAfcDAAAA9wMC-QMgAAAAAQIAAACEAQAgMgAAnQoAIBAKAADOBgAgEAAAnwcAIBkAANAGACAfAADRBgAggQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAbsDAgAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAG_AwEAAAABAgAAABgAIDIAAJ8KACADAAAAFgAgMgAAnwoAIDMAAKMKACASAAAAFgAgCgAAiwYAIBAAAJ4HACAZAACNBgAgHwAAjgYAICsAAKMKACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIbsDAgCJBgAhvAMBAPYFACG9AwEA9gUAIb4DAQD1BQAhvwMBAPYFACEQCgAAiwYAIBAAAJ4HACAZAACNBgAgHwAAjgYAIIEDAQD1BQAhggMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIagDAQD2BQAhuwMCAIkGACG8AwEA9gUAIb0DAQD2BQAhvgMBAPUFACG_AwEA9gUAIQSBAwEAAAABkgNAAAAAAZMDQAAAAAGtAwEAAAABBoEDAQAAAAGSA0AAAAABkwNAAAAAAaQDAQAAAAGlAyAAAAABpgNAAAAAAQoSAACPCAAggQMBAAAAAZIDQAAAAAGTA0AAAAABqQMBAAAAAdUDAAAA1wMC1wMBAAAAAdgDgAAAAAHZA4AAAAAB2gMCAAAAAQIAAAA0ACAyAACmCgAgAwAAADIAIDIAAKYKACAzAACqCgAgDAAAADIAIBIAAIQIACArAACqCgAggQMBAPUFACGSA0AA_AUAIZMDQAD8BQAhqQMBAPUFACHVAwAAgwjXAyLXAwEA9QUAIdgDgAAAAAHZA4AAAAAB2gMCAPcFACEKEgAAhAgAIIEDAQD1BQAhkgNAAPwFACGTA0AA_AUAIakDAQD1BQAh1QMAAIMI1wMi1wMBAPUFACHYA4AAAAAB2QOAAAAAAdoDAgD3BQAhC4EDAQAAAAGSA0AAAAABkwNAAAAAAaUDIAAAAAGpAwEAAAABxwMgAAAAAc4DAQAAAAHPAwIAAAAB0AMgAAAAAdEDIAAAAAHSAyAAAAABAwAAAFoAIDIAAJ0KACAzAACuCgAgFAAAAFoAIAQAAPMIACAFAAD0CAAgEAAA9ggAICMAAPcIACAkAAD4CAAgJQAA-QgAICsAAK4KACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIawDAADyCPkDIuIDAQD2BQAh9QMgAPoFACH3AwAA8Qj3AyL5AyAA-gUAIRIEAADzCAAgBQAA9AgAIBAAAPYIACAjAAD3CAAgJAAA-AgAICUAAPkIACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIawDAADyCPkDIuIDAQD2BQAh9QMgAPoFACH3AwAA8Qj3AyL5AyAA-gUAIRAKAADOBgAgEAAAnwcAIBEAAM8GACAfAADRBgAggQMBAAAAAYIDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABqAMBAAAAAbsDAgAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAG_AwEAAAABAgAAABgAIDIAAK8KACADAAAAFgAgMgAArwoAIDMAALMKACASAAAAFgAgCgAAiwYAIBAAAJ4HACARAACMBgAgHwAAjgYAICsAALMKACCBAwEA9QUAIYIDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGoAwEA9gUAIbsDAgCJBgAhvAMBAPYFACG9AwEA9gUAIb4DAQD1BQAhvwMBAPYFACEQCgAAiwYAIBAAAJ4HACARAACMBgAgHwAAjgYAIIEDAQD1BQAhggMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIagDAQD2BQAhuwMCAIkGACG8AwEA9gUAIb0DAQD2BQAhvgMBAPUFACG_AwEA9gUAIQ4SAAC9BgAgGgAA3wYAIIEDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgNAAAAAAawDAAAArAMCrQMBAAAAAa4DAQAAAAECAAAALgAgMgAAtAoAIAMAAAAsACAyAAC0CgAgMwAAuAoAIBAAAAAsACASAACsBgAgGgAA3gYAICsAALgKACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIakDAQD2BQAhqgNAAPsFACGsAwAAqgasAyKtAwEA9gUAIa4DAQD2BQAhDhIAAKwGACAaAADeBgAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGpAwEA9gUAIaoDQAD7BQAhrAMAAKoGrAMirQMBAPYFACGuAwEA9gUAIRIEAACzCQAgBQAAtAkAIAYAALUJACAjAAC3CQAgJAAAuAkAICUAALkJACCBAwEAAAABggMBAAAAAYMDAQAAAAGQAyAAAAABkQNAAAAAAZIDQAAAAAGTA0AAAAABrAMAAAD5AwLiAwEAAAAB9QMgAAAAAfcDAAAA9wMC-QMgAAAAAQIAAACEAQAgMgAAuQoAIAsHAADZBwAgCAAA1gcAIA4AANgHACCBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABwAMBAAAAAQIAAAAUACAyAAC7CgAgDgMAAIkHACAhAACLBwAgIgAAjAcAIIEDAQAAAAGCAwEAAAABgwMBAAAAAYQDAQAAAAGFAwEAAAABhgMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGUAwEAAAABAgAAAPsDACAyAAC9CgAgAwAAAAsAIDIAAL0KACAzAADBCgAgEAAAAAsAIAMAAOMGACAhAADlBgAgIgAA5gYAICsAAMEKACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGEAwEA9gUAIYUDAQD2BQAhhgMBAPYFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIZQDAQD1BQAhDgMAAOMGACAhAADlBgAgIgAA5gYAIIEDAQD1BQAhggMBAPUFACGDAwEA9QUAIYQDAQD2BQAhhQMBAPYFACGGAwEA9gUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACEEgQMBAAAAAZIDQAAAAAGTA0AAAAABowMBAAAAAREVAADaCAAgFgAA2wgAIBcAANwIACAYAADdCAAggQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAawDAAAA6AMC4gMBAAAAAeMDAQAAAAHkAwEAAAAB5QMBAAAAAeYDgAAAAAECAAAAyAEAIDIAAMMKACAOAwAAiQcAICAAAIoHACAiAACMBwAggQMBAAAAAYIDAQAAAAGDAwEAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABkAMgAAAAAZEDQAAAAAGSA0AAAAABkwNAAAAAAZQDAQAAAAECAAAA-wMAIDIAAMUKACADAAAACwAgMgAAxQoAIDMAAMkKACAQAAAACwAgAwAA4wYAICAAAOQGACAiAADmBgAgKwAAyQoAIIEDAQD1BQAhggMBAPUFACGDAwEA9QUAIYQDAQD2BQAhhQMBAPYFACGGAwEA9gUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhlAMBAPUFACEOAwAA4wYAICAAAOQGACAiAADmBgAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhhAMBAPYFACGFAwEA9gUAIYYDAQD2BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGUAwEA9QUAIQaBAwEAAAABkgNAAAAAAZMDQAAAAAGjAwEAAAABpQMgAAAAAaYDQAAAAAEDAAAAMAAgMgAAwwoAIDMAAM0KACATAAAAMAAgFQAAnAgAIBYAAJ0IACAXAACeCAAgGAAAnwgAICsAAM0KACCBAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhpwMBAPUFACGoAwEA9gUAIawDAACbCOgDIuIDAQD2BQAh4wMBAPYFACHkAwEA9gUAIeUDAQD2BQAh5gOAAAAAAREVAACcCAAgFgAAnQgAIBcAAJ4IACAYAACfCAAggQMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIacDAQD1BQAhqAMBAPYFACGsAwAAmwjoAyLiAwEA9gUAIeMDAQD2BQAh5AMBAPYFACHlAwEA9gUAIeYDgAAAAAELgQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABqAMBAAAAAakDAQAAAAGqA0AAAAABrAMAAACsAwKuAwEAAAABEgQAALMJACAFAAC0CQAgBgAAtQkAIBAAALYJACAjAAC3CQAgJAAAuAkAIIEDAQAAAAGCAwEAAAABgwMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGsAwAAAPkDAuIDAQAAAAH1AyAAAAAB9wMAAAD3AwL5AyAAAAABAgAAAIQBACAyAADPCgAgEgQAALMJACAFAAC0CQAgBgAAtQkAIBAAALYJACAjAAC3CQAgJQAAuQkAIIEDAQAAAAGCAwEAAAABgwMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGsAwAAAPkDAuIDAQAAAAH1AyAAAAAB9wMAAAD3AwL5AyAAAAABAgAAAIQBACAyAADRCgAgAwAAAFoAIDIAAM8KACAzAADVCgAgFAAAAFoAIAQAAPMIACAFAAD0CAAgBgAA9QgAIBAAAPYIACAjAAD3CAAgJAAA-AgAICsAANUKACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIawDAADyCPkDIuIDAQD2BQAh9QMgAPoFACH3AwAA8Qj3AyL5AyAA-gUAIRIEAADzCAAgBQAA9AgAIAYAAPUIACAQAAD2CAAgIwAA9wgAICQAAPgIACCBAwEA9QUAIYIDAQD1BQAhgwMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIawDAADyCPkDIuIDAQD2BQAh9QMgAPoFACH3AwAA8Qj3AyL5AyAA-gUAIQMAAABaACAyAADRCgAgMwAA2AoAIBQAAABaACAEAADzCAAgBQAA9AgAIAYAAPUIACAQAAD2CAAgIwAA9wgAICUAAPkIACArAADYCgAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACESBAAA8wgAIAUAAPQIACAGAAD1CAAgEAAA9ggAICMAAPcIACAlAAD5CAAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACENgQMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGnAwEAAAABwQMBAAAAAcIDAQAAAAHDAwEAAAABxAMBAAAAAcYDAAAAxgMCxwMgAAAAAcgDQAAAAAEDAAAAEQAgMgAAuwoAIDMAANwKACANAAAAEQAgBwAAowcAIAgAAKQHACAOAACmBwAgKwAA3AoAIIEDAQD1BQAhggMBAPUFACGQAyAA-gUAIZEDQAD7BQAhkgNAAPwFACGTA0AA_AUAIagDAQD2BQAhwAMBAPYFACELBwAAowcAIAgAAKQHACAOAACmBwAggQMBAPUFACGCAwEA9QUAIZADIAD6BQAhkQNAAPsFACGSA0AA_AUAIZMDQAD8BQAhqAMBAPYFACHAAwEA9gUAIQuBAwEAAAABggMBAAAAAZADIAAAAAGRA0AAAAABkgNAAAAAAZMDQAAAAAGoAwEAAAABuwMCAAAAAbwDAQAAAAG9AwEAAAABvgMBAAAAAQMAAABaACAyAAC5CgAgMwAA4AoAIBQAAABaACAEAADzCAAgBQAA9AgAIAYAAPUIACAjAAD3CAAgJAAA-AgAICUAAPkIACArAADgCgAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACESBAAA8wgAIAUAAPQIACAGAAD1CAAgIwAA9wgAICQAAPgIACAlAAD5CAAggQMBAPUFACGCAwEA9QUAIYMDAQD1BQAhkAMgAPoFACGRA0AA-wUAIZIDQAD8BQAhkwNAAPwFACGsAwAA8gj5AyLiAwEA9gUAIfUDIAD6BQAh9wMAAPEI9wMi-QMgAPoFACEBAwACCAQGAwUKBAYMBQ0AHRBlDSNnASRoGiVpGgEDAAIBAwACBQMAAg0AHCAQBiFgGCJhEgIGAAUaAAcGCgAIDQAbECgNESsGGS8PH1kaBQcSCAgVCAkZBw0ADA4dCQMKHggMIgoNAAsBCwAJAQwjAAMIJAAJJQAOJgADAwACDQAODykHAQ8qAAQNABkSMRAaUAccVBgGDQAXFTURFj8UF0QVGEkWGUoPAw0AExIAEBQ5EgIGAAUTOhEBFDsAARJAEAESRRABEgAQBRVLABZMABdNABhOABlPAAIGAAUbAA8BHFUAAxpcBx0AAh5bAgMRXQAZXgAfXwADIGIAIWMAImQABARqAAVrACRsACVtAAABAwACAQMAAgMNACI4ACM5ACQAAAADDQAiOAAjOQAkAAADDQApOAAqOQArAAAAAw0AKTgAKjkAKwEDAAIBAwACAw0AMDgAMTkAMgAAAAMNADA4ADE5ADIBAwACAQMAAgMNADc4ADg5ADkAAAADDQA3OAA4OQA5AAADDQA-OAA_OQBAAAAAAw0APjgAPzkAQAESABABEgAQBQ0ARTgASDkASYoBAEaLAQBHAAAAAAAFDQBFOABIOQBJigEARosBAEcBEgAQARIAEAUNAE44AFE5AFKKAQBPiwEAUAAAAAAABQ0ATjgAUTkAUooBAE-LAQBQARKWAhABEpwCEAMNAFc4AFg5AFkAAAADDQBXOABYOQBZARKuAhABErQCEAUNAF44AGE5AGKKAQBfiwEAYAAAAAAABQ0AXjgAYTkAYooBAF-LAQBgAgYABRPGAhECBgAFE8wCEQUNAGc4AGo5AGuKAQBoiwEAaQAAAAAABQ0AZzgAajkAa4oBAGiLAQBpAQreAggBCuQCCAMNAHA4AHE5AHIAAAADDQBwOABxOQByAQsACQELAAkFDQB3OAB6OQB7igEAeIsBAHkAAAAAAAUNAHc4AHo5AHuKAQB4iwEAeQMajQMHHQACHowDAgMalAMHHQACHpMDAgMNAIABOACBATkAggEAAAADDQCAATgAgQE5AIIBAQemAwgBB6wDCAMNAIcBOACIATkAiQEAAAADDQCHATgAiAE5AIkBAgoACBC-Aw0CCgAIEMQDDQUNAI4BOACRATkAkgGKAQCPAYsBAJABAAAAAAAFDQCOATgAkQE5AJIBigEAjwGLAQCQAQIGAAUaAAcCBgAFGgAHAw0AlwE4AJgBOQCZAQAAAAMNAJcBOACYATkAmQEAAAAFDQCfATgAogE5AKMBigEAoAGLAQChAQAAAAAABQ0AnwE4AKIBOQCjAYoBAKABiwEAoQEBAwACAQMAAgMNAKgBOACpATkAqgEAAAADDQCoATgAqQE5AKoBAhKdBBAangQHAhKkBBAapQQHAw0ArwE4ALABOQCxAQAAAAMNAK8BOACwATkAsQECBgAFGwAPAgYABRsADwMNALYBOAC3ATkAuAEAAAADDQC2ATgAtwE5ALgBAQMAAgEDAAIFDQC9ATgAwAE5AMEBigEAvgGLAQC_AQAAAAAABQ0AvQE4AMABOQDBAYoBAL4BiwEAvwEmAgEnbgEocAEpcQEqcgEsdAEtdh4udx8veQEwex4xfCA0fQE1fgE2fx46ggEhO4MBJTyFAQI9hgECPogBAj-JAQJAigECQYwBAkKOAR5DjwEmRJEBAkWTAR5GlAEnR5UBAkiWAQJJlwEeSpoBKEubASxMnAEDTZ0BA06eAQNPnwEDUKABA1GiAQNSpAEeU6UBLVSnAQNVqQEeVqoBLlerAQNYrAEDWa0BHlqwAS9bsQEzXLIBBF2zAQRetAEEX7UBBGC2AQRhuAEEYroBHmO7ATRkvQEEZb8BHmbAATVnwQEEaMIBBGnDAR5qxgE2a8cBOmzJARBtygEQbswBEG_NARBwzgEQcdABEHLSAR5z0wE7dNUBEHXXAR522AE8d9kBEHjaARB52wEeet4BPXvfAUF84AEWfeEBFn7iARZ_4wEWgAHkARaBAeYBFoIB6AEegwHpAUKEAesBFoUB7QEehgHuAUOHAe8BFogB8AEWiQHxAR6MAfQBRI0B9QFKjgH2ARGPAfcBEZAB-AERkQH5ARGSAfoBEZMB_AERlAH-AR6VAf8BS5YBgQIRlwGDAh6YAYQCTJkBhQIRmgGGAhGbAYcCHpwBigJNnQGLAlOeAYwCFJ8BjQIUoAGOAhShAY8CFKIBkAIUowGSAhSkAZQCHqUBlQJUpgGYAhSnAZoCHqgBmwJVqQGdAhSqAZ4CFKsBnwIerAGiAlatAaMCWq4BpAIVrwGlAhWwAaYCFbEBpwIVsgGoAhWzAaoCFbQBrAIetQGtAlu2AbACFbcBsgIeuAGzAly5AbUCFboBtgIVuwG3Ah68AboCXb0BuwJjvgG8AhK_Ab0CEsABvgISwQG_AhLCAcACEsMBwgISxAHEAh7FAcUCZMYByAISxwHKAh7IAcsCZckBzQISygHOAhLLAc8CHswB0gJmzQHTAmzOAdQCCc8B1QIJ0AHWAgnRAdcCCdIB2AIJ0wHaAgnUAdwCHtUB3QJt1gHgAgnXAeICHtgB4wJu2QHlAgnaAeYCCdsB5wIe3AHqAm_dAesCc94B7AIK3wHtAgrgAe4CCuEB7wIK4gHwAgrjAfICCuQB9AIe5QH1AnTmAfcCCucB-QIe6AH6AnXpAfsCCuoB_AIK6wH9Ah7sAYADdu0BgQN87gGCAxrvAYMDGvABhAMa8QGFAxryAYYDGvMBiAMa9AGKAx71AYsDffYBjwMa9wGRAx74AZIDfvkBlQMa-gGWAxr7AZcDHvwBmgN__QGbA4MB_gGcAwj_AZ0DCIACngMIgQKfAwiCAqADCIMCogMIhAKkAx6FAqUDhAGGAqgDCIcCqgMeiAKrA4UBiQKtAwiKAq4DCIsCrwMejAKyA4YBjQKzA4oBjgK0AwePArUDB5ACtgMHkQK3AweSArgDB5MCugMHlAK8Ax6VAr0DiwGWAsADB5cCwgMemALDA4wBmQLFAweaAsYDB5sCxwMenALKA40BnQLLA5MBngLMAwafAs0DBqACzgMGoQLPAwaiAtADBqMC0gMGpALUAx6lAtUDlAGmAtcDBqcC2QMeqALaA5UBqQLbAwaqAtwDBqsC3QMerALgA5YBrQLhA5oBrgLjA5sBrwLkA5sBsALnA5sBsQLoA5sBsgLpA5sBswLrA5sBtALtAx61Au4DnAG2AvADmwG3AvIDHrgC8wOdAbkC9AObAboC9QObAbsC9gMevAL5A54BvQL6A6QBvgL8AwW_Av0DBcAC_wMFwQKABAXCAoEEBcMCgwQFxAKFBB7FAoYEpQHGAogEBccCigQeyAKLBKYByQKMBAXKAo0EBcsCjgQezAKRBKcBzQKSBKsBzgKTBA_PApQED9AClQQP0QKWBA_SApcED9MCmQQP1AKbBB7VApwErAHWAqAED9cCogQe2AKjBK0B2QKmBA_aAqcED9sCqAQe3AKrBK4B3QKsBLIB3gKtBBjfAq4EGOACrwQY4QKwBBjiArEEGOMCswQY5AK1BB7lArYEswHmArgEGOcCugQe6AK7BLQB6QK8BBjqAr0EGOsCvgQe7ALBBLUB7QLCBLkB7gLEBA3vAsUEDfACxwQN8QLIBA3yAskEDfMCywQN9ALNBB71As4EugH2AtAEDfcC0gQe-ALTBLsB-QLUBA36AtUEDfsC1gQe_ALZBLwB_QLaBMIB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${envVars.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: Role.STUDENT,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.STUDENT
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/module/auth/auth.service.ts
var register = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: Role.STUDENT
    }
  });
  if (!data.user) {
    throw new AppError_default(status5.BAD_REQUEST, "Failed to register student");
  }
  try {
    const student = await prisma.$transaction(async (tx) => {
      return await tx.student.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
          profilePhoto: payload.profilePhoto,
          contactNumber: payload.contactNumber,
          address: payload.address
        }
      });
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return {
      ...data,
      accessToken,
      refreshToken,
      student
    };
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: data.user.id
      }
    });
    throw error;
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new AppError_default(status5.NOT_FOUND, "Invalid email address");
  }
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status5.FORBIDDEN, "User is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status5.NOT_FOUND, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      student: {
        include: {
          enrolledClasses: true,
          assignedTasks: {
            where: {
              task: {
                isDeleted: false
              }
            },
            include: {
              task: true
            }
          },
          progress: true
        }
      },
      teacher: {
        include: {
          assignedClasses: true
        }
      },
      admin: true
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status5.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findFirst({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status5.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status5.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const updatedSession = await prisma.session.update({
    where: {
      id: isSessionTokenExists.id
    },
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: updatedSession.token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status5.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var googleLoginSuccess = async (session) => {
  const isStudentExists = await prisma.student.findUnique({
    where: {
      userId: session.user.id
    }
  });
  if (!isStudentExists) {
    await prisma.student.create({
      data: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    accessToken,
    refreshToken
  };
};
var AuthService = {
  register,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  googleLoginSuccess
};

// src/app/module/auth/auth.controller.ts
var register2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.register(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status6.CREATED,
      success: true,
      message: "User registered successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var loginUser2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var getMe2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await AuthService.getMe(user);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "User profile fetched successfully",
      data: result
    });
  }
);
var getNewToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!refreshToken) {
      throw new AppError_default(status6.UNAUTHORIZED, "Refresh token is missing");
    }
    if (!betterAuthSessionToken) {
      throw new AppError_default(status6.UNAUTHORIZED, "Session token is missing");
    }
    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken
      }
    });
  }
);
var changePassword2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.changePassword(payload, betterAuthSessionToken);
    const { accessToken, refreshToken, token } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Password changed successfully",
      data: result
    });
  }
);
var logoutUser2 = catchAsync(
  async (req, res) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.logoutUser(betterAuthSessionToken);
    CookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    CookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    CookieUtils.clearCookie(res, "better-auth.session_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "User logged out successfully",
      data: result
    });
  }
);
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  register: register2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/middleware/checkAuth.ts
import status7 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
    if (!sessionToken) {
      throw new Error("Unauthorized access! No session token provided.");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! User is not active.");
        }
        if (user.isDeleted) {
          throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! User is deleted.");
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(status7.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email
        };
      }
      const accessToken2 = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken2) {
        throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! No access token provided.");
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(status7.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/auth/auth.validation.ts
import { z as z2 } from "zod";
var studentRegistrationSchema = z2.object({
  name: z2.string({ error: "Name is required" }).min(1, "Name cannot be empty"),
  email: z2.string({ error: "Email is required" }).email("Invalid email format"),
  password: z2.string({ error: "Password is required" }).min(6, "Password must be at least 6 characters"),
  profilePhoto: z2.string().optional(),
  contactNumber: z2.string().optional(),
  address: z2.string().optional()
});
var loginSchema = z2.object({
  email: z2.string({ error: "Email is required" }).email("Invalid email format"),
  password: z2.string({ error: "Password is required" })
});
var changePasswordSchema = z2.object({
  currentPassword: z2.string({ error: "Current password is required" }),
  newPassword: z2.string({ error: "New password is required" }).min(6, "New password must be at least 6 characters")
});
var forgetPasswordSchema = z2.object({
  email: z2.string({ error: "Email is required" }).email("Invalid email format")
});
var resetPasswordSchema = z2.object({
  email: z2.string({ error: "Email is required" }).email("Invalid email format"),
  otp: z2.string({ error: "OTP is required" }),
  newPassword: z2.string({ error: "New password is required" }).min(6, "New password must be at least 6 characters")
});
var AuthValidation = {
  registration: studentRegistrationSchema,
  login: loginSchema,
  changePassword: changePasswordSchema,
  forgetPassword: forgetPasswordSchema,
  resetPassword: resetPasswordSchema
};

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequest(AuthValidation.registration),
  AuthController.register
);
router.post(
  "/login",
  validateRequest(AuthValidation.login),
  AuthController.loginUser
);
router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPER_ADMIN),
  AuthController.getMe
);
router.post(
  "/refresh-token",
  AuthController.getNewToken
);
router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPER_ADMIN),
  validateRequest(AuthValidation.changePassword),
  AuthController.changePassword
);
router.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPER_ADMIN),
  AuthController.logoutUser
);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);
var AuthRoutes = router;

// src/app/module/admin/admin.route.ts
import { Router as Router2 } from "express";

// src/app/module/admin/admin.controller.ts
import status9 from "http-status";

// src/app/module/admin/admin.service.ts
import status8 from "http-status";
var getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    where: {
      isDeleted: false
    },
    include: {
      user: true
    }
  });
  return admins;
};
var getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: true
    }
  });
  if (!admin) {
    throw new AppError_default(status8.NOT_FOUND, "Admin not found");
  }
  return admin;
};
var createAdmin = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (userExists) {
    throw new AppError_default(status8.CONFLICT, "User with this email already exists");
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: payload.admin.role || Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true
    }
  });
  try {
    const admin = await prisma.$transaction(async (tx) => {
      const adminData = await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.admin.name,
          email: payload.admin.email,
          role: payload.admin.role || Role.ADMIN,
          profilePhoto: payload.admin.profilePhoto,
          contactNumber: payload.admin.contactNumber
        }
      });
      return adminData;
    });
    return admin;
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var updateAdmin = async (id, payload) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!isAdminExist) {
    throw new AppError_default(status8.NOT_FOUND, "Admin not found");
  }
  const { role, ...adminData } = payload;
  const result = await prisma.$transaction(async (tx) => {
    if (role) {
      await tx.user.update({
        where: { id: isAdminExist.userId },
        data: { role }
      });
    }
    const updatedAdmin = await tx.admin.update({
      where: {
        id
      },
      data: {
        ...adminData,
        ...role && { role }
      },
      include: {
        user: true
      }
    });
    return updatedAdmin;
  });
  return result;
};
var deleteAdmin = async (id, user) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id
    }
  });
  if (!isAdminExist) {
    throw new AppError_default(status8.NOT_FOUND, "Admin not found");
  }
  if (isAdminExist.id === user.userId) {
    throw new AppError_default(status8.BAD_REQUEST, "You cannot delete yourself");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
      }
    });
    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId }
    });
    await tx.account.deleteMany({
      where: { userId: isAdminExist.userId }
    });
    const admin = await tx.admin.findUnique({
      where: { id },
      include: { user: true }
    });
    return admin;
  });
  return result;
};
var AdminService = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
};

// src/app/module/admin/admin.controller.ts
var getAllAdmins2 = catchAsync(
  async (req, res) => {
    const result = await AdminService.getAllAdmins();
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Admins fetched successfully",
      data: result
    });
  }
);
var getAdminById2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const admin = await AdminService.getAdminById(id);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Admin fetched successfully",
      data: admin
    });
  }
);
var createAdmin2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AdminService.createAdmin(payload);
    sendResponse(res, {
      httpStatusCode: status9.CREATED,
      success: true,
      message: "Admin created successfully",
      data: result
    });
  }
);
var updateAdmin2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedAdmin = await AdminService.updateAdmin(id, payload);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin
    });
  }
);
var deleteAdmin2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await AdminService.deleteAdmin(id, user);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result
    });
  }
);
var AdminController = {
  getAllAdmins: getAllAdmins2,
  getAdminById: getAdminById2,
  createAdmin: createAdmin2,
  updateAdmin: updateAdmin2,
  deleteAdmin: deleteAdmin2
};

// src/app/module/admin/admin.validation.ts
import { z as z3 } from "zod";
var createAdminValidationSchema = z3.object({
  password: z3.string().min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  admin: z3.object({
    name: z3.string().min(2, "Name must be at least 2 characters"),
    email: z3.string().email("Email must be valid"),
    role: z3.nativeEnum(Role).optional(),
    profilePhoto: z3.string().optional(),
    contactNumber: z3.string().optional()
  })
});
var updateAdminValidationSchema = z3.object({
  name: z3.string().optional(),
  role: z3.nativeEnum(Role).optional(),
  profilePhoto: z3.string().optional(),
  contactNumber: z3.string().optional()
});

// src/app/module/admin/admin.route.ts
var router2 = Router2();
router2.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllAdmins
);
router2.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAdminById
);
router2.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createAdminValidationSchema),
  AdminController.createAdmin
);
router2.put(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateAdminValidationSchema),
  AdminController.updateAdmin
);
router2.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.deleteAdmin
);
var AdminRoutes = router2;

// src/app/module/teacher/teacher.route.ts
import { Router as Router3 } from "express";

// src/app/module/teacher/teacher.controller.ts
import status11 from "http-status";

// src/app/module/teacher/teacher.service.ts
import status10 from "http-status";
var createTeacher = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.teacher.email
    }
  });
  if (userExists) {
    throw new AppError_default(status10.CONFLICT, "User with this email already exists");
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.teacher.email,
      password: payload.password,
      role: Role.TEACHER,
      name: payload.teacher.name,
      needPasswordChange: true
    }
  });
  try {
    const teacher = await prisma.$transaction(async (tx) => {
      const teacherData = await tx.teacher.create({
        data: {
          userId: userData.user.id,
          name: payload.teacher.name,
          email: payload.teacher.email,
          profilePhoto: payload.teacher.profilePhoto,
          contactNumber: payload.teacher.contactNumber,
          address: payload.teacher.address,
          registrationNumber: payload.teacher.registrationNumber,
          experience: payload.teacher.experience || 0,
          gender: payload.teacher.gender,
          qualification: payload.teacher.qualification,
          currentWorkingPlace: payload.teacher.currentWorkingPlace,
          designation: payload.teacher.designation,
          subject: payload.teacher.subject
        }
      });
      return teacherData;
    });
    return teacher;
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var getAllTeachers = async (filters, options) => {
  const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = options;
  const { searchTerm, name, email, gender, designation, qualification } = filters;
  const skip = (page - 1) * limit;
  const take = limit;
  const whereConditions = [];
  if (searchTerm) {
    whereConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { qualification: { contains: searchTerm, mode: "insensitive" } },
        { designation: { contains: searchTerm, mode: "insensitive" } }
      ]
    });
  }
  if (name) {
    whereConditions.push({ name: { contains: name, mode: "insensitive" } });
  }
  if (email) {
    whereConditions.push({ email: { contains: email, mode: "insensitive" } });
  }
  if (gender) {
    whereConditions.push({ gender });
  }
  if (designation) {
    whereConditions.push({ designation: { contains: designation, mode: "insensitive" } });
  }
  if (qualification) {
    whereConditions.push({ qualification: { contains: qualification, mode: "insensitive" } });
  }
  const where = {
    isDeleted: false,
    AND: whereConditions.length > 0 ? whereConditions : void 0
  };
  const orderBy = {
    [sortBy]: sortOrder
  };
  const teachers = await prisma.teacher.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          emailVerified: true,
          image: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true
        }
      },
      assignedClasses: { where: { isDeleted: false } }
    }
  });
  const total = await prisma.teacher.count({ where });
  return {
    teachers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};
var getSingleTeacher = async (id) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          emailVerified: true,
          image: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true
        }
      },
      assignedClasses: {
        where: { isDeleted: false },
        include: {
          organization: true
        }
      }
    }
  });
  if (!teacher) {
    throw new AppError_default(status10.NOT_FOUND, "Teacher not found");
  }
  return teacher;
};
var updateTeacher = async (id, payload) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!teacher) {
    throw new AppError_default(status10.NOT_FOUND, "Teacher not found");
  }
  if (teacher.isDeleted) {
    throw new AppError_default(status10.NOT_FOUND, "Teacher not found");
  }
  const updatedTeacher = await prisma.$transaction(async (tx) => {
    const teacherData = await tx.teacher.update({
      where: { id },
      data: payload.teacher
    });
    const userUpdateData = {};
    if (payload.teacher?.name) {
      userUpdateData.name = payload.teacher.name;
    }
    if (payload.teacher?.profilePhoto) {
      userUpdateData.image = payload.teacher.profilePhoto;
    }
    if (Object.keys(userUpdateData).length > 0) {
      await tx.user.update({
        where: { id: teacher.userId },
        data: userUpdateData
      });
    }
    return teacherData;
  });
  return updatedTeacher;
};
var deleteTeacher = async (id) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!teacher) {
    throw new AppError_default(status10.NOT_FOUND, "Teacher not found");
  }
  if (teacher.isDeleted) {
    throw new AppError_default(status10.NOT_FOUND, "Teacher already deleted");
  }
  await prisma.$transaction(async (tx) => {
    await tx.teacher.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: { id: teacher.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: "DELETED"
      }
    });
  });
  return { message: "Teacher deleted successfully" };
};
var TeacherService = {
  createTeacher,
  getAllTeachers,
  getSingleTeacher,
  updateTeacher,
  deleteTeacher
};

// src/app/module/teacher/teacher.controller.ts
var createTeacher2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await TeacherService.createTeacher(payload);
    sendResponse(res, {
      httpStatusCode: status11.CREATED,
      success: true,
      message: "Teacher registered successfully",
      data: result
    });
  }
);
var getAllTeachers2 = catchAsync(
  async (req, res) => {
    const filters = {
      searchTerm: req.query.searchTerm,
      name: req.query.name,
      email: req.query.email,
      gender: req.query.gender,
      designation: req.query.designation,
      qualification: req.query.qualification,
      subject: req.query.subject
    };
    const options = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc"
    };
    const result = await TeacherService.getAllTeachers(filters, options);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Teachers retrieved successfully",
      data: result
    });
  }
);
var getSingleTeacher2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await TeacherService.getSingleTeacher(id);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Teacher retrieved successfully",
      data: result
    });
  }
);
var updateTeacher2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await TeacherService.updateTeacher(id, payload);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Teacher updated successfully",
      data: result
    });
  }
);
var deleteTeacher2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await TeacherService.deleteTeacher(id);
    sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "Teacher deleted successfully",
      data: result
    });
  }
);
var TeacherController = {
  createTeacher: createTeacher2,
  getAllTeachers: getAllTeachers2,
  getSingleTeacher: getSingleTeacher2,
  updateTeacher: updateTeacher2,
  deleteTeacher: deleteTeacher2
};

// src/app/module/teacher/teacher.validation.ts
import z4 from "zod";
var createTeacherZodSchema = z4.object({
  password: z4.string().min(5, "Password must be at least 5 characters").max(20, "Password must be at most 20 characters"),
  teacher: z4.object({
    name: z4.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
    email: z4.string().email("Invalid email address"),
    profilePhoto: z4.string().optional(),
    contactNumber: z4.string().optional(),
    address: z4.string().optional(),
    registrationNumber: z4.string(),
    experience: z4.number().optional().default(0),
    gender: z4.nativeEnum(Gender),
    qualification: z4.string(),
    currentWorkingPlace: z4.string().optional(),
    designation: z4.string(),
    subject: z4.string()
  })
});
var updateTeacherZodSchema = z4.object({
  teacher: z4.object({
    name: z4.string().min(2).max(100).optional(),
    profilePhoto: z4.string().optional(),
    contactNumber: z4.string().optional(),
    address: z4.string().optional(),
    registrationNumber: z4.string().optional(),
    experience: z4.number().optional(),
    gender: z4.nativeEnum(Gender).optional(),
    qualification: z4.string().optional(),
    currentWorkingPlace: z4.string().optional(),
    designation: z4.string().optional(),
    subject: z4.string().optional()
  }).optional()
});
var getTeachersZodSchema = z4.object({
  page: z4.coerce.number().optional().default(1),
  limit: z4.coerce.number().optional().default(10),
  sortBy: z4.string().optional().default("createdAt"),
  sortOrder: z4.enum(["asc", "desc"]).optional().default("desc"),
  searchTerm: z4.string().optional(),
  name: z4.string().optional(),
  email: z4.string().optional(),
  gender: z4.nativeEnum(Gender).optional(),
  designation: z4.string().optional(),
  qualification: z4.string().optional(),
  subject: z4.string().optional()
});

// src/app/module/teacher/teacher.route.ts
var router3 = Router3();
router3.post(
  "/create-teacher",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTeacherZodSchema),
  TeacherController.createTeacher
);
router3.get(
  "/",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherController.getAllTeachers
);
router3.get(
  "/:id",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherController.getSingleTeacher
);
router3.patch(
  "/:id",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTeacherZodSchema),
  TeacherController.updateTeacher
);
router3.delete(
  "/:id",
  // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TeacherController.deleteTeacher
);
var TeacherRoutes = router3;

// src/app/module/student/student.route.ts
import { Router as Router4 } from "express";

// src/app/module/student/student.controller.ts
import status13 from "http-status";

// src/app/module/student/student.service.ts
import status12 from "http-status";
var getAllStudents = async () => {
  const students = await prisma.student.findMany({
    where: {
      isDeleted: false
    },
    include: {
      user: true,
      enrolledClasses: {
        where: {
          class: {
            isDeleted: false
          }
        },
        include: {
          class: true
        }
      },
      assignedTasks: {
        where: {
          task: {
            isDeleted: false
          }
        },
        include: {
          task: true
        }
      },
      progress: true
    }
  });
  return students;
};
var getStudentById = async (id) => {
  const student = await prisma.student.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: true,
      enrolledClasses: {
        where: {
          class: {
            isDeleted: false
          }
        },
        include: {
          class: {
            include: {
              organization: true,
              teacher: true,
              tasks: {
                where: {
                  isDeleted: false
                }
              },
              messages: {
                where: {
                  isDeleted: false
                }
              }
            }
          }
        }
      },
      assignedTasks: {
        where: {
          task: {
            isDeleted: false
          }
        },
        include: {
          task: true
        }
      },
      progress: {
        include: {
          quiz: true
        }
      }
    }
  });
  if (!student) {
    throw new AppError_default(status12.NOT_FOUND, "Student not found");
  }
  return student;
};
var createStudent = async (userId, payload) => {
  const isStudentExist = await prisma.student.findUnique({
    where: {
      email: payload.email
    }
  });
  if (isStudentExist) {
    throw new AppError_default(status12.CONFLICT, "Student with this email already exists");
  }
  const newStudent = await prisma.student.create({
    data: {
      ...payload,
      userId
    },
    include: {
      user: true
    }
  });
  return newStudent;
};
var updateStudent = async (id, payload) => {
  const isStudentExist = await prisma.student.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: { user: true }
  });
  if (!isStudentExist) {
    throw new AppError_default(status12.NOT_FOUND, "Student not found");
  }
  const updatedStudent = await prisma.$transaction(async (tx) => {
    const studentData = await tx.student.update({
      where: {
        id
      },
      data: {
        ...payload
      },
      include: {
        user: true,
        enrolledClasses: true
      }
    });
    const userUpdateData = {};
    if (payload.name) {
      userUpdateData.name = payload.name;
    }
    if (payload.profilePhoto) {
      userUpdateData.image = payload.profilePhoto;
    }
    if (Object.keys(userUpdateData).length > 0) {
      await tx.user.update({
        where: { id: isStudentExist.userId },
        data: userUpdateData
      });
    }
    return studentData;
  });
  return updatedStudent;
};
var enrollInClass = async (studentId, payload) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
      isDeleted: false
    }
  });
  if (!student) {
    throw new AppError_default(status12.NOT_FOUND, "Student not found");
  }
  const classExists = await prisma.class.findUnique({
    where: {
      id: payload.classId,
      isDeleted: false
    }
  });
  if (!classExists) {
    throw new AppError_default(status12.NOT_FOUND, "Class not found");
  }
  const alreadyEnrolled = await prisma.studentClass.findFirst({
    where: {
      studentId,
      classId: payload.classId
    }
  });
  if (alreadyEnrolled) {
    throw new AppError_default(status12.CONFLICT, "Student is already enrolled in this class");
  }
  const enrollment = await prisma.studentClass.create({
    data: {
      studentId,
      classId: payload.classId
    },
    include: {
      student: true,
      class: true
    }
  });
  return enrollment;
};
var deleteStudent = async (id) => {
  const isStudentExist = await prisma.student.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });
  if (!isStudentExist) {
    throw new AppError_default(status12.NOT_FOUND, "Student not found");
  }
  const deletedStudent = await prisma.$transaction(async (tx) => {
    const studentData = await tx.student.update({
      where: {
        id
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: {
        id: isStudentExist.userId
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: "DELETED"
      }
    });
    return studentData;
  });
  return deletedStudent;
};
var StudentService = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  enrollInClass,
  deleteStudent
};

// src/app/module/student/student.controller.ts
var getAllStudents2 = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudents();
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Students retrieved successfully",
    data: result
  });
});
var getStudentById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getStudentById(id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Student retrieved successfully",
    data: result
  });
});
var createStudent2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: status13.UNAUTHORIZED,
      success: false,
      message: "User not authenticated"
    });
  }
  const result = await StudentService.createStudent(userId, payload);
  sendResponse(res, {
    httpStatusCode: status13.CREATED,
    success: true,
    message: "Student created successfully",
    data: result
  });
});
var updateStudent2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await StudentService.updateStudent(id, payload);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Student updated successfully",
    data: result
  });
});
var enrollInClass2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await StudentService.enrollInClass(id, payload);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Student enrolled in class successfully",
    data: result
  });
});
var deleteStudent2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.deleteStudent(id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Student deleted successfully",
    data: result
  });
});
var StudentController = {
  getAllStudents: getAllStudents2,
  getStudentById: getStudentById2,
  createStudent: createStudent2,
  updateStudent: updateStudent2,
  enrollInClass: enrollInClass2,
  deleteStudent: deleteStudent2
};

// src/app/module/student/student.validation.ts
import { z as z5 } from "zod";
var createStudentValidationSchema = z5.object({
  name: z5.string().min(2, "Name must be at least 2 characters"),
  email: z5.string().email("Email must be valid"),
  profilePhoto: z5.string().optional(),
  contactNumber: z5.string().optional(),
  address: z5.string().optional()
});
var updateStudentValidationSchema = z5.object({
  name: z5.string().optional(),
  profilePhoto: z5.string().optional(),
  contactNumber: z5.string().optional(),
  address: z5.string().optional()
});
var enrollStudentValidationSchema = z5.object({
  classId: z5.string().min(1, "Class ID is required")
});

// src/app/module/student/student.route.ts
var router4 = Router4();
router4.get("/", StudentController.getAllStudents);
router4.get("/:id", StudentController.getStudentById);
router4.put(
  "/:id",
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent
);
router4.post(
  "/:id/enroll",
  validateRequest(enrollStudentValidationSchema),
  StudentController.enrollInClass
);
router4.delete("/:id", StudentController.deleteStudent);
var StudentRoutes = router4;

// src/app/module/organization/organization.route.ts
import { Router as Router5 } from "express";

// src/app/module/organization/organization.controller.ts
import status15 from "http-status";

// src/app/module/organization/organization.service.ts
import status14 from "http-status";
var getAllOrganizations = async () => {
  return await prisma.organization.findMany({
    where: { isDeleted: false },
    include: {
      parent: true,
      children: { where: { isDeleted: false } },
      classes: { where: { isDeleted: false } },
      lookups: { where: { isDeleted: false } }
    }
  });
};
var getOrganizationById = async (id) => {
  const org = await prisma.organization.findUnique({
    where: { id, isDeleted: false },
    include: {
      parent: true,
      children: { where: { isDeleted: false } },
      classes: { where: { isDeleted: false } },
      lookups: { where: { isDeleted: false } }
    }
  });
  if (!org) throw new AppError_default(status14.NOT_FOUND, "Organization not found");
  return org;
};
var createOrganization = async (payload) => {
  if (payload.parentId) {
    const parent = await prisma.organization.findUnique({
      where: { id: payload.parentId }
    });
    if (!parent) throw new AppError_default(status14.NOT_FOUND, "Parent organization not found");
  }
  return await prisma.organization.create({
    data: payload,
    include: { parent: true, children: true }
  });
};
var updateOrganization = async (id, payload) => {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw new AppError_default(status14.NOT_FOUND, "Organization not found");
  return await prisma.organization.update({
    where: { id },
    data: payload,
    include: {
      parent: true,
      children: { where: { isDeleted: false } },
      classes: { where: { isDeleted: false } }
    }
  });
};
var deleteOrganization = async (id) => {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw new AppError_default(status14.NOT_FOUND, "Organization not found");
  return await prisma.organization.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var OrganizationService = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization
};

// src/app/module/organization/organization.controller.ts
var getAllOrganizations2 = catchAsync(async (req, res) => {
  const result = await OrganizationService.getAllOrganizations();
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Organizations retrieved successfully",
    data: result
  });
});
var getOrganizationById2 = catchAsync(async (req, res) => {
  const result = await OrganizationService.getOrganizationById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Organization retrieved successfully",
    data: result
  });
});
var createOrganization2 = catchAsync(async (req, res) => {
  const result = await OrganizationService.createOrganization(req.body);
  sendResponse(res, {
    httpStatusCode: status15.CREATED,
    success: true,
    message: "Organization created successfully",
    data: result
  });
});
var updateOrganization2 = catchAsync(async (req, res) => {
  const result = await OrganizationService.updateOrganization(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Organization updated successfully",
    data: result
  });
});
var deleteOrganization2 = catchAsync(async (req, res) => {
  const result = await OrganizationService.deleteOrganization(req.params.id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Organization deleted successfully",
    data: result
  });
});
var OrganizationController = {
  getAllOrganizations: getAllOrganizations2,
  getOrganizationById: getOrganizationById2,
  createOrganization: createOrganization2,
  updateOrganization: updateOrganization2,
  deleteOrganization: deleteOrganization2
};

// src/app/module/organization/organization.validation.ts
import { z as z6 } from "zod";
var createOrganizationValidationSchema = z6.object({
  name: z6.string({ error: "Name is required" }).min(2),
  description: z6.string().optional(),
  parentId: z6.string().optional()
});
var updateOrganizationValidationSchema = z6.object({
  name: z6.string().optional(),
  description: z6.string().optional(),
  parentId: z6.string().optional()
});

// src/app/module/organization/organization.route.ts
var router5 = Router5();
router5.get("/", OrganizationController.getAllOrganizations);
router5.get("/:id", OrganizationController.getOrganizationById);
router5.post("/", validateRequest(createOrganizationValidationSchema), OrganizationController.createOrganization);
router5.put("/:id", validateRequest(updateOrganizationValidationSchema), OrganizationController.updateOrganization);
router5.delete("/:id", OrganizationController.deleteOrganization);
var OrganizationRoutes = router5;

// src/app/module/class/class.route.ts
import { Router as Router6 } from "express";

// src/app/module/class/class.controller.ts
import status17 from "http-status";

// src/app/module/class/class.service.ts
import status16 from "http-status";
var getAllClasses = async () => {
  return await prisma.class.findMany({
    where: { isDeleted: false },
    include: { organization: true, teacher: true, students: true, tasks: true, messages: true }
  });
};
var getClassById = async (id) => {
  const cls = await prisma.class.findUnique({
    where: { id, isDeleted: false },
    include: { organization: true, teacher: true, students: { include: { student: true } }, tasks: true, messages: true }
  });
  if (!cls) throw new AppError_default(status16.NOT_FOUND, "Class not found");
  return cls;
};
var createClass = async (payload) => {
  const org = await prisma.organization.findUnique({ where: { id: payload.organizationId } });
  if (!org) throw new AppError_default(status16.NOT_FOUND, "Organization not found");
  if (payload.teacherId) {
    const teacher = await prisma.teacher.findUnique({ where: { id: payload.teacherId } });
    if (!teacher) throw new AppError_default(status16.NOT_FOUND, "Teacher not found");
  }
  return await prisma.class.create({
    data: payload,
    include: { organization: true, teacher: true }
  });
};
var updateClass = async (id, payload) => {
  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) throw new AppError_default(status16.NOT_FOUND, "Class not found");
  if (payload.teacherId) {
    const teacher = await prisma.teacher.findUnique({ where: { id: payload.teacherId } });
    if (!teacher) throw new AppError_default(status16.NOT_FOUND, "Teacher not found");
  }
  return await prisma.class.update({
    where: { id },
    data: payload,
    include: { organization: true, teacher: true, students: true }
  });
};
var deleteClass = async (id) => {
  const cls = await prisma.class.findUnique({ where: { id } });
  if (!cls) throw new AppError_default(status16.NOT_FOUND, "Class not found");
  return await prisma.class.delete({
    where: { id }
  });
};
var ClassService = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};

// src/app/module/class/class.controller.ts
var getAllClasses2 = catchAsync(async (req, res) => {
  const result = await ClassService.getAllClasses();
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Classes retrieved successfully",
    data: result
  });
});
var getClassById2 = catchAsync(async (req, res) => {
  const result = await ClassService.getClassById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Class retrieved successfully",
    data: result
  });
});
var createClass2 = catchAsync(async (req, res) => {
  const result = await ClassService.createClass(req.body);
  sendResponse(res, {
    httpStatusCode: status17.CREATED,
    success: true,
    message: "Class created successfully",
    data: result
  });
});
var updateClass2 = catchAsync(async (req, res) => {
  const result = await ClassService.updateClass(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Class updated successfully",
    data: result
  });
});
var deleteClass2 = catchAsync(async (req, res) => {
  const result = await ClassService.deleteClass(req.params.id);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Class deleted successfully",
    data: result
  });
});
var ClassController = {
  getAllClasses: getAllClasses2,
  getClassById: getClassById2,
  createClass: createClass2,
  updateClass: updateClass2,
  deleteClass: deleteClass2
};

// src/app/module/class/class.validation.ts
import { z as z7 } from "zod";
var createClassValidationSchema = z7.object({
  name: z7.string({ error: "Name is required" }).min(2),
  description: z7.string().optional(),
  classNumber: z7.coerce.number().optional(),
  sectionCode: z7.string().optional(),
  academicYear: z7.string().optional(),
  organizationId: z7.string({ error: "Organization ID is required" }),
  teacherId: z7.string().optional()
});
var updateClassValidationSchema = z7.object({
  name: z7.string().optional(),
  description: z7.string().optional(),
  classNumber: z7.coerce.number().optional(),
  sectionCode: z7.string().optional(),
  academicYear: z7.string().optional(),
  teacherId: z7.string().optional()
});

// src/app/module/class/class.route.ts
var router6 = Router6();
router6.get("/", ClassController.getAllClasses);
router6.get("/:id", ClassController.getClassById);
router6.post("/", validateRequest(createClassValidationSchema), ClassController.createClass);
router6.put("/:id", validateRequest(updateClassValidationSchema), ClassController.updateClass);
router6.delete("/:id", ClassController.deleteClass);
var ClassRoutes = router6;

// src/app/module/lookup/lookup.route.ts
import { Router as Router7 } from "express";

// src/app/module/lookup/lookup.controller.ts
import status19 from "http-status";

// src/app/module/lookup/lookup.service.ts
import status18 from "http-status";
var getAllLookups = async () => {
  return await prisma.lookup.findMany({
    where: { isDeleted: false },
    include: { organization: true, values: true }
  });
};
var getLookupById = async (id) => {
  const lookup = await prisma.lookup.findUnique({
    where: { id, isDeleted: false },
    include: { organization: true, values: true }
  });
  if (!lookup) throw new AppError_default(status18.NOT_FOUND, "Lookup not found");
  return lookup;
};
var createLookup = async (payload) => {
  return await prisma.lookup.create({
    data: payload,
    include: { organization: true, values: true }
  });
};
var updateLookup = async (id, payload) => {
  const lookup = await prisma.lookup.findUnique({ where: { id } });
  if (!lookup) throw new AppError_default(status18.NOT_FOUND, "Lookup not found");
  return await prisma.lookup.update({
    where: { id },
    data: payload,
    include: { organization: true, values: true }
  });
};
var deleteLookup = async (id) => {
  const lookup = await prisma.lookup.findUnique({ where: { id } });
  if (!lookup) throw new AppError_default(status18.NOT_FOUND, "Lookup not found");
  return await prisma.lookup.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var addLookupValue = async (lookupId, payload) => {
  const lookup = await prisma.lookup.findUnique({ where: { id: lookupId } });
  if (!lookup) throw new AppError_default(status18.NOT_FOUND, "Lookup not found");
  return await prisma.lookupValue.create({
    data: { ...payload, lookupId }
  });
};
var LookupService = {
  getAllLookups,
  getLookupById,
  createLookup,
  updateLookup,
  deleteLookup,
  addLookupValue
};

// src/app/module/lookup/lookup.controller.ts
var getAllLookups2 = catchAsync(async (req, res) => {
  const result = await LookupService.getAllLookups();
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Lookups retrieved successfully",
    data: result
  });
});
var getLookupById2 = catchAsync(async (req, res) => {
  const result = await LookupService.getLookupById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Lookup retrieved successfully",
    data: result
  });
});
var createLookup2 = catchAsync(async (req, res) => {
  const result = await LookupService.createLookup(req.body);
  sendResponse(res, {
    httpStatusCode: status19.CREATED,
    success: true,
    message: "Lookup created successfully",
    data: result
  });
});
var updateLookup2 = catchAsync(async (req, res) => {
  const result = await LookupService.updateLookup(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Lookup updated successfully",
    data: result
  });
});
var deleteLookup2 = catchAsync(async (req, res) => {
  const result = await LookupService.deleteLookup(req.params.id);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Lookup deleted successfully",
    data: result
  });
});
var addLookupValue2 = catchAsync(async (req, res) => {
  const result = await LookupService.addLookupValue(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status19.CREATED,
    success: true,
    message: "Lookup value added successfully",
    data: result
  });
});
var LookupController = {
  getAllLookups: getAllLookups2,
  getLookupById: getLookupById2,
  createLookup: createLookup2,
  updateLookup: updateLookup2,
  deleteLookup: deleteLookup2,
  addLookupValue: addLookupValue2
};

// src/app/module/lookup/lookup.route.ts
var router7 = Router7();
router7.get("/", LookupController.getAllLookups);
router7.get("/:id", LookupController.getLookupById);
router7.post("/", LookupController.createLookup);
router7.put("/:id", LookupController.updateLookup);
router7.delete("/:id", LookupController.deleteLookup);
router7.post("/:id/values", LookupController.addLookupValue);
var LookupRoutes = router7;

// src/app/module/word-story-card/word-story-card.route.ts
import { Router as Router8 } from "express";

// src/app/module/word-story-card/word-story-card.controller.ts
import status21 from "http-status";

// src/app/module/word-story-card/word-story-card.service.ts
import status20 from "http-status";
var getAllCards = async () => {
  return await prisma.wordStoryCard.findMany({
    where: { isDeleted: false },
    include: { cardContents: true, quizzes: true, materials: true, assessments: true }
  });
};
var getCardById = async (id) => {
  const card = await prisma.wordStoryCard.findUnique({
    where: { id, isDeleted: false },
    include: { cardContents: true, quizzes: true, materials: true, assessments: true }
  });
  if (!card) throw new AppError_default(status20.NOT_FOUND, "Card not found");
  return card;
};
var createCard = async (payload) => {
  return await prisma.wordStoryCard.create({
    data: payload,
    include: { cardContents: true, quizzes: true, materials: true }
  });
};
var updateCard = async (id, payload) => {
  const card = await prisma.wordStoryCard.findUnique({ where: { id } });
  if (!card) throw new AppError_default(status20.NOT_FOUND, "Card not found");
  return await prisma.wordStoryCard.update({
    where: { id },
    data: payload,
    include: { cardContents: true, quizzes: true, materials: true, assessments: true }
  });
};
var deleteCard = async (id) => {
  const card = await prisma.wordStoryCard.findUnique({ where: { id } });
  if (!card) throw new AppError_default(status20.NOT_FOUND, "Card not found");
  return await prisma.wordStoryCard.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var publishCard = async (id) => {
  const card = await prisma.wordStoryCard.findUnique({ where: { id } });
  if (!card) throw new AppError_default(status20.NOT_FOUND, "Card not found");
  return await prisma.wordStoryCard.update({
    where: { id },
    data: { status: "PUBLISHED" },
    include: { cardContents: true, quizzes: true, materials: true, assessments: true }
  });
};
var getPublishedCards = async () => {
  return await prisma.wordStoryCard.findMany({
    where: { isDeleted: false, status: "PUBLISHED" },
    include: { cardContents: true, quizzes: true, materials: true, assessments: true }
  });
};
var WordStoryCardService = {
  getAllCards,
  getPublishedCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  publishCard
};

// src/app/module/word-story-card/word-story-card.controller.ts
var getAllCards2 = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.getAllCards();
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Cards retrieved successfully",
    data: result
  });
});
var getCardById2 = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.getCardById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Card retrieved successfully",
    data: result
  });
});
var createCard2 = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.createCard(req.body);
  sendResponse(res, {
    httpStatusCode: status21.CREATED,
    success: true,
    message: "Card created successfully",
    data: result
  });
});
var updateCard2 = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.updateCard(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Card updated successfully",
    data: result
  });
});
var deleteCard2 = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.deleteCard(req.params.id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Card deleted successfully",
    data: result
  });
});
var publishCard2 = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.publishCard(req.params.id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Card published successfully",
    data: result
  });
});
var WordStoryCardController = {
  getAllCards: getAllCards2,
  getCardById: getCardById2,
  createCard: createCard2,
  updateCard: updateCard2,
  deleteCard: deleteCard2,
  publishCard: publishCard2
};

// src/app/module/word-story-card/word-story-card.route.ts
var router8 = Router8();
router8.get("/", WordStoryCardController.getAllCards);
router8.get("/:id", WordStoryCardController.getCardById);
router8.post("/", WordStoryCardController.createCard);
router8.put("/:id", WordStoryCardController.updateCard);
router8.delete("/:id", WordStoryCardController.deleteCard);
router8.post("/:id/publish", WordStoryCardController.publishCard);
var WordStoryCardRoutes = router8;

// src/app/module/message/message.route.ts
import { Router as Router9 } from "express";

// src/app/module/message/message.controller.ts
import status23 from "http-status";

// src/app/module/message/message.service.ts
import status22 from "http-status";
var getAllMessages = async () => {
  return await prisma.message.findMany({
    where: { isDeleted: false },
    include: { sender: true, receiver: true, class: true }
  });
};
var getMessageById = async (id) => {
  const message = await prisma.message.findUnique({
    where: { id, isDeleted: false },
    include: { sender: true, receiver: true, class: true }
  });
  if (!message) throw new AppError_default(status22.NOT_FOUND, "Message not found");
  return message;
};
var createMessage = async (payload) => {
  return await prisma.message.create({
    data: payload,
    include: { sender: true, receiver: true, class: true }
  });
};
var updateMessage = async (id, payload) => {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError_default(status22.NOT_FOUND, "Message not found");
  return await prisma.message.update({
    where: { id },
    data: payload,
    include: { sender: true, receiver: true, class: true }
  });
};
var deleteMessage = async (id) => {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError_default(status22.NOT_FOUND, "Message not found");
  return await prisma.message.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var markAsRead = async (id) => {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError_default(status22.NOT_FOUND, "Message not found");
  return await prisma.message.update({
    where: { id },
    data: { isRead: true },
    include: { sender: true, receiver: true, class: true }
  });
};
var MessageService = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead
};

// src/app/module/message/message.controller.ts
var getAllMessages2 = catchAsync(async (req, res) => {
  const result = await MessageService.getAllMessages();
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Messages retrieved successfully",
    data: result
  });
});
var getMessageById2 = catchAsync(async (req, res) => {
  const result = await MessageService.getMessageById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Message retrieved successfully",
    data: result
  });
});
var createMessage2 = catchAsync(async (req, res) => {
  const result = await MessageService.createMessage(req.body);
  sendResponse(res, {
    httpStatusCode: status23.CREATED,
    success: true,
    message: "Message created successfully",
    data: result
  });
});
var updateMessage2 = catchAsync(async (req, res) => {
  const result = await MessageService.updateMessage(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Message updated successfully",
    data: result
  });
});
var deleteMessage2 = catchAsync(async (req, res) => {
  const result = await MessageService.deleteMessage(req.params.id);
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Message deleted successfully",
    data: result
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  const result = await MessageService.markAsRead(req.params.id);
  sendResponse(res, {
    httpStatusCode: status23.OK,
    success: true,
    message: "Message marked as read successfully",
    data: result
  });
});
var MessageController = {
  getAllMessages: getAllMessages2,
  getMessageById: getMessageById2,
  createMessage: createMessage2,
  updateMessage: updateMessage2,
  deleteMessage: deleteMessage2,
  markAsRead: markAsRead2
};

// src/app/module/message/message.route.ts
var router9 = Router9();
router9.get("/", MessageController.getAllMessages);
router9.get("/:id", MessageController.getMessageById);
router9.post("/", MessageController.createMessage);
router9.put("/:id", MessageController.updateMessage);
router9.delete("/:id", MessageController.deleteMessage);
router9.post("/:id/read", MessageController.markAsRead);
var MessageRoutes = router9;

// src/app/module/task/task.route.ts
import { Router as Router10 } from "express";

// src/app/module/task/task.controller.ts
import status25 from "http-status";

// src/app/module/task/task.service.ts
import status24 from "http-status";
var getAllTasks = async () => {
  return await prisma.task.findMany({
    where: { isDeleted: false },
    include: { class: true, assignedTo: { include: { student: true } } }
  });
};
var getTaskById = async (id) => {
  const task = await prisma.task.findUnique({
    where: { id, isDeleted: false },
    include: { class: true, card: true, assignedTo: { include: { student: true } } }
  });
  if (!task) throw new AppError_default(status24.NOT_FOUND, "Task not found");
  return task;
};
var createTask = async (payload) => {
  return await prisma.task.create({
    data: payload,
    include: { class: true, assignedTo: true }
  });
};
var updateTask = async (id, payload) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError_default(status24.NOT_FOUND, "Task not found");
  return await prisma.task.update({
    where: { id },
    data: payload,
    include: { class: true, assignedTo: true }
  });
};
var assignCardToStudent = async (cardId, payload) => {
  const card = await prisma.wordStoryCard.findUnique({
    where: { id: cardId, isDeleted: false }
  });
  if (!card) throw new AppError_default(status24.NOT_FOUND, "WordStoryCard not found");
  const student = await prisma.student.findUnique({
    where: { id: payload.studentId, isDeleted: false }
  });
  if (!student) throw new AppError_default(status24.NOT_FOUND, "Student not found");
  return await prisma.$transaction(async (tx) => {
    let task = await tx.task.findFirst({
      where: { cardId, isDeleted: false }
    });
    if (!task) {
      task = await tx.task.create({
        data: {
          title: card.title,
          description: card.description,
          cardId,
          status: "PENDING"
        }
      });
    }
    const existingAssignment = await tx.studentTask.findFirst({
      where: { studentId: payload.studentId, taskId: task.id }
    });
    if (existingAssignment) {
      throw new AppError_default(status24.BAD_REQUEST, "Already assigned");
    }
    await tx.studentTask.create({
      data: { studentId: payload.studentId, taskId: task.id }
    });
    return await tx.task.findUnique({
      where: { id: task.id },
      include: { class: true, assignedTo: { include: { student: true } } }
    });
  }, {
    timeout: 15e3
    // সেফটির জন্য ১৫ সেকেন্ড সেট করুন
  });
};
var deleteTask = async (id) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError_default(status24.NOT_FOUND, "Task not found");
  return await prisma.task.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var TaskService = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  assignCardToStudent,
  deleteTask
};

// src/app/module/task/task.controller.ts
var getAllTasks2 = catchAsync(async (req, res) => {
  const result = await TaskService.getAllTasks();
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result
  });
});
var getTaskById2 = catchAsync(async (req, res) => {
  const result = await TaskService.getTaskById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result
  });
});
var createTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.createTask(req.body);
  sendResponse(res, {
    httpStatusCode: status25.CREATED,
    success: true,
    message: "Task created successfully",
    data: result
  });
});
var updateTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.updateTask(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Task updated successfully",
    data: result
  });
});
var assignCardToStudent2 = catchAsync(async (req, res) => {
  const result = await TaskService.assignCardToStudent(req.params.cardId, req.body);
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Card assigned to student successfully",
    data: result
  });
});
var deleteTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.deleteTask(req.params.id);
  sendResponse(res, {
    httpStatusCode: status25.OK,
    success: true,
    message: "Task deleted successfully",
    data: result
  });
});
var TaskController = {
  getAllTasks: getAllTasks2,
  getTaskById: getTaskById2,
  createTask: createTask2,
  updateTask: updateTask2,
  assignCardToStudent: assignCardToStudent2,
  deleteTask: deleteTask2
};

// src/app/module/task/task.validation.ts
import { z as z8 } from "zod";
var taskStatusEnum = z8.enum(["PENDING", "COMPLETED", "IN_PROGRESS"]);
var createTaskSchema = z8.object({
  body: z8.object({
    title: z8.string().min(1, { message: "Title is required and cannot be empty" }),
    description: z8.string().optional(),
    cardId: z8.string().optional(),
    classId: z8.string().optional(),
    dueDate: z8.string().optional().transform((str) => str ? new Date(str) : void 0),
    status: taskStatusEnum.optional()
  })
});
var updateTaskSchema = z8.object({
  body: z8.object({
    title: z8.string().optional(),
    description: z8.string().optional(),
    cardId: z8.string().optional(),
    classId: z8.string().optional(),
    dueDate: z8.string().optional().transform((str) => str ? new Date(str) : void 0),
    status: taskStatusEnum.optional()
  })
});
var assignTaskSchema = z8.object({
  body: z8.object({
    studentId: z8.string().min(1, { message: "Student ID is required" })
  })
});
var assignCardSchema = z8.object({
  studentId: z8.string().min(1, { message: "Student ID is required" })
});
var TaskValidation = {
  createTask: createTaskSchema,
  updateTask: updateTaskSchema,
  assignTask: assignTaskSchema,
  assignCard: assignCardSchema
};

// src/app/module/task/task.route.ts
var router10 = Router10();
router10.get("/", TaskController.getAllTasks);
router10.get("/:id", TaskController.getTaskById);
router10.post("/", TaskController.createTask);
router10.put("/:id", TaskController.updateTask);
router10.post("/:cardId/assign", validateRequest(TaskValidation.assignCard), TaskController.assignCardToStudent);
router10.delete("/:id", TaskController.deleteTask);
var TaskRoutes = router10;

// src/app/module/quiz/quiz.route.ts
import { Router as Router11 } from "express";

// src/app/module/quiz/quiz.controller.ts
import status27 from "http-status";

// src/app/module/quiz/quiz.service.ts
import status26 from "http-status";
var getAllQuizzes = async () => {
  return await prisma.quiz.findMany({
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var getQuizById = async (id) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
  if (!quiz) throw new AppError_default(status26.NOT_FOUND, "Quiz not found");
  return quiz;
};
var createQuiz = async (payload) => {
  return await prisma.quiz.create({
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var updateQuiz = async (id, payload) => {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new AppError_default(status26.NOT_FOUND, "Quiz not found");
  return await prisma.quiz.update({
    where: { id },
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var deleteQuiz = async (id) => {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new AppError_default(status26.NOT_FOUND, "Quiz not found");
  return await prisma.quiz.delete({
    where: { id }
  });
};
var QuizService = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
};

// src/app/module/quiz/quiz.controller.ts
var getAllQuizzes2 = catchAsync(async (req, res) => {
  const result = await QuizService.getAllQuizzes();
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Quizzes retrieved successfully",
    data: result
  });
});
var getQuizById2 = catchAsync(async (req, res) => {
  const result = await QuizService.getQuizById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Quiz retrieved successfully",
    data: result
  });
});
var createQuiz2 = catchAsync(async (req, res) => {
  const result = await QuizService.createQuiz(req.body);
  sendResponse(res, {
    httpStatusCode: status27.CREATED,
    success: true,
    message: "Quiz created successfully",
    data: result
  });
});
var updateQuiz2 = catchAsync(async (req, res) => {
  const result = await QuizService.updateQuiz(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Quiz updated successfully",
    data: result
  });
});
var deleteQuiz2 = catchAsync(async (req, res) => {
  const result = await QuizService.deleteQuiz(req.params.id);
  sendResponse(res, {
    httpStatusCode: status27.OK,
    success: true,
    message: "Quiz deleted successfully",
    data: result
  });
});
var QuizController = {
  getAllQuizzes: getAllQuizzes2,
  getQuizById: getQuizById2,
  createQuiz: createQuiz2,
  updateQuiz: updateQuiz2,
  deleteQuiz: deleteQuiz2
};

// src/app/module/quiz/quiz.validation.ts
import { z as z9 } from "zod";
var createQuizValidationSchema = z9.object({
  cardId: z9.string().uuid(),
  type: z9.nativeEnum(QuizType),
  question: z9.string().min(1, "Question is required"),
  options: z9.unknown().optional(),
  correctAnswer: z9.unknown(),
  points: z9.number().int().min(0).default(1)
});
var updateQuizValidationSchema = z9.object({
  cardId: z9.string().uuid().optional(),
  type: z9.nativeEnum(QuizType).optional(),
  question: z9.string().min(1).optional(),
  options: z9.unknown().optional(),
  correctAnswer: z9.unknown().optional(),
  points: z9.number().int().min(0).optional()
});

// src/app/module/quiz/quiz.route.ts
var router11 = Router11();
router11.get("/", QuizController.getAllQuizzes);
router11.get("/:id", QuizController.getQuizById);
router11.post("/", validateRequest(createQuizValidationSchema), QuizController.createQuiz);
router11.put("/:id", validateRequest(updateQuizValidationSchema), QuizController.updateQuiz);
router11.delete("/:id", QuizController.deleteQuiz);
var QuizRoutes = router11;

// src/app/module/card-content/card-content.route.ts
import { Router as Router12 } from "express";

// src/app/module/card-content/card-content.controller.ts
import status29 from "http-status";

// src/app/module/card-content/card-content.service.ts
import status28 from "http-status";
var getAllCardContents = async () => {
  return await prisma.cardContent.findMany({
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var getCardContentById = async (id) => {
  const content = await prisma.cardContent.findUnique({
    where: { id },
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
  if (!content) throw new AppError_default(status28.NOT_FOUND, "Card content not found");
  return content;
};
var createCardContent = async (payload) => {
  return await prisma.cardContent.create({
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var updateCardContent = async (id, payload) => {
  const content = await prisma.cardContent.findUnique({ where: { id } });
  if (!content) throw new AppError_default(status28.NOT_FOUND, "Card content not found");
  return await prisma.cardContent.update({
    where: { id },
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var deleteCardContent = async (id) => {
  const content = await prisma.cardContent.findUnique({ where: { id } });
  if (!content) throw new AppError_default(status28.NOT_FOUND, "Card content not found");
  return await prisma.cardContent.delete({
    where: { id }
  });
};
var CardContentService = {
  getAllCardContents,
  getCardContentById,
  createCardContent,
  updateCardContent,
  deleteCardContent
};

// src/app/module/card-content/card-content.controller.ts
var getAllCardContents2 = catchAsync(async (req, res) => {
  const result = await CardContentService.getAllCardContents();
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Card contents retrieved successfully",
    data: result
  });
});
var getCardContentById2 = catchAsync(async (req, res) => {
  const result = await CardContentService.getCardContentById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Card content retrieved successfully",
    data: result
  });
});
var createCardContent2 = catchAsync(async (req, res) => {
  const result = await CardContentService.createCardContent(req.body);
  sendResponse(res, {
    httpStatusCode: status29.CREATED,
    success: true,
    message: "Card content created successfully",
    data: result
  });
});
var updateCardContent2 = catchAsync(async (req, res) => {
  const result = await CardContentService.updateCardContent(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Card content updated successfully",
    data: result
  });
});
var deleteCardContent2 = catchAsync(async (req, res) => {
  const result = await CardContentService.deleteCardContent(req.params.id);
  sendResponse(res, {
    httpStatusCode: status29.OK,
    success: true,
    message: "Card content deleted successfully",
    data: result
  });
});
var CardContentController = {
  getAllCardContents: getAllCardContents2,
  getCardContentById: getCardContentById2,
  createCardContent: createCardContent2,
  updateCardContent: updateCardContent2,
  deleteCardContent: deleteCardContent2
};

// src/app/module/card-content/card-content.validation.ts
import { z as z10 } from "zod";
var createCardContentValidationSchema = z10.object({
  cardId: z10.string().uuid("Invalid card ID"),
  imageUrl: z10.string().url().optional().or(z10.literal("")),
  soundUrl: z10.string().url().optional().or(z10.literal("")),
  xPosition: z10.number().int().min(0).default(0),
  yPosition: z10.number().int().min(0).default(0),
  width: z10.number().int().min(1).default(100),
  height: z10.number().int().min(1).default(100),
  seq: z10.number().int().default(0)
});
var updateCardContentValidationSchema = z10.object({
  cardId: z10.string().uuid().optional(),
  imageUrl: z10.string().url().optional().or(z10.literal("")),
  soundUrl: z10.string().url().optional().or(z10.literal("")),
  xPosition: z10.number().int().min(0).optional(),
  yPosition: z10.number().int().min(0).optional(),
  width: z10.number().int().min(1).optional(),
  height: z10.number().int().min(1).optional(),
  seq: z10.number().int().optional()
});

// src/app/module/card-content/card-content.route.ts
var router12 = Router12();
router12.get("/", CardContentController.getAllCardContents);
router12.get("/:id", CardContentController.getCardContentById);
router12.post("/", validateRequest(createCardContentValidationSchema), CardContentController.createCardContent);
router12.put("/:id", validateRequest(updateCardContentValidationSchema), CardContentController.updateCardContent);
router12.delete("/:id", CardContentController.deleteCardContent);
var CardContentRoutes = router12;

// src/app/module/material/material.route.ts
import { Router as Router13 } from "express";

// src/app/module/material/material.controller.ts
import status31 from "http-status";

// src/app/module/material/material.service.ts
import status30 from "http-status";
var getAllMaterials = async () => {
  return await prisma.material.findMany({
    where: { isDeleted: false },
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var getMaterialById = async (id) => {
  const material = await prisma.material.findUnique({
    where: { id, isDeleted: false },
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
  if (!material) throw new AppError_default(status30.NOT_FOUND, "Material not found");
  return material;
};
var createMaterial = async (payload) => {
  return await prisma.material.create({
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var updateMaterial = async (id, payload) => {
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material) throw new AppError_default(status30.NOT_FOUND, "Material not found");
  return await prisma.material.update({
    where: { id },
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    }
  });
};
var deleteMaterial = async (id) => {
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material) throw new AppError_default(status30.NOT_FOUND, "Material not found");
  return await prisma.material.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var MaterialService = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};

// src/app/module/material/material.controller.ts
var getAllMaterials2 = catchAsync(async (req, res) => {
  const result = await MaterialService.getAllMaterials();
  sendResponse(res, {
    httpStatusCode: status31.OK,
    success: true,
    message: "Materials retrieved successfully",
    data: result
  });
});
var getMaterialById2 = catchAsync(async (req, res) => {
  const result = await MaterialService.getMaterialById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status31.OK,
    success: true,
    message: "Material retrieved successfully",
    data: result
  });
});
var createMaterial2 = catchAsync(async (req, res) => {
  const result = await MaterialService.createMaterial(req.body);
  sendResponse(res, {
    httpStatusCode: status31.CREATED,
    success: true,
    message: "Material created successfully",
    data: result
  });
});
var updateMaterial2 = catchAsync(async (req, res) => {
  const result = await MaterialService.updateMaterial(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status31.OK,
    success: true,
    message: "Material updated successfully",
    data: result
  });
});
var deleteMaterial2 = catchAsync(async (req, res) => {
  const result = await MaterialService.deleteMaterial(req.params.id);
  sendResponse(res, {
    httpStatusCode: status31.OK,
    success: true,
    message: "Material deleted successfully",
    data: result
  });
});
var MaterialController = {
  getAllMaterials: getAllMaterials2,
  getMaterialById: getMaterialById2,
  createMaterial: createMaterial2,
  updateMaterial: updateMaterial2,
  deleteMaterial: deleteMaterial2
};

// src/app/module/material/material.validation.ts
import { z as z11 } from "zod";
var createMaterialValidationSchema = z11.object({
  title: z11.string().min(1, "Title is required"),
  content: z11.string().min(1, "Content is required"),
  type: z11.string().optional(),
  cardId: z11.string().uuid().optional()
});
var updateMaterialValidationSchema = z11.object({
  title: z11.string().min(1).optional(),
  content: z11.string().optional(),
  type: z11.string().optional(),
  cardId: z11.string().uuid().optional()
});

// src/app/module/material/material.route.ts
var router13 = Router13();
router13.get("/", MaterialController.getAllMaterials);
router13.get("/:id", MaterialController.getMaterialById);
router13.post("/", validateRequest(createMaterialValidationSchema), MaterialController.createMaterial);
router13.put("/:id", validateRequest(updateMaterialValidationSchema), MaterialController.updateMaterial);
router13.delete("/:id", MaterialController.deleteMaterial);
var MaterialRoutes = router13;

// src/app/module/assessment/assessment.route.ts
import { Router as Router14 } from "express";

// src/app/module/assessment/assessment.controller.ts
import status33 from "http-status";

// src/app/module/assessment/assessment.service.ts
import status32 from "http-status";
var getAllAssessments = async () => {
  return await prisma.assessment.findMany({
    where: { isDeleted: false }
  });
};
var getAssessmentById = async (id) => {
  const assessment = await prisma.assessment.findUnique({
    where: { id, isDeleted: false }
  });
  if (!assessment) throw new AppError_default(status32.NOT_FOUND, "Assessment not found");
  return assessment;
};
var createAssessment = async (payload) => {
  return await prisma.assessment.create({
    data: payload
  });
};
var updateAssessment = async (id, payload) => {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new AppError_default(status32.NOT_FOUND, "Assessment not found");
  return await prisma.assessment.update({
    where: { id },
    data: payload
  });
};
var deleteAssessment = async (id) => {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new AppError_default(status32.NOT_FOUND, "Assessment not found");
  return await prisma.assessment.update({
    where: { id },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
};
var AssessmentService = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment
};

// src/app/module/assessment/assessment.controller.ts
var getAllAssessments2 = catchAsync(async (req, res) => {
  const result = await AssessmentService.getAllAssessments();
  sendResponse(res, {
    httpStatusCode: status33.OK,
    success: true,
    message: "Assessments retrieved successfully",
    data: result
  });
});
var getAssessmentById2 = catchAsync(async (req, res) => {
  const result = await AssessmentService.getAssessmentById(req.params.id);
  sendResponse(res, {
    httpStatusCode: status33.OK,
    success: true,
    message: "Assessment retrieved successfully",
    data: result
  });
});
var createAssessment2 = catchAsync(async (req, res) => {
  const result = await AssessmentService.createAssessment(req.body);
  sendResponse(res, {
    httpStatusCode: status33.CREATED,
    success: true,
    message: "Assessment created successfully",
    data: result
  });
});
var updateAssessment2 = catchAsync(async (req, res) => {
  const result = await AssessmentService.updateAssessment(req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status33.OK,
    success: true,
    message: "Assessment updated successfully",
    data: result
  });
});
var deleteAssessment2 = catchAsync(async (req, res) => {
  const result = await AssessmentService.deleteAssessment(req.params.id);
  sendResponse(res, {
    httpStatusCode: status33.OK,
    success: true,
    message: "Assessment deleted successfully",
    data: result
  });
});
var AssessmentController = {
  getAllAssessments: getAllAssessments2,
  getAssessmentById: getAssessmentById2,
  createAssessment: createAssessment2,
  updateAssessment: updateAssessment2,
  deleteAssessment: deleteAssessment2
};

// src/app/module/assessment/assessment.validation.ts
import { z as z12 } from "zod";
var questionSchema = z12.object({
  question: z12.string().min(1, "Question is required"),
  answer: z12.boolean("Answer must be true or false")
});
var createAssessmentValidationSchema = z12.object({
  title: z12.string().min(1, "Title is required"),
  description: z12.string().optional(),
  cardId: z12.string().uuid().optional(),
  questions: z12.array(questionSchema).min(1, "At least one question required"),
  passingScore: z12.number().int().min(0).max(100).default(60)
});
var updateAssessmentValidationSchema = z12.object({
  title: z12.string().min(1).optional(),
  description: z12.string().optional(),
  cardId: z12.string().uuid().optional(),
  questions: z12.array(questionSchema).optional(),
  passingScore: z12.number().int().min(0).max(100).optional()
});

// src/app/module/assessment/assessment.route.ts
var router14 = Router14();
router14.get("/", AssessmentController.getAllAssessments);
router14.get("/:id", AssessmentController.getAssessmentById);
router14.post("/", validateRequest(createAssessmentValidationSchema), AssessmentController.createAssessment);
router14.put("/:id", validateRequest(updateAssessmentValidationSchema), AssessmentController.updateAssessment);
router14.delete("/:id", AssessmentController.deleteAssessment);
var AssessmentRoutes = router14;

// src/app/routes/index.ts
var router15 = Router15();
router15.use("/auth", AuthRoutes);
router15.use("/admin", AdminRoutes);
router15.use("/teacher", TeacherRoutes);
router15.use("/student", StudentRoutes);
router15.use("/organizations", OrganizationRoutes);
router15.use("/classes", ClassRoutes);
router15.use("/lookups", LookupRoutes);
router15.use("/word-story-cards", WordStoryCardRoutes);
router15.use("/messages", MessageRoutes);
router15.use("/tasks", TaskRoutes);
router15.use("/quizzes", QuizRoutes);
router15.use("/card-contents", CardContentRoutes);
router15.use("/materials", MaterialRoutes);
router15.use("/assessments", AssessmentRoutes);
var IndexRoutes = router15;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import path2 from "path";
var app = express();
app.set("view engine", "ejs");
app.set("views", path2.resolve(process.cwd(), `src/app/templates`));
app.use(cors({
  origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/api/auth", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", IndexRoutes);
app.get("/", async (req, res) => {
  res.status(201).json({
    success: true,
    message: "API is working"
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/app/utils/seed.ts
var seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN
      }
    });
    if (isSuperAdminExist) {
      console.log("Super admin already exists. Skipping seeding super admin.");
      return;
    }
    const superAdminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.SUPER_ADMIN_EMAIL,
        password: envVars.SUPER_ADMIN_PASSWORD,
        name: "Super Admin",
        role: Role.SUPER_ADMIN,
        needPasswordChange: false
      }
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: superAdminUser.user.id
        },
        data: {
          emailVerified: true
        }
      });
      await tx.admin.create({
        data: {
          userId: superAdminUser.user.id,
          name: "Super Admin",
          email: envVars.SUPER_ADMIN_EMAIL
        }
      });
    });
    const superAdmin = await prisma.admin.findFirst({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL
      },
      include: {
        user: true
      }
    });
    console.log("Super Admin Created ", superAdmin);
  } catch (error) {
    console.error("Error seeding super admin: ", error);
  }
};
var createAdmin3 = async (payload) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    });
    if (existingUser) {
      console.log(`Admin with email ${payload.email} already exists.`);
      return null;
    }
    const userData = await auth.api.signUpEmail({
      body: {
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: Role.ADMIN,
        needPasswordChange: false
      }
    });
    const admin = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userData.user.id
        },
        data: {
          emailVerified: true
        }
      });
      return await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.name,
          email: payload.email,
          profilePhoto: payload.profilePhoto,
          contactNumber: payload.contactNumber
        }
      });
    });
    console.log(`Admin ${payload.name} created successfully!`);
    return admin;
  } catch (error) {
    console.error("Error creating admin: ", error);
    return null;
  }
};
var seedDefaultAdmins = async () => {
  const defaultAdmins = [
    {
      email: "admin@edutrack.com",
      password: "Admin123!",
      name: "Admin User"
    },
    {
      email: "support@edutrack.com",
      password: "Support123!",
      name: "Support Admin"
    }
  ];
  for (const admin of defaultAdmins) {
    await createAdmin3(admin);
  }
};
var runAllSeeds = async () => {
  console.log("Starting database seeding...");
  await seedSuperAdmin();
  await seedDefaultAdmins();
  console.log("Database seeding completed!");
};

// src/server.ts
var bootstrap = async () => {
  try {
    await runAllSeeds();
    app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
bootstrap();
