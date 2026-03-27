import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { CardContentService } from "./card-content.service";

const getAllCardContents = catchAsync(async (req, res) => {
  const result = await CardContentService.getAllCardContents();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card contents retrieved successfully",
    data: result,
  });
});

const getCardContentById = catchAsync(async (req, res) => {
  const result = await CardContentService.getCardContentById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card content retrieved successfully",
    data: result,
  });
});

const createCardContent = catchAsync(async (req, res) => {
  const result = await CardContentService.createCardContent(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Card content created successfully",
    data: result,
  });
});

const updateCardContent = catchAsync(async (req, res) => {
  const result = await CardContentService.updateCardContent(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card content updated successfully",
    data: result,
  });
});

const deleteCardContent = catchAsync(async (req, res) => {
  const result = await CardContentService.deleteCardContent(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card content deleted successfully",
    data: result,
  });
});

export const CardContentController = {
  getAllCardContents,
  getCardContentById,
  createCardContent,
  updateCardContent,
  deleteCardContent,
};

