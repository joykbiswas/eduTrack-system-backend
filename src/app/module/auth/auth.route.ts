import { Router } from "express";
import { AuthController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

// Registration Route - handles both Student 
router.post(
    "/register",
    validateRequest(AuthValidation.registration),
    AuthController.register
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

router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);

export const AuthRoutes = router;
