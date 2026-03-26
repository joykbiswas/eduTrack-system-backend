import { Router } from "express";
import { WordStoryCardController } from "./word-story-card.controller";

const router = Router();

router.get("/", WordStoryCardController.getAllCards);
router.get("/:id", WordStoryCardController.getCardById);
router.post("/", WordStoryCardController.createCard);
router.put("/:id", WordStoryCardController.updateCard);
router.delete("/:id", WordStoryCardController.deleteCard);
router.post("/:id/publish", WordStoryCardController.publishCard);

export const WordStoryCardRoutes = router;
