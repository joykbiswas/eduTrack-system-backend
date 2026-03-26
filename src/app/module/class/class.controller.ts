import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ClassService } from "./class.service";

const getAllClasses = catchAsync(async (req, res) => {
  const result = await ClassService.getAllClasses();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Classes retrieved successfully",
    data: result,
  });
});

const getClassById = catchAsync(async (req, res) => {
  const result = await ClassService.getClassById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Class retrieved successfully",
    data: result,
  });
});

const createClass = catchAsync(async (req, res) => {
  const result = await ClassService.createClass(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Class created successfully",
    data: result,
  });
});

const updateClass = catchAsync(async (req, res) => {
  const result = await ClassService.updateClass(req.params.id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Class updated successfully",
    data: result,
  });
});

const deleteClass = catchAsync(async (req, res) => {
  const result = await ClassService.deleteClass(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Class deleted successfully",
    data: result,
  });
});

export const ClassController = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
