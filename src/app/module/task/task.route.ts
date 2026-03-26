import { Router } from "express";
import { TaskController } from "./task.controller";

const router = Router();

router.get("/", TaskController.getAllTasks);
router.get("/:id", TaskController.getTaskById);
router.post("/", TaskController.createTask);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export const TaskRoutes = router;
