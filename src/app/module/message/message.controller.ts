import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { MessageService } from "./message.service";

const getAllMessages = catchAsync(async (req, res) => {
  const result = await MessageService.getAllMessages();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Messages retrieved successfully",
    data: result,
  });
});

const getMessageById = catchAsync(async (req, res) => {
  const result = await MessageService.getMessageById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Message retrieved successfully",
    data: result,
  });
});

const createMessage = catchAsync(async (req, res) => {
  const result = await MessageService.createMessage(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Message created successfully",
    data: result,
  });
});

const updateMessage = catchAsync(async (req, res) => {
  const result = await MessageService.updateMessage(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Message updated successfully",
    data: result,
  });
});

const deleteMessage = catchAsync(async (req, res) => {
  const result = await MessageService.deleteMessage(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Message deleted successfully",
    data: result,
  });
});

const markAsRead = catchAsync(async (req, res) => {
  const result = await MessageService.markAsRead(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Message marked as read successfully",
    data: result,
  });
});

export const MessageController = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
};
