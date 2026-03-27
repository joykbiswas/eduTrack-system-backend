import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { WordStoryCardService } from "./word-story-card.service";

const getAllCards = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.getAllCards();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Cards retrieved successfully",
    data: result,
  });
});

const getCardById = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.getCardById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card retrieved successfully",
    data: result,
  });
});

const createCard = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.createCard(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Card created successfully",
    data: result,
  });
});

const updateCard = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.updateCard(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card updated successfully",
    data: result,
  });
});

const deleteCard = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.deleteCard(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card deleted successfully",
    data: result,
  });
});

const publishCard = catchAsync(async (req, res) => {
  const result = await WordStoryCardService.publishCard(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Card published successfully",
    data: result,
  });
});

export const WordStoryCardController = {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  publishCard,
};
