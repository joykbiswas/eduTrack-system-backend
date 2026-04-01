import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TaskService } from "./task.service";

const getAllTasks = catchAsync(async (req, res) => {
  const result = await TaskService.getAllTasks();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

const getTaskById = catchAsync(async (req, res) => {
  const result = await TaskService.getTaskById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const createTask = catchAsync(async (req, res) => {
  const result = await TaskService.createTask(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req, res) => {
  const result = await TaskService.updateTask(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const assignCardToStudent = catchAsync(async (req, res) => {
  
  const result = await TaskService.assignCardToStudent(req.params.cardId as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card assigned to student successfully",
    data: result,
  });
});


const deleteTask = catchAsync(async (req, res) => {
  const result = await TaskService.deleteTask(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

export const TaskController = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  assignCardToStudent,
  deleteTask,
};


