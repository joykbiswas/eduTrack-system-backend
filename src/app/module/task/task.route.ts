import { Router } from "express";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.get("/", TaskController.getAllTasks);
router.get("/:id", TaskController.getTaskById);
router.post("/", TaskController.createTask);
router.put("/:id", TaskController.updateTask);
router.post("/:cardId/assign", validateRequest(TaskValidation.assignCard), TaskController.assignCardToStudent);
router.delete("/:id", TaskController.deleteTask);

export const TaskRoutes = router;
