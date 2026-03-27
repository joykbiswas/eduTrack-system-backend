import { Router } from "express";
import { CardContentController } from "./card-content.controller";
import { createCardContentValidationSchema, updateCardContentValidationSchema } from "./card-content.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.get("/", CardContentController.getAllCardContents);
router.get("/:id", CardContentController.getCardContentById);
router.post("/", validateRequest(createCardContentValidationSchema), CardContentController.createCardContent);
router.put("/:id", validateRequest(updateCardContentValidationSchema), CardContentController.updateCardContent);
router.delete("/:id", CardContentController.deleteCardContent);

export const CardContentRoutes = router;

