import { Router } from "express";
import { TeacherController } from "./teacher.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createTeacherValidationSchema, updateTeacherValidationSchema } from "./teacher.validation";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

// Get all teachers
router.get("/", TeacherController.getAllTeachers);

// Get teacher by ID
router.get("/:id", TeacherController.getTeacherById);

// Create new teacher
router.post(
  "/",
  checkAuth,
  validateRequest(createTeacherValidationSchema),
  TeacherController.createTeacher
);

// Update teacher
router.put(
  "/:id",
  validateRequest(updateTeacherValidationSchema),
  TeacherController.updateTeacher
);

// Delete teacher
router.delete("/:id", TeacherController.deleteTeacher);

export const TeacherRoutes = router;
