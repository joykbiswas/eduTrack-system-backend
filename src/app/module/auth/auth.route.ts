import { Router } from "express";
import { AuthController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

// Registration Routes
router.post(
    "/register/student",
    validateRequest(AuthValidation.studentRegistration),
    AuthController.registerStudent
);

router.post(
    "/register/teacher",
    validateRequest(AuthValidation.teacherRegistration),
    AuthController.registerTeacher
);

// Login Route
router.post(
    "/login",
    validateRequest(AuthValidation.login),
    AuthController.loginUser
);

// Protected Routes
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

// Email Verification
router.post(
    "/verify-email",
    validateRequest(AuthValidation.verifyEmail),
    AuthController.verifyEmail
);

// Password Reset
router.post(
    "/forget-password",
    validateRequest(AuthValidation.forgetPassword),
    AuthController.forgetPassword
);

router.post(
    "/reset-password",
    validateRequest(AuthValidation.resetPassword),
    AuthController.resetPassword
);

// Google OAuth Routes
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);

export const AuthRoutes = router;
