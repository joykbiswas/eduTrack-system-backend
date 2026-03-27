import { Router } from "express";
import { QuizController } from "./quiz.controller";
import { createQuizValidationSchema, updateQuizValidationSchema } from "./quiz.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.get("/", QuizController.getAllQuizzes);
router.get("/:id", QuizController.getQuizById);
router.post("/", validateRequest(createQuizValidationSchema), QuizController.createQuiz);
router.put("/:id", validateRequest(updateQuizValidationSchema), QuizController.updateQuiz);
router.delete("/:id", QuizController.deleteQuiz);

export const QuizRoutes = router;

