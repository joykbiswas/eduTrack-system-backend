import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { TeacherController } from "./teacher.controller";
import { createTeacherZodSchema, updateTeacherZodSchema } from "./teacher.validation";
// import { Role } from "../../../generated/prisma/enums";
// import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

// Create Teacher (Admin only)
router.post(
   "/create-teacher",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTeacherZodSchema),
    TeacherController.createTeacher
);

// Get All Teachers (Admin only)
router.get(
    "/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TeacherController.getAllTeachers
);

// Get Single Teacher (Admin only)
router.get(
    "/:id",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TeacherController.getSingleTeacher
);

// Update Teacher (Admin only)
router.patch(
    "/:id",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTeacherZodSchema),
    TeacherController.updateTeacher
);

// Delete Teacher (Admin only)
router.delete(
    "/:id",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    TeacherController.deleteTeacher
);

export const TeacherRoutes = router;
