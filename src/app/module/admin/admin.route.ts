import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { createAdminValidationSchema, updateAdminValidationSchema } from "./admin.validation";

const router = Router();

// Get all admins
router.get("/", AdminController.getAllAdmins);

// Get admin by ID
router.get("/:id", AdminController.getAdminById);

// Create new admin
router.post(
  "/",
  checkAuth,
  validateRequest(createAdminValidationSchema),
  AdminController.createAdmin
);

// Update admin
router.put(
  "/:id",
  validateRequest(updateAdminValidationSchema),
  AdminController.updateAdmin
);

// Delete admin
router.delete("/:id", AdminController.deleteAdmin);

export const AdminRoutes = router;