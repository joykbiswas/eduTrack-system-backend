import { Router } from "express";
import { MessageController } from "./message.controller";

const router = Router();

router.get("/", MessageController.getAllMessages);
router.get("/:id", MessageController.getMessageById);
router.post("/", MessageController.createMessage);
router.put("/:id", MessageController.updateMessage);
router.delete("/:id", MessageController.deleteMessage);
router.post("/:id/read", MessageController.markAsRead);

export const MessageRoutes = router;
