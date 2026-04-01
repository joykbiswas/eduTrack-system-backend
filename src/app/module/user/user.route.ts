// import { Router } from "express";
// import { UserController } from "./user.controller";
// import {  updateTeacherZodSchema } from "./user.validation";
// import { validateRequest } from "../../middleware/validateRequest";
// // import { Role } from "../../../generated/prisma/enums";
// // import { checkAuth } from "../../middleware/checkAuth";

// const router = Router();

// // Get All Teachers (Admin only)
// router.get(
//     "/",
//     // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     UserController.getAllTeachers
// );

// // Get Single Teacher (Admin only)
// router.get(
//     "/:id",
//     // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     UserController.getSingleTeacher
// );

// // Update Teacher (Admin only)
// router.patch(
//     "/:id",
//     // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     validateRequest(updateTeacherZodSchema),
//     UserController.updateTeacher
// );

// // Delete Teacher (Admin only)
// router.delete(
//     "/:id",
//     // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//     UserController.deleteTeacher
// );

// export const UserRoutes = router;
