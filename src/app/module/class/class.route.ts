import { Router } from "express";
import { ClassController } from "./class.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createClassValidationSchema, updateClassValidationSchema } from "./class.validation";

const router = Router();

router.get("/", ClassController.getAllClasses);

router.get("/:id", ClassController.getClassById);
router.post("/", validateRequest(createClassValidationSchema), ClassController.createClass);
router.put("/:id", validateRequest(updateClassValidationSchema), ClassController.updateClass);
router.delete("/:id", ClassController.deleteClass);

export const ClassRoutes = router;
