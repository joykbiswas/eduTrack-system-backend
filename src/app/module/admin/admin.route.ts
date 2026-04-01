import { Router } from "express";
// import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { createAdminValidationSchema, updateAdminValidationSchema } from "./admin.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Get all admins
router.get("/",
  checkAuth(Role.ADMIN,  Role.SUPER_ADMIN),
  AdminController.getAllAdmins);

// Get admin by ID
router.get("/:id",
   checkAuth(Role.ADMIN,  Role.SUPER_ADMIN), AdminController.getAdminById);

// Create new admin
router.post(
  "/",
   checkAuth(Role.ADMIN,  Role.SUPER_ADMIN),
  validateRequest(createAdminValidationSchema),
  AdminController.createAdmin
);

// Update admin
router.put(
  "/:id",
   checkAuth(Role.ADMIN,  Role.SUPER_ADMIN),
  validateRequest(updateAdminValidationSchema),
  AdminController.updateAdmin
);

// Delete admin
router.delete("/:id",
   checkAuth(Role.ADMIN,  Role.SUPER_ADMIN), AdminController.deleteAdmin);

export const AdminRoutes = router;