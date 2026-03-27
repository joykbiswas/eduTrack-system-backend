import { Router } from "express";
import { MaterialController } from "./material.controller";
import { createMaterialValidationSchema, updateMaterialValidationSchema } from "./material.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.get("/", MaterialController.getAllMaterials);
router.get("/:id", MaterialController.getMaterialById);
router.post("/", validateRequest(createMaterialValidationSchema), MaterialController.createMaterial);
router.put("/:id", validateRequest(updateMaterialValidationSchema), MaterialController.updateMaterial);
router.delete("/:id", MaterialController.deleteMaterial);

export const MaterialRoutes = router;

