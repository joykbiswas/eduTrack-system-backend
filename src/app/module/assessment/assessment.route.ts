import { Router } from "express";
import { AssessmentController } from "./assessment.controller";
import { createAssessmentValidationSchema, updateAssessmentValidationSchema } from "./assessment.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.get("/", AssessmentController.getAllAssessments);
router.get("/:id", AssessmentController.getAssessmentById);
router.post("/", validateRequest(createAssessmentValidationSchema), AssessmentController.createAssessment);
router.put("/:id", validateRequest(updateAssessmentValidationSchema), AssessmentController.updateAssessment);
router.delete("/:id", AssessmentController.deleteAssessment);

export const AssessmentRoutes = router;

