import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StudentService } from "./student.service";
import { ICreateStudentPayload, IEnrollStudentInClassPayload } from "./student.interface";

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudents();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Students retrieved successfully",
    data: result,
  });
});

const getStudentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getStudentById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Student retrieved successfully",
    data: result,
  });
});

const createStudent = catchAsync(async (req, res) => {
  const payload: ICreateStudentPayload = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
    });
  }

  const result = await StudentService.createStudent(userId, payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Student created successfully",
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await StudentService.updateStudent(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Student updated successfully",
    data: result,
  });
});

const enrollInClass = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload: IEnrollStudentInClassPayload = req.body;

  const result = await StudentService.enrollInClass(id as string, payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Student enrolled in class successfully",
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentService.deleteStudent(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Student deleted successfully",
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  enrollInClass,
  deleteStudent,
};
