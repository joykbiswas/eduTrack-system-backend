import { Router } from "express";
import { StudentController } from "./student.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {  updateStudentValidationSchema, enrollStudentValidationSchema } from "./student.validation";
// import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

// Get all students
router.get("/", StudentController.getAllStudents);

// Get student by ID
router.get("/:id", StudentController.getStudentById);


// Update student
router.put(
  "/:id",
  validateRequest(updateStudentValidationSchema),
  StudentController.updateStudent
);

// Enroll student in class
router.post(
  "/:id/enroll",
  validateRequest(enrollStudentValidationSchema),
  StudentController.enrollInClass
);

// Delete student
router.delete("/:id", StudentController.deleteStudent);

export const StudentRoutes = router;
