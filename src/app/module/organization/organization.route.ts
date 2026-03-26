import { Router } from "express";
import { OrganizationController } from "./organization.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createOrganizationValidationSchema, updateOrganizationValidationSchema } from "./organization.validation";

const router = Router();

router.get("/", OrganizationController.getAllOrganizations);
router.get("/:id", OrganizationController.getOrganizationById);
router.post("/", validateRequest(createOrganizationValidationSchema), OrganizationController.createOrganization);
router.put("/:id", validateRequest(updateOrganizationValidationSchema), OrganizationController.updateOrganization);
router.delete("/:id", OrganizationController.deleteOrganization);

export const OrganizationRoutes = router;
