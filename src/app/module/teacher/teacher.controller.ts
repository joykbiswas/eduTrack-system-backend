import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TeacherService } from "./teacher.service";
import { ICreateTeacherPayload } from "./teacher.interface";

const getAllTeachers = catchAsync(async (req, res) => {
  const result = await TeacherService.getAllTeachers();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Teachers retrieved successfully",
    data: result,
  });
});

const getTeacherById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherService.getTeacherById(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Teacher retrieved successfully",
    data: result,
  });
});

const createTeacher = catchAsync(async (req, res) => {
  const payload: ICreateTeacherPayload = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: status.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
    });
  }

  const result = await TeacherService.createTeacher(userId, payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Teacher created successfully",
    data: result,
  });
});

const updateTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await TeacherService.updateTeacher(id, payload);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Teacher updated successfully",
    data: result,
  });
});

const deleteTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TeacherService.deleteTeacher(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Teacher deleted successfully",
    data: result,
  });
});

export const TeacherController = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
