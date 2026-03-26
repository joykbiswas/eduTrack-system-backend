import { Router } from "express";
import { LookupController } from "./lookup.controller";

const router = Router();

router.get("/", LookupController.getAllLookups);
router.get("/:id", LookupController.getLookupById);
router.post("/", LookupController.createLookup);
router.put("/:id", LookupController.updateLookup);
router.delete("/:id", LookupController.deleteLookup);
router.post("/:id/values", LookupController.addLookupValue);

export const LookupRoutes = router;
