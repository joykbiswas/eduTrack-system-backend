// import { Request, Response } from "express";
// import status from "http-status";
// import { catchAsync } from "../../shared/catchAsync";
// import { sendResponse } from "../../shared/sendResponse";
// import { UserService } from "./user.service";

// // ==================== CREATE TEACHER ====================
// const createTeacher = catchAsync(
//     async (req: Request, res: Response) => {
//         const payload = req.body;
//         const result = await UserService.createTeacher(payload);

//         sendResponse(res, {
//             httpStatusCode: status.CREATED,
//             success: true,
//             message: "Teacher registered successfully",
//             data: result,
//         });
//     }
// );

// // ==================== GET ALL TEACHERS ====================
// const getAllTeachers = catchAsync(
//     async (req: Request, res: Response) => {
//         const filters = {
//             searchTerm: req.query.searchTerm as string,
//             name: req.query.name as string,
//             email: req.query.email as string,
//             gender: req.query.gender as "MALE" | "FEMALE" | "OTHER" | undefined,
//             designation: req.query.designation as string,
//             qualification: req.query.qualification as string,
//         };
//         const options = {
//             page: Number(req.query.page) || 1,
//             limit: Number(req.query.limit) || 10,
//             sortBy: req.query.sortBy as string || "createdAt",
//             sortOrder: req.query.sortOrder as "asc" | "desc" || "desc",
//         };

//         const result = await UserService.getAllTeachers(filters, options);

//         sendResponse(res, {
//             httpStatusCode: status.OK,
//             success: true,
//             message: "Teachers retrieved successfully",
//             data: result,
//         });
//     }
// );

// // ==================== GET SINGLE TEACHER ====================
// const getSingleTeacher = catchAsync(
//     async (req: Request, res: Response) => {
//         const { id } = req.params;
//         const result = await UserService.getSingleTeacher(id as string);

//         sendResponse(res, {
//             httpStatusCode: status.OK,
//             success: true,
//             message: "Teacher retrieved successfully",
//             data: result,
//         });
//     }
// );

// // ==================== UPDATE TEACHER ====================
// const updateTeacher = catchAsync(
//     async (req: Request, res: Response) => {
//         const { id } = req.params;
//         const payload = req.body;
//         const result = await UserService.updateTeacher(id as string, payload);

//         sendResponse(res, {
//             httpStatusCode: status.OK,
//             success: true,
//             message: "Teacher updated successfully",
//             data: result,
//         });
//     }
// );

// // ==================== DELETE TEACHER ====================
// const deleteTeacher = catchAsync(
//     async (req: Request, res: Response) => {
//         const { id } = req.params;
//         const result = await UserService.deleteTeacher( id as string);

//         sendResponse(res, {
//             httpStatusCode: status.OK,
//             success: true,
//             message: "Teacher deleted successfully",
//             data: result,
//         });
//     }
// );

// // ==================== EXPORT ====================
// export const UserController = {
//     createTeacher,
//     getAllTeachers,
//     getSingleTeacher,
//     updateTeacher,
//     deleteTeacher,
// };
